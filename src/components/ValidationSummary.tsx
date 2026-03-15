import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ValidationData } from "@/types/forecast";

interface ValidationSummaryProps {
  data: ValidationData;
}

const ValidationSummary = ({ data }: ValidationSummaryProps) => {
  const finalMessage = `За срок с ${data.last_quarter_start} по ${data.last_quarter_end}, прогностические значения (${data.forecast_metric.toFixed(2)}) оказались ${data.percentage_diff_type} на ${Math.abs(data.percentage_diff)}% относительно фактических (${data.fact_metric.toFixed(2)}). ${data.percentage_diff_message}`;

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="flex flex-row items-center gap-3">
        <CardTitle className="text-xl">Качество модели на последнем квартале</CardTitle>
        <Badge
          className="text-xs font-semibold px-3 py-1"
          style={{
            backgroundColor: data.percentage_diff_color + "22",
            color: data.percentage_diff_color,
            borderColor: data.percentage_diff_color,
          }}
        >
          {data.val_quarter}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{finalMessage}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Факт</p>
            <p className="text-2xl font-bold text-foreground">{data.fact_metric.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Прогноз</p>
            <p className="text-2xl font-bold text-primary">{data.forecast_metric.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Разница, %</p>
            <p
              className="text-2xl font-bold"
              style={{ color: data.percentage_diff_color }}
            >
              {data.percentage_diff > 0 ? "+" : ""}
              {data.percentage_diff}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationSummary;
