import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split

from holidays import holidays
from quarters import (
    get_current_quarter_start,
    get_quarter_start_date,
    convert_to_quarter,
    get_last_completed_quarter_start_date,
    get_previous_quarter_start_date,
)

FEATURES = [
    "year", "month", "day", "day_of_week",
    "week_of_year", "day_of_year", "quarter",
    "is_holiday", "is_weekend",
]

MONTHS_RU = {
    "January": "Январь", "February": "Февраль", "March": "Март",
    "April": "Апрель", "May": "Май", "June": "Июнь",
    "July": "Июль", "August": "Август", "September": "Сентябрь",
    "October": "Октябрь", "November": "Ноябрь", "December": "Декабрь",
}


def check_integer_column(df, column):
    if not pd.api.types.is_numeric_dtype(df[column]):
        return 0
    return 1 if (df[column] % 1 == 0).all() else 0


def get_features(df):
    new_df = df.copy(deep=True)
    new_df["year"] = new_df["date_trunc"].dt.year
    new_df["month"] = new_df["date_trunc"].dt.month
    new_df["day"] = new_df["date_trunc"].dt.day
    new_df["day_of_week"] = new_df["date_trunc"].dt.dayofweek
    new_df["week_of_year"] = new_df["date_trunc"].dt.isocalendar().week.astype(int)
    new_df["day_of_year"] = new_df["date_trunc"].dt.dayofyear
    new_df["quarter"] = new_df["date_trunc"].dt.quarter
    new_df["is_holiday"] = new_df["date_trunc"].isin(holidays["ds"]).astype(int)
    new_df["is_weekend"] = new_df["day_of_week"].isin([5, 6]).astype(int)
    return new_df


def get_percentage_diff_type(x):
    return "выше" if x >= 0 else "ниже"


def get_percentage_diff_summary(x):
    x = abs(x)
    if x >= 75:
        return (
            "За последний квартал, данные критически разошлись с фактическими. "
            "Поэтому, в случае нашей метрики, на них не стоит обращать внимание.",
            "#FF0000",
        )
    elif x >= 50:
        return (
            "За последний квартал, прогностические данные очень сильно разошлись с фактическими. "
            "Поэтому, на них если стоит обращать внимание, то лишь минимально.",
            "#FFB6C1",
        )
    elif x >= 25:
        return (
            "За последний квартал, прогностические данные довольно ощутимо разошлись с фактическими. "
            "Доверять стоит с крайней опаской.",
            "#FFD700",
        )
    elif x >= 10:
        return (
            "За последний квартал, прогностические данные незначительно, но разошлись с фактическими. "
            "Не смотря на это, прогнозу, в целом, доверять можно.",
            "#90EE90",
        )
    else:
        return (
            "За последний квартал, прогностические данные практически не разошлись с фактическими. "
            "Прогнозу можно доверять.",
            "#008000",
        )


