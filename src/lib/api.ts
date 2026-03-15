import type { UploadResponse, QuartersResponse, ForecastResponse } from "@/types/forecast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/api/health`);
  if (!res.ok) throw new Error("Backend недоступен");
  return res.json();
}

export async function uploadCSV(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Ошибка загрузки" }));
    throw new Error(err.detail || "Ошибка загрузки");
  }
  return res.json();
}

export async function getQuarters(): Promise<QuartersResponse> {
  const res = await fetch(`${API_URL}/api/quarters`);
  if (!res.ok) throw new Error("Не удалось получить кварталы");
  return res.json();
}

export async function runForecast(selectedQuarter: string): Promise<ForecastResponse> {
  const res = await fetch(`${API_URL}/api/forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selected_quarter: selectedQuarter }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Ошибка прогноза" }));
    throw new Error(err.detail || "Ошибка прогноза");
  }
  return res.json();
}
