import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PlanChecklistItem } from "@/components/plan/PlanChecklistItem";
import type { PlanItem } from "@/types";

const WEEK_PLAN: Record<string, PlanItem[]> = {
  Monday: [
    { id: "m1", label: "Morning yoga (20 min)",      time: "7:00 AM",  completed: false, category: "workout" },
    { id: "m2", label: "High-protein breakfast",     time: "8:00 AM",  completed: false, category: "meal" },
    { id: "m3", label: "HIIT session (30 min)",      time: "6:00 PM",  completed: false, category: "workout" },
  ],
  Tuesday: [
    { id: "t1", label: "Strength training (45 min)", time: "7:30 AM",  completed: false, category: "workout" },
    { id: "t2", label: "Meal prep (lunch)",          time: "12:30 PM", completed: false, category: "meal" },
    { id: "t3", label: "Evening walk (20 min)",      time: "7:00 PM",  completed: false, category: "rest" },
  ],
  Wednesday: [
    { id: "w1", label: "Rest — light stretching",    time: "8:00 AM",  completed: false, category: "rest" },
    { id: "w2", label: "Mindfulness (10 min)",       time: "9:00 AM",  completed: false, category: "mindfulness" },
  ],
  Thursday: [
    { id: "th1", label: "Run — 5K easy pace",        time: "7:00 AM",  completed: false, category: "workout" },
    { id: "th2", label: "Post-run protein shake",    time: "8:00 AM",  completed: false, category: "meal" },
    { id: "th3", label: "Core workout (20 min)",     time: "6:30 PM",  completed: false, category: "workout" },
  ],
  Friday: [
    { id: "f1", label: "Morning run",                time: "7:00 AM",  completed: false, category: "workout" },
    { id: "f2", label: "Protein breakfast",          time: "8:30 AM",  completed: true,  category: "meal" },
    { id: "f3", label: "Strength training",          time: "6:00 PM",  completed: false, category: "workout" },
    { id: "f4", label: "Evening walk",               time: "8:30 PM",  completed: false, category: "rest" },
  ],
  Saturday: [
    { id: "sa1", label: "Long run (45 min)",         time: "8:00 AM",  completed: false, category: "workout" },
    { id: "sa2", label: "Healthy brunch",            time: "10:00 AM", completed: false, category: "meal" },
  ],
  Sunday: [
    { id: "su1", label: "Rest & recovery",           time: "All day",  completed: false, category: "rest" },
    { id: "su2", label: "Weekly planning",           time: "6:00 PM",  completed: false, category: "mindfulness" },
  ],
};

const DAYS = Object.keys(WEEK_PLAN);
const TODAY = "Friday";

const fade = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Plan() {
  const [selected, setSelected] = useState(TODAY);
  const [plan, setPlan] = useState(WEEK_PLAN);

  const toggle = (day: string, id: string) => {
    setPlan(prev => ({
      ...prev,
      [day]: prev[day].map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const items = plan[selected] ?? [];
  const done  = items.filter(i => i.completed).length;
  const pct   = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <motion.div
      key="plan"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="pb-8"
    >
      {/* ── Header ── */}
      <div className="px-6 pt-10 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Jun 16 – Jun 22
        </p>
        <h1 className="text-[22px] font-bold tracking-tight">My plan</h1>
      </div>

      {/* ── Day scroller ── */}
      <div className="flex gap-2 px-6 pb-4 overflow-x-auto">
        {DAYS.map(day => {
          const dayDone = plan[day].filter(i => i.completed).length;
          const dayPct  = plan[day].length ? Math.round((dayDone / plan[day].length) * 100) : 0;
          const active  = selected === day;
          const isToday = day === TODAY;

          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all"
              style={{
                background: active ? "hsl(var(--primary))" : "hsl(var(--card))",
                border: `1px solid ${active ? "transparent" : "hsl(var(--border))"}`,
              }}
            >
              <span
                className="text-xs font-semibold"
                style={{ color: active ? "white" : isToday ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
              >
                {day.slice(0, 3)}
              </span>
              <div
                className="w-8 h-1 rounded-full overflow-hidden"
                style={{ background: active ? "rgba(255,255,255,0.25)" : "hsl(var(--border))" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${dayPct}%`,
                    background: active ? "white" : "hsl(var(--primary))",
                  }}
                />
              </div>
              <span
                className="text-[9px] font-medium"
                style={{ color: active ? "rgba(255,255,255,0.7)" : "hsl(var(--muted-foreground))" }}
              >
                {dayDone}/{plan[day].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Day detail ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="px-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">
              {selected}
              {selected === TODAY && (
                <span className="ml-2 text-xs font-normal text-primary">(today)</span>
              )}
            </h2>
            <Badge variant={done === items.length && items.length > 0 ? "success" : "muted"}>
              {done}/{items.length} done
            </Badge>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {items.map(item => (
              <div key={item.id} className="px-4 border-b border-border last:border-0">
                <PlanChecklistItem
                  label={item.label}
                  time={item.time}
                  completed={item.completed}
                  onToggle={() => toggle(selected, item.id)}
                  category={item.category}
                />
              </div>
            ))}
            {items.length > 0 && (
              <div className="px-4 py-3 border-t border-border">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span className="font-semibold text-primary">{pct}%</span>
                </div>
                <div className="h-[3px] bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
