import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Sparkles, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/coach",     icon: Sparkles,        label: "Coach", center: true },
  { to: "/insights",  icon: LineChart,        label: "Insights" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur-md flex items-center h-[62px] relative z-40">
      {NAV.map(({ to, icon: Icon, label, center }) => {
        const active = location.pathname === to;

        if (center) {
          return (
            <NavLink key={to} to={to} className="flex-1 flex justify-center">
              <div className="flex flex-col items-center gap-1 -mt-5">
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg",
                    active ? "shadow-amber-400/40 scale-105" : "shadow-amber-500/20"
                  )}
                  style={{
                    background: "hsl(35 80% 50%)",
                    boxShadow: active
                      ? "0 0 0 4px hsl(38 100% 97%), 0 8px 24px hsl(35 80% 50% / 0.35)"
                      : "0 4px 16px hsl(35 80% 50% / 0.25)",
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className="text-[9px] font-semibold uppercase tracking-wider"
                  style={{ color: active ? "hsl(35 80% 50%)" : "hsl(var(--muted-foreground))" }}
                >
                  {label}
                </span>
              </div>
            </NavLink>
          );
        }

        return (
          <NavLink key={to} to={to} className="flex-1">
            <div className={cn("flex flex-col items-center justify-center py-2 gap-0.5 transition-colors", active ? "text-primary" : "text-muted-foreground")}>
              <Icon className={cn("w-5 h-5", active && "text-primary")} />
              <span className="text-[10px] font-medium">{label}</span>
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
}
