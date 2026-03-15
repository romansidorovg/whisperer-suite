import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta


def get_quarters():
    current_year = datetime.now().year
    quarters = []
    for year in range(current_year - 1, current_year + 2):
        for quarter in range(1, 5):
            quarters.append(f"{quarter}Q {year}")
    return quarters


def get_next_quarter():
    now = datetime.now()
    current_quarter = (now.month - 1) // 3 + 1
    current_year = now.year
    if current_quarter == 4:
        next_quarter = 1
        next_year = current_year + 1
    else:
        next_quarter = current_quarter + 1
        next_year = current_year
    return f"{next_quarter}Q {next_year}"


def get_current_quarter_start():
    now = datetime.now()
    quarter = (now.month - 1) // 3 + 1
    date_str = f"{now.year}-{(quarter - 1) * 3 + 1:02d}-01"
    return pd.Timestamp(date_str)


def get_quarter_start_date(year, quarter):
    return pd.to_datetime(f"{year}-{int(quarter) * 3 - 2}-01")


def convert_to_quarter(date):
    quarter = (date.month - 1) // 3 + 1
    return f"Q{quarter} {date.year}"


def get_last_completed_quarter_start_date(start_date, current_quarter):
    return min(start_date, current_quarter) - relativedelta(months=3)


def get_previous_quarter_start_date(start_date, current_quarter):
    return min(start_date, current_quarter)


def parse_selected_quarter(selected_quarter: str):
    """Parse '2Q 2025' into (quarter_int, year_int)."""
    quarter_str, year_str = selected_quarter.split("Q ")
    return int(quarter_str), int(year_str)
