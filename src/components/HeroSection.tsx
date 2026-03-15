import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onScrollToUpload: () => void;
}

const HeroSection = ({ onScrollToUpload }: HeroSectionProps) => {
  return (
    <section
      className="min-h-[85vh] flex items-center justify-center px-4"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          KPI Forecast
          <span className="text-primary"> Studio</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Загрузите исторические данные вашего KPI и получите квартальный прогноз
          с пессимистичным, реалистичным и оптимистичным сценариями.
        </p>

        <Button
          size="lg"
          onClick={onScrollToUpload}
          className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all gap-2"
        >
          Загрузить CSV
          <ArrowDown className="h-4 w-4" />
        </Button>

        <p className="mt-6 text-sm text-muted-foreground">
          Принимается CSV с колонками <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">ds</code> (дата) и{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">y</code> (метрика)
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
