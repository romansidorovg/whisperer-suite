import { Card, CardContent } from "@/components/ui/card";
import type { DistributionData } from "@/types/forecast";

interface ScenarioCardsProps {
  data: DistributionData;
  startDate: string;
  endDate: string;
}

const fmt = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

const ScenarioCards = ({ data, startDate, endDate }: ScenarioCardsProps) => {
  const scenarios = [
    {
      title: "Пессимистичный прогноз",
      value: data.sigma_1_negative,
      bgClass: "bg-[hsl(var(--pessimistic-bg))]",
      borderClass: "border-[hsl(var(--pessimistic))]",
      textClass: "text-destructive",
    },
    {
      title: "Реалистичный прогноз",
      value: data.mean_yhat,
      bgClass: "bg-[hsl(var(--realistic-bg))]",
      borderClass: "border-[hsl(var(--realistic))]",
      textClass: "text-[hsl(var(--realistic))]",
    },
    {
      title: "Оптимистичный прогноз",
      value: data.sigma_1_positive,
      bgClass: "bg-[hsl(var(--optimistic-bg))]",
      borderClass: "border-[hsl(var(--optimistic))]",
      textClass: "text-[hsl(var(--optimistic))]",
    },
  ];

  return (
    <div className="space-y-3 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-foreground font-['Space_Grotesk']">
        Прогноз ({startDate} — {endDate})
      </h3>
      {scenarios.map((s) => (
        <Card
          key={s.title}
          className={`flex-1 ${s.bgClass} border-2 ${s.borderClass} shadow-none`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{s.title}</span>
            <span className={`text-xl font-bold tabular-nums ${s.textClass}`}>
              {fmt(s.value)}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScenarioCards;
