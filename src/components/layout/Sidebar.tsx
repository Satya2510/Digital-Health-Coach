import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, PlusCircle, LineChart, BookOpen,
  Settings, ChevronLeft, ChevronRight, Sparkles, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/log",       icon: PlusCircle,      label: "Log" },
  { to: "/plan",      icon: BookOpen,         label: "My Plan" },
  { to: "/insights",  icon: LineChart,        label: "Insights" },
  { to: "/settings",  icon: Settings,         label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 overflow-hidden"
      style={{ backgroundColor: "hsl(var(--sidebar-background))" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-bold text-white truncate"
            >
              Aura Health
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* User pill */}
      <div className="px-3 py-4 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">PS</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-xs font-semibold text-white truncate">Priya Sharma</p>
                <p className="text-xs truncate" style={{ color: "hsl(var(--sidebar-foreground))" }}>
                  Weight loss goal
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink key={to} to={to}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  active
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-white/5 text-sidebar-foreground"
                )}
                style={{ color: active ? "hsl(var(--sidebar-primary))" : "hsl(var(--sidebar-foreground))" }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full"
                  />
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* AI badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-4 rounded-lg p-3"
            style={{ backgroundColor: "hsl(var(--sidebar-accent))" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Coach active</span>
            </div>
            <p className="text-xs" style={{ color: "hsl(var(--sidebar-foreground))" }}>
              Streak: 12 days 🔥
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t transition-colors hover:bg-white/5"
        style={{ borderColor: "hsl(var(--sidebar-border))", color: "hsl(var(--sidebar-foreground))" }}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
