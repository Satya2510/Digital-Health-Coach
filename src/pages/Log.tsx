import { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Droplets, Dumbbell, Moon, Clock } from "lucide-react";
import { LogDrawer } from "@/components/log/LogDrawer";
import { cn } from "@/lib/utils";

type LogType = "food" | "water" | "workout" | "sleep";

const LOG_TYPES = [
  {
    type: "food" as LogType,
    icon: Utensils,
    label: "Meal",
    desc: "Food & calories",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-500",
    accent: "#f97316",
  },
  {
    type: "water" as LogType,
    icon: Droplets,
    label: "Water",
    desc: "Hydration",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-500",
    accent: "#3b82f6",
  },
  {
    type: "workout" as LogType,
    icon: Dumbbell,
    label: "Workout",
    desc: "Activity & exercise",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    iconColor: "text-primary",
    accent: "hsl(169 86% 27%)",
  },
  {
    type: "sleep" as LogType,
    icon: Moon,
    label: "Sleep",
    desc: "Rest & recovery",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-500",
    accent: "#6366f1",
  },
];

const RECENT = [
  { label: "Protein breakfast", type: "food",    detail: "420 kcal",       time: "8:30 AM" },
  { label: "Morning water",     type: "water",   detail: "500 ml",         time: "7:15 AM" },
  { label: "Evening run",       type: "workout", detail: "45 min · Hard",  time: "Yesterday" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fade = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Log() {
  const [activeType, setActiveType] = useState<LogType | null>(null);

  return (
    <motion.div
      key="log"
      variants={stagger}
      initial="hidden"
      animate="show"
      className="pb-8"
    >
      {/* ── Header ── */}
      <motion.div variants={fade} className="px-6 pt-10 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Today
        </p>
        <h1 className="text-[22px] font-bold tracking-tight">Log entry</h1>
      </motion.div>

      {/* ── Quick log ── */}
      <motion.div variants={fade} className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {LOG_TYPES.map(({ type, icon: Icon, label, desc, bg, iconColor, accent }, i) => (
            <motion.button
              key={type}
              onClick={() => setActiveType(type)}
              className="text-left w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
            >
              <div className="rounded-2xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", bg)}>
                  <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                <p className="font-semibold text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Recent ── */}
      <motion.div variants={fade} className="px-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Recent entries
        </p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {RECENT.map((entry, i) => {
            const meta = LOG_TYPES.find(l => l.type === entry.type);
            const Icon = meta?.icon ?? Utensils;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
              >
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", meta?.bg)}>
                  <Icon className={cn("w-4 h-4", meta?.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.label}</p>
                  <p className="text-xs text-muted-foreground">{entry.detail}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {entry.time}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {activeType && (
        <LogDrawer
          open={!!activeType}
          onOpenChange={o => !o && setActiveType(null)}
          type={activeType}
        />
      )}
    </motion.div>
  );
}
