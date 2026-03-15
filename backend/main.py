import io
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from quarters import get_quarters, get_next_quarter, parse_selected_quarter
from forecaster import run_forecast, check_integer_column

app = FastAPI(title="KPI Forecast API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
_state = {
    "df": None,
    "y_dist_type": None,
}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/quarters")
def quarters():
    return {
        "quarters": get_quarters(),
        "default_quarter": get_next_quarter(),
    }


@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Не удалось прочитать CSV: {str(e)}")

    if "ds" not in df.columns or "y" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="CSV должен содержать колонки 'ds' и 'y'.",
        )

    df.rename(columns={"ds": "date_trunc"}, inplace=True)
    df["date_trunc"] = pd.to_datetime(df["date_trunc"])
    df = df.sort_values("date_trunc").reset_index(drop=True)

    y_dist_type = check_integer_column(df, "y")
    _state["df"] = df
    _state["y_dist_type"] = y_dist_type

    return {
        "rows": len(df),
        "date_min": df["date_trunc"].min().strftime("%Y-%m-%d"),
        "date_max": df["date_trunc"].max().strftime("%Y-%m-%d"),
        "y_dist_type": y_dist_type,
        "y_dist_label": "Целочисленная (сумма)" if y_dist_type == 1 else "Непрерывная (среднее)",
    }


class ForecastRequest(BaseModel):
    selected_quarter: str  # e.g. "2Q 2025"


@app.post("/api/forecast")
def forecast(req: ForecastRequest):
    if _state["df"] is None:
        raise HTTPException(status_code=400, detail="Сначала загрузите CSV файл.")

    try:
        quarter, year = parse_selected_quarter(req.selected_quarter)
    except Exception:
        raise HTTPException(status_code=400, detail="Неверный формат квартала. Ожидается '2Q 2025'.")

    try:
        result = run_forecast(_state["df"], _state["y_dist_type"], quarter, year)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
