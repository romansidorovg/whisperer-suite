import { useCallback, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadPanel from "@/components/UploadPanel";
import ValidationSummary from "@/components/ValidationSummary";
import ValidationChart from "@/components/ValidationChart";
import ForecastStats from "@/components/ForecastStats";
import ScenarioCards from "@/components/ScenarioCards";
import CombinedChart from "@/components/CombinedChart";
import MonthlyTable from "@/components/MonthlyTable";
import EmptyState from "@/components/EmptyState";
import { uploadCSV, getQuarters, runForecast } from "@/lib/api";
import type { UploadResponse, ForecastResponse } from "@/types/forecast";

const Index = () => {
  const uploadRef = useRef<HTMLDivElement>(null);
  const forecastRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [quarters, setQuarters] = useState<string[]>([]);
  const [defaultQuarter, setDefaultQuarter] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isForecasting, setIsForecasting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollTo = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      upload: uploadRef,
      forecast: forecastRef,
      hero: heroRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);
    setForecast(null);
    try {
      const result = await uploadCSV(file);
      setUploadResult(result);
      const q = await getQuarters();
      setQuarters(q.quarters);
      setDefaultQuarter(q.default_quarter);
      setSelectedQuarter(q.default_quarter);
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleForecast = useCallback(async () => {
    if (!selectedQuarter) return;
    setError(null);
    setIsForecasting(true);
    try {
      const result = await runForecast(selectedQuarter);
      setForecast(result);
      setTimeout(() => forecastRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) {
      setError(e.message || "Ошибка прогноза");
    } finally {
      setIsForecasting(false);
    }
  }, [selectedQuarter]);

  return (
    <div className="min-h-screen">
      <Navbar onScrollTo={scrollTo} />

      <div ref={heroRef}>
        <HeroSection onScrollToUpload={() => scrollTo("upload")} />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* Upload section */}
        <div ref={uploadRef} className="-mt-16 pt-16">
          <UploadPanel
            onUpload={handleUpload}
            uploadResult={uploadResult}
            quarters={quarters}
            defaultQuarter={defaultQuarter}
            selectedQuarter={selectedQuarter}
            onQuarterChange={setSelectedQuarter}
            onRunForecast={handleForecast}
            isUploading={isUploading}
            isForecasting={isForecasting}
            error={error}
          />
        </div>

        {/* Forecast results */}
        <div ref={forecastRef}>
          {!forecast ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {/* Validation */}
              <ValidationSummary data={forecast.validation} />
              <ValidationChart data={forecast.validation} />

              {/* Stats + Scenarios two-column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ForecastStats data={forecast.distribution} />
                <ScenarioCards
                  data={forecast.distribution}
                  startDate={forecast.start_date}
                  endDate={forecast.end_date}
                />
              </div>

              {/* Combined chart */}
              <CombinedChart data={forecast.combined_chart} />

              {/* Monthly table */}
              <MonthlyTable scenarios={forecast.scenarios} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
