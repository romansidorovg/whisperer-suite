

# KPI Forecast Studio — Implementation Plan

## Overview

Build a complete KPI forecasting application: a **Python/FastAPI backend** (generated as downloadable files) preserving the exact Streamlit logic, and a **React/TypeScript frontend** with Plotly charts and a premium mint-green dashboard aesthetic.

## Backend (Python files — generated in `backend/` folder, run separately)

Files to generate:
- `backend/main.py` — FastAPI app with endpoints: `POST /api/upload`, `GET /api/quarters`, `POST /api/forecast`, `GET /api/health`
- `backend/forecaster.py` — All data processing, feature engineering, XGBoost model training, validation, and scenario logic (exact copy of original behavior)
- `backend/holidays.py` — Fixed holidays DataFrame (2023–2025 Russian holidays, exactly as provided)
- `backend/quarters.py` — Quarter utility functions (`get_quarters`, `get_next_quarter`, `get_quarter_start_date`, etc.)
- `backend/requirements.txt` — `fastapi`, `uvicorn`, `pandas`, `numpy`, `xgboost`, `scikit-learn`, `python-dateutil`

The backend stores uploaded data in memory (module-level variable). All logic preserves original behavior: distribution detection, feature engineering with holidays, train/val splits from 2022-06-01, XGBRegressor(random_state=42), sigma calculations, scenario grouping with Russian month names.

## Frontend (React + TypeScript + Tailwind + Plotly)

### Design System Changes (`src/index.css`)
- Add mint/green gradient CSS variables, Inter + Space Grotesk fonts
- Primary accent: fresh green (#34D399 / #10B981 range)
- Soft gradient background (light mint to white)

### New Files

**Config & API Layer:**
- `src/lib/api.ts` — API client with configurable `VITE_API_URL`, functions: `uploadCSV()`, `getQuarters()`, `runForecast()`, `healthCheck()`
- `src/types/forecast.ts` — TypeScript interfaces for all API responses

**Page:**
- `src/pages/Index.tsx` — Rewrite as the single-page dashboard, composing all sections

**Components:**
- `src/components/Navbar.tsx` — Fixed top bar with logo, nav links (Upload Data / Forecast / About), RU/EN tag
- `src/components/HeroSection.tsx` — Large headline, subtitle, CTA button scrolling to upload panel
- `src/components/UploadPanel.tsx` — Card with drag-and-drop file upload, dataset summary display, quarter dropdown (from API), "Run Forecast" button, loading/error states
- `src/components/ValidationSummary.tsx` — Colored badge (using backend color), Russian text summary, three mini stat cards (Факт / Прогноз / Разница %)
- `src/components/ValidationChart.tsx` — Plotly line chart: Факт vs Прогноз for validation quarter
- `src/components/ForecastStats.tsx` — Left column: mean, std, sigma intervals in clean grid
- `src/components/ScenarioCards.tsx` — Right column: three color-themed cards (pessimistic red, realistic yellow, optimistic green)
- `src/components/CombinedChart.tsx` — Plotly line chart with historical (blue) + forecast (light blue) series, vertical dashed line at forecast start
- `src/components/MonthlyTable.tsx` — Responsive table with Russian headers, zebra striping, number formatting, copy/CSV export button
- `src/components/EmptyState.tsx` — Friendly placeholder when no data uploaded

### Dependencies to Add
- `react-plotly.js` + `plotly.js` — for charts
- `react-dropzone` — for drag-and-drop file upload

### Data Flow
1. User uploads CSV → `POST /api/upload` → store dataset summary in React state
2. Quarters auto-populated from `/api/quarters` response
3. User clicks "Run Forecast" → `POST /api/forecast` → all chart/table/summary sections populate
4. All sections show `EmptyState` until forecast completes

### Responsive Behavior
- Desktop: two-column layout for stats + scenarios; single-column for charts/tables
- Tablet/mobile: all sections stack vertically
- Navbar collapses to hamburger on mobile

