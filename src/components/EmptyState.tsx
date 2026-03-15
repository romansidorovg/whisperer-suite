import { BarChart3 } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "Загрузите данные, чтобы увидеть прогнозы" }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
