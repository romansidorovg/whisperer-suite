import Plot from "react-plotly.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CombinedChartData } from "@/types/forecast";

interface CombinedChartProps {
  data: CombinedChartData;
}

const CombinedChart = ({ data }: CombinedChartProps) => {
  const factDates: string[] = [];
  const factValues: number[] = [];
  const forecastDates: string[] = [];
  const forecastValues: number[] = [];

  data.dates.forEach((d, i) => {
    if (data.source[i] === "fact") {
      factDates.push(d);
      factValues.push(data.values[i]);
    } else {
      forecastDates.push(d);
      forecastValues.push(data.values[i]);
    }
  });

  // Vertical line at forecast start
  const forecastStart = forecastDates.length > 0 ? forecastDates[0] : null;

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">График распределения целевой переменной</CardTitle>
      </CardHeader>
      <CardContent>
        <Plot
          data={[
            {
              x: factDates,
              y: factValues,
              type: "scatter",
              mode: "lines",
              name: "Факт",
              line: { color: "#3b82f6", width: 2 },
            },
            {
              x: forecastDates,
              y: forecastValues,
              type: "scatter",
              mode: "lines",
              name: "Прогноз",
              line: { color: "#38bdf8", width: 2 },
            },
          ]}
          layout={{
            autosize: true,
            margin: { l: 50, r: 20, t: 10, b: 40 },
            xaxis: { title: "Дата", tickfont: { size: 11 } },
            yaxis: { title: "Значение целевой метрики", tickfont: { size: 11 } },
            legend: { orientation: "h", y: -0.2 },
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
            font: { family: "Inter, sans-serif" },
            shapes: forecastStart
              ? [
                  {
                    type: "line",
                    x0: forecastStart,
                    x1: forecastStart,
                    y0: 0,
                    y1: 1,
                    yref: "paper",
                    line: { color: "#94a3b8", width: 1.5, dash: "dash" },
                  },
                ]
              : [],
          }}
          config={{ responsive: true, displayModeBar: false }}
          useResizeHandler
          style={{ width: "100%", height: 400 }}
        />
      </CardContent>
    </Card>
  );
};

export default CombinedChart;
