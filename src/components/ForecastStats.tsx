import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DistributionData } from "@/types/forecast";

interface ForecastStatsProps {
  data: DistributionData;
}

const fmt = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

const ForecastStats = ({ data }: ForecastStatsProps) => {
  const rows = [
    { label: "Среднее (μ)", value: fmt(data.mean_yhat) },
    { label: "Стд. откл. (σ)", value: fmt(data.std_yhat) },
    { label: "1σ −", value: fmt(data.sigma_1_negative) },
    { label: "1σ +", value: fmt(data.sigma_1_positive) },
    { label: "2σ −", value: fmt(data.sigma_2_negative) },
    { label: "2σ +", value: fmt(data.sigma_2_positive) },
    { label: "3σ −", value: fmt(data.sigma_3_negative) },
    { label: "3σ +", value: fmt(data.sigma_3_positive) },
  ];

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Статистика прогноза</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
              <span className="text-xs text-muted-foreground">{r.label}</span>
              <span className="text-sm font-semibold text-foreground tabular-nums">{r.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastStats;
