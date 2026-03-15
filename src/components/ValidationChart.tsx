import Plot from "react-plotly.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ValidationData } from "@/types/forecast";

interface ValidationChartProps {
  data: ValidationData;
}

const ValidationChart = ({ data }: ValidationChartProps) => {
  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">Факт vs Прогноз (валидационный квартал)</CardTitle>
      </CardHeader>
      <CardContent>
        <Plot
          data={[
            {
              x: data.val_dates,
              y: data.y_fact,
              type: "scatter",
              mode: "lines",
              name: "Факт",
              line: { color: "hsl(220, 25%, 10%)", width: 2 },
            },
            {
              x: data.val_dates,
              y: data.y_forecast,
              type: "scatter",
              mode: "lines",
              name: "Прогноз",
              line: { color: "hsl(160, 60%, 45%)", width: 2, dash: "dot" },
            },
          ]}
          layout={{
            autosize: true,
            margin: { l: 50, r: 20, t: 10, b: 40 },
            xaxis: { title: { text: "Дата" }, tickfont: { size: 11 } },
            yaxis: { title: { text: "Значение целевой метрики" }, tickfont: { size: 11 } },
            legend: { orientation: "h", y: -0.2 },
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
            font: { family: "Inter, sans-serif" },
          }}
          config={{ responsive: true, displayModeBar: false }}
          useResizeHandler
          style={{ width: "100%", height: 400 }}
        />
      </CardContent>
    </Card>
  );
};

export default ValidationChart;
