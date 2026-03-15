import { BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onScrollTo: (section: string) => void;
}

const Navbar = ({ onScrollTo }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Загрузить данные", section: "upload" },
    { label: "Прогноз", section: "forecast" },
    { label: "О проекте", section: "hero" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              KPI Forecaster
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                key={l.section}
                onClick={() => onScrollTo(l.section)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </button>
            ))}
            <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
              RU
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-2">
            {links.map((l) => (
              <button
                key={l.section}
                onClick={() => {
                  onScrollTo(l.section);
                  setMobileOpen(false);
                }}
                className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
