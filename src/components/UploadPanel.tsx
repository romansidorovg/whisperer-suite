import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UploadResponse } from "@/types/forecast";

interface UploadPanelProps {
  onUpload: (file: File) => Promise<void>;
  uploadResult: UploadResponse | null;
  quarters: string[];
  defaultQuarter: string;
  selectedQuarter: string;
  onQuarterChange: (q: string) => void;
  onRunForecast: () => void;
  isUploading: boolean;
  isForecasting: boolean;
  error: string | null;
}

const UploadPanel = ({
  onUpload,
  uploadResult,
  quarters,
  defaultQuarter,
  selectedQuarter,
  onQuarterChange,
  onRunForecast,
  isUploading,
  isForecasting,
  error,
}: UploadPanelProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        setFileName(accepted[0].name);
        onUpload(accepted[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">Загрузка данных и выбор квартала</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-accent/50"
              : "border-border hover:border-primary/50 hover:bg-accent/20"
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Отпустите файл здесь"
                  : "Перетащите CSV-файл сюда или нажмите для выбора"}
              </p>
              {fileName && (
                <div className="flex items-center gap-1.5 mt-2 text-sm text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  {fileName}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Dataset summary */}
        {uploadResult && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Строк</p>
              <p className="text-lg font-semibold text-foreground">{uploadResult.rows.toLocaleString()}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Период</p>
              <p className="text-sm font-medium text-foreground">
                {uploadResult.date_min} — {uploadResult.date_max}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Тип метрики</p>
              <p className="text-sm font-medium text-foreground">{uploadResult.y_dist_label}</p>
            </div>
          </div>
        )}

        {/* Quarter selection & forecast button */}
        {uploadResult && quarters.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedQuarter} onValueChange={onQuarterChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Выберите квартал" />
              </SelectTrigger>
              <SelectContent>
                {quarters.map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={onRunForecast}
              disabled={isForecasting}
              className="rounded-lg px-6 font-semibold"
            >
              {isForecasting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Расчёт...
                </>
              ) : (
                "Запустить прогноз"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadPanel;