def run_forecast(df: pd.DataFrame, y_dist_type: int, quarter: int, year: int):
    start_date = get_quarter_start_date(year, quarter)
    end_date = pd.to_datetime(f"{year}-{int(quarter) * 3}-30")
    current_quarter = get_current_quarter_start()

    last_quarter_end = get_last_completed_quarter_start_date(start_date, current_quarter)
    next_quarter_start = get_previous_quarter_start_date(start_date, current_quarter)
    val_quarter = convert_to_quarter(last_quarter_end)

    # Current data for combined chart
    current_df = df[(df["date_trunc"] >= "2022-06-01") & (df["date_trunc"] < start_date)].copy()

    # Feature engineering
    df_feat = get_features(df)
    train = df_feat[(df_feat["date_trunc"] >= "2022-06-01") & (df_feat["date_trunc"] < last_quarter_end)]
    val = df_feat[(df_feat["date_trunc"] >= last_quarter_end) & (df_feat["date_trunc"] < next_quarter_start)]

    X = train[FEATURES]
    y = train[["y"]]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(random_state=42)
    model.fit(X_train, y_train)

    # Validation predictions
    X_forecast = val[FEATURES]
    val = val[["date_trunc", "y"]].copy()
    val["y_forecast"] = model.predict(X_forecast)
    val.rename(columns={"y": "y_fact"}, inplace=True)
    val["diff"] = np.abs(val["y_forecast"] - val["y_fact"])

    if y_dist_type == 1:
        fact_metric = float(val["y_fact"].sum())
        forecast_metric = float(val["y_forecast"].sum())
    else:
        fact_metric = float(val["y_fact"].mean())
        forecast_metric = float(val["y_forecast"].mean())

    percentage_diff = round((forecast_metric / fact_metric) * 100 - 100, 2)
    pct_type = get_percentage_diff_type(percentage_diff)
    pct_message, pct_color = get_percentage_diff_summary(percentage_diff)

    # Future forecast
    future_dates = pd.date_range(start=start_date, end=end_date, freq="D")
    future = pd.DataFrame({"date_trunc": future_dates})
    future_df = get_features(future)
    forecast_future = model.predict(future_df[FEATURES])

    if len(future_dates) != len(forecast_future):
        raise ValueError(
            f"Количество дат ({len(future_dates)}) не совпадает с количеством данных ({len(forecast_future)})"
        )

    future_df = pd.DataFrame({
        "date_trunc": future_dates,
        "y_forecast": forecast_future.flatten(),
    })
    future_df["month_date"] = future_df["date_trunc"].dt.to_period("M").dt.to_timestamp()

    if y_dist_type == 1:
        mean_yhat = float(future_df["y_forecast"].mean() * val.shape[0])
        std_yhat = float(future_df["y_forecast"].std() * val.shape[0])
    else:
        mean_yhat = float(future_df["y_forecast"].mean())
        std_yhat = float(future_df["y_forecast"].std())

    sigma_1_positive = mean_yhat + std_yhat
    sigma_1_negative = mean_yhat - std_yhat
    sigma_2_positive = mean_yhat + 2 * std_yhat
    sigma_2_negative = mean_yhat - 2 * std_yhat
    sigma_3_positive = mean_yhat + 3 * std_yhat
    sigma_3_negative = mean_yhat - 3 * std_yhat

    # Combined chart data
    current_df["source"] = "fact"
    future_plot = future_df.copy()
    future_plot["source"] = "forecast"
    future_plot.rename(columns={"y_forecast": "y"}, inplace=True)
    combined_df = pd.concat([current_df, future_plot]).sort_values(by="date_trunc")

    # Monthly scenario table
    positive_diff = sigma_1_positive / mean_yhat
    negative_diff = sigma_1_negative / mean_yhat

    if y_dist_type == 1:
        forecast_grouped = future_plot.groupby("month_date", as_index=False).agg(key_metric=("y", "sum"))
        forecast_grouped["pessimistic"] = (forecast_grouped["key_metric"] * negative_diff).astype(int)
        forecast_grouped["optimistic"] = (forecast_grouped["key_metric"] * positive_diff).astype(int)
        forecast_grouped["key_metric"] = forecast_grouped["key_metric"].astype(int)
    else:
        forecast_grouped = future_plot.groupby("month_date", as_index=False).agg(key_metric=("y", "mean"))
        forecast_grouped["pessimistic"] = np.round(forecast_grouped["key_metric"] * negative_diff, 2)
        forecast_grouped["optimistic"] = np.round(forecast_grouped["key_metric"] * positive_diff, 2)
        forecast_grouped["key_metric"] = np.round(forecast_grouped["key_metric"], 2)

    forecast_grouped["month_name"] = forecast_grouped["month_date"].dt.strftime("%B, %Y")
    for eng, rus in MONTHS_RU.items():
        forecast_grouped["month_name"] = forecast_grouped["month_name"].str.replace(eng, rus)

    scenarios = []
    for _, row in forecast_grouped.iterrows():
        scenarios.append({
            "month": row["month_name"],
            "pessimistic": float(row["pessimistic"]),
            "realistic": float(row["key_metric"]),
            "optimistic": float(row["optimistic"]),
        })

    return {
        "selected_quarter": f"{quarter}Q {year}",
        "start_date": start_date.strftime("%d.%m.%Y"),
        "end_date": end_date.strftime("%d.%m.%Y"),
        "validation": {
            "fact_metric": round(fact_metric, 2),
            "forecast_metric": round(forecast_metric, 2),
            "percentage_diff": percentage_diff,
            "percentage_diff_type": pct_type,
            "percentage_diff_message": pct_message,
            "percentage_diff_color": pct_color,
            "last_quarter_start": last_quarter_end.strftime("%d.%m.%Y"),
            "last_quarter_end": next_quarter_start.strftime("%d.%m.%Y"),
            "val_quarter": val_quarter,
            "val_dates": val["date_trunc"].dt.strftime("%Y-%m-%d").tolist(),
            "y_fact": val["y_fact"].tolist(),
            "y_forecast": val["y_forecast"].tolist(),
        },
        "distribution": {
            "mean_yhat": round(mean_yhat, 2),
            "std_yhat": round(std_yhat, 2),
            "sigma_1_positive": round(sigma_1_positive, 2),
            "sigma_1_negative": round(sigma_1_negative, 2),
            "sigma_2_positive": round(sigma_2_positive, 2),
            "sigma_2_negative": round(sigma_2_negative, 2),
            "sigma_3_positive": round(sigma_3_positive, 2),
            "sigma_3_negative": round(sigma_3_negative, 2),
        },
        "combined_chart": {
            "dates": combined_df["date_trunc"].dt.strftime("%Y-%m-%d").tolist(),
            "values": combined_df["y"].tolist(),
            "source": combined_df["source"].tolist(),
        },
        "scenarios": scenarios,
    }
