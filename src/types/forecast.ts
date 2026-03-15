export interface UploadResponse {
  rows: number;
  date_min: string;
  date_max: string;
  y_dist_type: number;
  y_dist_label: string;
}

export interface QuartersResponse {
  quarters: string[];
  default_quarter: string;
}

export interface ValidationData {
  fact_metric: number;
  forecast_metric: number;
  percentage_diff: number;
  percentage_diff_type: string;
  percentage_diff_message: string;
  percentage_diff_color: string;
  last_quarter_start: string;
  last_quarter_end: string;
  val_quarter: string;
  val_dates: string[];
  y_fact: number[];
  y_forecast: number[];
}

export interface DistributionData {
  mean_yhat: number;
  std_yhat: number;
  sigma_1_positive: number;
  sigma_1_negative: number;
  sigma_2_positive: number;
  sigma_2_negative: number;
  sigma_3_positive: number;
  sigma_3_negative: number;
}

export interface CombinedChartData {
  dates: string[];
  values: number[];
  source: string[];
}

export interface ScenarioRow {
  month: string;
  pessimistic: number;
  realistic: number;
  optimistic: number;
}

export interface ForecastResponse {
  selected_quarter: string;
  start_date: string;
  end_date: string;
  validation: ValidationData;
  distribution: DistributionData;
  combined_chart: CombinedChartData;
  scenarios: ScenarioRow[];
}
