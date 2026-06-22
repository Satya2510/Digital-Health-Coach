import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightTrendChart, SleepChart, CalorieChart } from "@/components/charts/InsightsCharts";

const STATS = [
  { label: "Avg steps/day",  value: "7,648",   trend: "+8%",    detail: "vs last month" },
  { label: "Avg sleep",      value: "7.3h",    trend: "+0.4h",  detail: "vs last month" },
  { label: "Weight change",  value: "−2.1 kg", trend: "8 wks",  detail: "at target pace" },
  { label: "Active days",    value: "38/42",   trend: "90%",    detail: "consistency" },
];

const ACHIEVEMENTS = [
  { emoji: "🔥", label: "12-day streak",   desc: "Keep the momentum" },
  { emoji: "👟", label: "10k step day",    desc: "Hit on Thursday" },
  { emoji: "💧", label: "Hydration goal",  desc: "3 days this week" },
  { emoji: "😴", label: "Sleep champion",  desc: "8h on Wednesday" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fade = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Insights() {
  return (
    <motion.div
      key="insights"
      variants={stagger}
      initial="hidden"
      animate="show"
      className="pb-8"
    >
      {/* ── Header ── */}
      <motion.div variants={fade} className="px-6 pt-10 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Last 8 weeks
        </p>
        <h1 className="text-[22px] font-bold tracking-tight">Insights</h1>
      </motion.div>

      {/* ── Summary stats ── */}
      <motion.div variants={fade} className="px-6 mb-5">
        <div className="grid grid-cols-2 gap-2.5">
          {STATS.map(s => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-xl font-bold tabular tracking-tight">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {s.trend}
                </span>
                <span className="text-xs text-muted-foreground">{s.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Charts ── */}
      <motion.div variants={fade} className="px-6 mb-5">
        <Tabs defaultValue="weight">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="weight" className="flex-1">Weight</TabsTrigger>
            <TabsTrigger value="sleep"  className="flex-1">Sleep</TabsTrigger>
            <TabsTrigger value="cals"   className="flex-1">Calories</TabsTrigger>
          </TabsList>

          <TabsContent value="weight">
            <div className="bg-card rounded-2xl border border-border p-4">
              <p className="text-sm font-semibold mb-3">Weight trend</p>
              <WeightTrendChart />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Down 2.1 kg over 8 weeks — ahead of target pace 🎯
              </p>
            </div>
          </TabsContent>

          <TabsContent value="sleep">
            <div className="bg-card rounded-2xl border border-border p-4">
              <p className="text-sm font-semibold mb-3">Sleep this week</p>
              <SleepChart />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Average 7.3h — Wednesday was your best night
              </p>
            </div>
          </TabsContent>

          <TabsContent value="cals">
            <div className="bg-card rounded-2xl border border-border p-4">
              <p className="text-sm font-semibold mb-3">Calories: consumed vs burned</p>
              <CalorieChart />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Consistent deficit of ~350 kcal/day — right on track
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── Achievements ── */}
      <motion.div variants={fade} className="px-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Achievements
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.label}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border"
            >
              <span className="text-2xl flex-shrink-0">{a.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
