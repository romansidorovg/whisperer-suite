import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { ScenarioRow } from "@/types/forecast";
import { toast } from "@/hooks/use-toast";

interface MonthlyTableProps {
  scenarios: ScenarioRow[];
}

const fmtNum = (n: number) =>
  n % 1 === 0
    ? n.toLocaleString("ru-RU")
    : n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MonthlyTable = ({ scenarios }: MonthlyTableProps) => {
  const copyToClipboard = () => {
    const header = "Месяц\tПессимистичный сценарий\tРеалистичный сценарий\tОптимистичный сценарий";
    const rows = scenarios.map(
      (r) => `${r.month}\t${r.pessimistic}\t${r.realistic}\t${r.optimistic}`
    );
    navigator.clipboard.writeText([header, ...rows].join("\n"));
    toast({ title: "Скопировано в буфер обмена" });
  };

  const exportCSV = () => {
    const header = "Месяц,Пессимистичный сценарий,Реалистичный сценарий,Оптимистичный сценарий";
    const rows = scenarios.map(
      (r) => `${r.month},${r.pessimistic},${r.realistic},${r.optimistic}`
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scenarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Распределение по месяцам</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Месяц</TableHead>
              <TableHead className="text-right">Пессимистичный сценарий</TableHead>
              <TableHead className="text-right">Реалистичный сценарий</TableHead>
              <TableHead className="text-right">Оптимистичный сценарий</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((row, i) => (
              <TableRow key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                <TableCell className="font-medium">{row.month}</TableCell>
                <TableCell className="text-right tabular-nums text-destructive">
                  {fmtNum(row.pessimistic)}
                </TableCell>
                <TableCell className="text-right tabular-nums font-semibold">
                  {fmtNum(row.realistic)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-[hsl(var(--optimistic))]">
                  {fmtNum(row.optimistic)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MonthlyTable;
