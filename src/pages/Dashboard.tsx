import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Footprints, Flame, Moon, Sparkles, ChevronRight,
  Droplets, ChevronDown, Check, CheckCircle2, PartyPopper,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────── */
interface TaskDetail {
  description: string;
  instructions: string;
  duration: string;
  target: string;
  notes?: string;
}
type LogKey  = "steps" | "calories" | "water" | "sleep";
type LogMode = "add" | "set";
interface PlanTask {
  id: string;
  emoji: string;
  label: string;
  time: string;
  completed: boolean;
  category: "workout" | "meal" | "rest";
  detail: TaskDetail;
  logKey?: LogKey;
  logUnit?: string;
  logMode?: LogMode;
}
interface MetricsState { steps: number; calories: number; water: number; sleep: number; }

/* ─── Constants ─────────────────────────────────────────────── */
const METRIC_GOALS: Record<LogKey, number> = { steps: 10000, calories: 1900, water: 2.5, sleep: 8 };

const INITIAL_PLAN: PlanTask[] = [
  {
    id: "walk-am", emoji: "🚶", label: "Morning Walk", time: "7:00 AM",
    completed: false, category: "workout",
    detail: {
      description: "Start your day with a brisk walk to boost metabolism and energy.",
      instructions: "Walk at a moderate pace on a flat path. Focus on breathing and posture.",
      duration: "20–30 min", target: "2,500 steps",
      notes: "Counts toward your 10,000 step daily goal.",
    },
    logKey: "steps", logUnit: "steps", logMode: "add",
  },
  {
    id: "breakfast", emoji: "🥗", label: "Protein Breakfast", time: "8:30 AM",
    completed: false, category: "meal",
    detail: {
      description: "A high-protein breakfast sustains energy and prevents mid-morning cravings.",
      instructions: "Include eggs, Greek yoghurt, or a protein shake. Avoid refined sugar.",
      duration: "20 min", target: "400–500 kcal · 30g protein",
    },
    logKey: "calories", logUnit: "kcal", logMode: "add",
  },
  {
    id: "water-am", emoji: "💧", label: "Drink 1.5L Water", time: "By 2:00 PM",
    completed: false, category: "rest",
    detail: {
      description: "Front-load your hydration to stay energised through the afternoon.",
      instructions: "Drink a glass every hour. Keep a bottle visible on your desk.",
      duration: "Throughout morning", target: "1.5 L",
    },
    logKey: "water", logUnit: "L", logMode: "add",
  },
  {
    id: "strength", emoji: "🏋️", label: "Strength Training", time: "6:00 PM",
    completed: false, category: "workout",
    detail: {
      description: "Full-body resistance session to build muscle and burn calories.",
      instructions: "3 sets × 12 reps: squats, push-ups, bent-over rows, lunges. Rest 60s between sets.",
      duration: "30–40 min", target: "3 sets · 4 exercises",
      notes: "Increase weight when the last 2 reps feel easy.",
    },
  },
  {
    id: "walk-pm", emoji: "🌇", label: "Evening Walk", time: "8:30 PM",
    completed: false, category: "workout",
    detail: {
      description: "A gentle walk aids digestion and signals the body to wind down.",
      instructions: "Relaxed pace, no phone. Enjoy the air and decompress.",
      duration: "20 min", target: "2,000 steps",
      notes: "Helps close your daily step goal.",
    },
    logKey: "steps", logUnit: "steps", logMode: "add",
  },
  {
    id: "sleep", emoji: "🌙", label: "Sleep by 10:30 PM", time: "10:30 PM",
    completed: false, category: "rest",
    detail: {
      description: "Sleep is your most powerful recovery tool — protect it like a priority.",
      instructions: "Dim lights by 10 PM. No screens 30 min before. Room below 19°C.",
      duration: "7.5–8 hours", target: "8 hours",
      notes: "Your best days follow nights with 7.5+ hours logged.",
    },
    logKey: "sleep", logUnit: "hrs", logMode: "set",
  },
];

const TOMORROW_PLAN = [
  { emoji: "🚶", label: "Morning Walk",      time: "7:00 AM" },
  { emoji: "🍽️",  label: "Balanced Meals ×3", time: "All day" },
  { emoji: "🧘",  label: "Yoga or Swim",      time: "5:00 PM" },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fade    = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ─── Score calc ─────────────────────────────────────────────── */
function calcScore(m: MetricsState) {
  return Math.min(100, Math.round(
    Math.min(m.steps    / METRIC_GOALS.steps,    1) * 35 +
    Math.min(m.calories / METRIC_GOALS.calories, 1) * 25 +
    Math.min(m.sleep    / METRIC_GOALS.sleep,    1) * 25 +
    Math.min(m.water    / METRIC_GOALS.water,    1) * 15
  ));
}

/* ─── Wellness ring ─────────────────────────────────────────── */
function WellnessRing({ score }: { score: number }) {
  const size = 108, sw = 9, r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-border" />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="hsl(169 86% 27%)" strokeWidth={sw}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, delay: 0.3 }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={score}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold tabular leading-none"
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium mt-0.5">score</span>
      </div>
    </div>
  );
}

/* ─── Task item ─────────────────────────────────────────────── */
interface TaskItemProps {
  task: PlanTask;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleComplete: () => void;
  logInput: string;
  loggedValue: string;
  onLogChange: (v: string) => void;
  onLogSubmit: () => void;
}

function TaskItem({ task, isOpen, onToggleOpen, onToggleComplete, logInput, loggedValue, onLogChange, onLogSubmit }: TaskItemProps) {
  return (
    <div className="border-b border-border last:border-0">
      {/* Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button
          onClick={onToggleComplete}
          className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
            task.completed ? "bg-primary border-primary" : "border-border hover:border-primary/50"
          )}
        >
          {task.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        {/* Label */}
        <button onClick={onToggleOpen} className="flex-1 flex items-center gap-2 text-left min-w-0">
          <span className="text-base leading-none">{task.emoji}</span>
          <p className={cn("text-sm font-medium flex-1 truncate", task.completed && "line-through text-muted-foreground")}>
            {task.label}
          </p>
        </button>

        {/* Time + chevron */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{task.time}</span>
          <button onClick={onToggleOpen} className="p-0.5">
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border/40 bg-muted/20">
              {/* Target + Duration */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Target</p>
                  <p className="text-xs font-medium">{task.detail.target}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Duration</p>
                  <p className="text-xs font-medium">{task.detail.duration}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">About</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{task.detail.description}</p>
              </div>

              {/* Instructions */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">How to do it</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{task.detail.instructions}</p>
              </div>

              {/* Notes */}
              {task.detail.notes && (
                <div className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-2">
                  <p className="text-xs text-primary leading-relaxed">💡 {task.detail.notes}</p>
                </div>
              )}

              {/* Inline log input */}
              {task.logKey && !loggedValue && !task.completed && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Log {task.logKey}
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-1.5 bg-background border border-border rounded-xl px-3 h-9">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={logInput}
                        onChange={e => onLogChange(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && onLogSubmit()}
                        placeholder="0"
                        className="flex-1 bg-transparent text-sm focus:outline-none w-0 min-w-0"
                      />
                      <span className="text-xs text-muted-foreground flex-shrink-0">{task.logUnit}</span>
                    </div>
                    <button
                      onClick={onLogSubmit}
                      disabled={!logInput.trim() || isNaN(parseFloat(logInput))}
                      className="px-4 h-9 rounded-xl text-xs font-semibold text-white bg-primary disabled:opacity-40 transition-opacity active:scale-[0.97]"
                    >
                      Log
                    </button>
                  </div>
                </div>
              )}

              {/* Logged confirmation */}
              {loggedValue && (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-semibold">Logged: {loggedValue} {task.logUnit}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();

  /* State */
  const [plan,         setPlan]         = useState<PlanTask[]>(INITIAL_PLAN);
  const [openTaskId,   setOpenTaskId]   = useState<string | null>(null);
  const [metrics,      setMetrics]      = useState<MetricsState>({ steps: 5200, calories: 640, water: 0.5, sleep: 0 });
  const [logInputs,    setLogInputs]    = useState<Record<string, string>>({});
  const [loggedValues, setLoggedValues] = useState<Record<string, string>>({});

  /* Derived */
  const now        = new Date();
  const h          = now.getHours();
  const greeting   = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const today      = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const todayLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const streakStatus = localStorage.getItem("aura_streak_status") ?? "active";
  const profile = (() => { try { return JSON.parse(localStorage.getItem("aura_profile") ?? "{}"); } catch { return {}; } })();
  const firstName = (profile.name ?? "Priya").split(" ")[0];
  const initials  = (profile.name ?? "Priya Sharma").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const doneCount = plan.filter(t => t.completed).length;
  const allDone   = doneCount === plan.length;
  const pct       = Math.round((doneCount / plan.length) * 100);
  const score     = allDone ? calcScore(metrics) : 0;

  /* Metrics config */
  const METRICS = [
    { key: "steps"    as const, icon: Footprints, label: "Steps",    value: metrics.steps.toLocaleString(),           sub: "/ 10,000", progress: metrics.steps    / 10000, color: "text-primary"     },
    { key: "calories" as const, icon: Flame,      label: "Calories", value: metrics.calories.toLocaleString(),        sub: "/ 1,900",  progress: metrics.calories / 1900,  color: "text-orange-500"  },
    { key: "sleep"    as const, icon: Moon,       label: "Sleep",    value: metrics.sleep > 0 ? `${metrics.sleep}h` : "—", sub: "/ 8h",  progress: metrics.sleep    / 8,     color: "text-indigo-500"  },
    { key: "water"    as const, icon: Droplets,   label: "Water",    value: `${metrics.water}L`,                      sub: "/ 2.5L",   progress: metrics.water    / 2.5,   color: "text-blue-500"    },
  ];

  /* Handlers */
  const toggleTask = (id: string) =>
    setPlan(p => p.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const toggleOpen = (id: string) =>
    setOpenTaskId(cur => cur === id ? null : id);

  const handleLogChange = (taskId: string, val: string) =>
    setLogInputs(prev => ({ ...prev, [taskId]: val }));

  const handleLogSubmit = (task: PlanTask) => {
    const raw = logInputs[task.id]?.trim();
    if (!raw || !task.logKey) return;
    const num = parseFloat(raw);
    if (isNaN(num) || num <= 0) return;

    setMetrics(prev => {
      const key  = task.logKey!;
      const goal = METRIC_GOALS[key];
      const next = task.logMode === "set"
        ? Math.min(num, goal)
        : Math.min(prev[key] + num, goal);
      return { ...prev, [key]: Math.round(next * 100) / 100 };
    });

    setLoggedValues(prev => ({ ...prev, [task.id]: raw }));
    setLogInputs(prev => ({ ...prev, [task.id]: "" }));
  };

  return (
    <motion.div key="dashboard" variants={stagger} initial="hidden" animate="show" className="pb-10">

      {/* ── Greeting ── */}
      <motion.div variants={fade} className="px-6 pt-10 pb-5 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide">{today}</p>
          <h1 className="text-[22px] font-bold tracking-tight mt-0.5 leading-snug">
            {greeting},<br /><span className="text-primary">{firstName}!</span>
          </h1>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/15 hover:ring-primary/30 transition-all"
        >
          <span className="text-xs font-bold text-primary">{initials}</span>
        </button>
      </motion.div>

      {/* ── Streak recovery ── */}
      {streakStatus === "broken" && (
        <motion.div variants={fade} className="mx-6 mb-4">
          <button onClick={() => navigate("/coach", { state: { recovery: true } })} className="w-full text-left group">
            <div className="rounded-2xl p-4 flex items-start gap-3 transition-all group-hover:scale-[1.01]"
              style={{ background: "hsl(var(--coach-bg))", border: "2px solid hsl(var(--coach-border))" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--coach))" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "hsl(var(--coach))" }}>No worries — let's restart</p>
                <p className="text-sm leading-relaxed text-foreground">Streaks break — that's life. Tap to pick back up, no guilt.</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs font-semibold" style={{ color: "hsl(var(--coach))" }}>Talk to your coach</span>
                  <ChevronRight className="w-3 h-3" style={{ color: "hsl(var(--coach))" }} />
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* ── Fresh start badge ── */}
      {streakStatus === "fresh_start" && (
        <motion.div variants={fade} className="mx-6 mb-4 flex items-center gap-2.5 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <span className="text-lg">🌱</span>
          <div>
            <p className="text-sm font-bold text-primary">Day 1 – Fresh Start!</p>
            <p className="text-xs text-muted-foreground">Your coach has updated your plan. Let's go!</p>
          </div>
        </motion.div>
      )}

      {/* ── Wellness hero ── */}
      <motion.div variants={fade} className="mx-6 mb-5">
        <div className="rounded-3xl p-5 flex items-center gap-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(169 86% 27% / 0.07) 0%, hsl(169 86% 27% / 0.02) 100%)", border: "1px solid hsl(169 86% 27% / 0.12)" }}>
          {/* Decorative SVG */}
          <svg viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
            <circle cx="280" cy="20" r="55" fill="hsl(169 86% 27% / 0.07)" />
            <circle cx="300" cy="90" r="40" fill="hsl(35 80% 50% / 0.05)" />
            <path d="M160 55 L185 55 L192 38 L199 72 L206 45 L213 55 L320 55"
              stroke="hsl(169 86% 27%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
            <ellipse cx="295" cy="30" rx="14" ry="8" fill="hsl(169 86% 27%)" opacity="0.15" transform="rotate(-40 295 30)" />
          </svg>

          <WellnessRing score={score} />
          <div className="flex-1 min-w-0 relative">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Today's Score</p>
            {allDone ? (
              <>
                <p className="text-[17px] font-bold leading-tight">Incredible! 🎉</p>
                <p className="text-sm text-muted-foreground mt-0.5">All tasks complete</p>
              </>
            ) : (
              <>
                <p className="text-[17px] font-bold leading-tight">Complete tasks</p>
                <p className="text-sm text-muted-foreground mt-0.5">to unlock your score</p>
              </>
            )}
            <div className="flex items-center gap-1.5 mt-2.5">
              {streakStatus === "fresh_start" ? <><span className="text-sm">🌱</span><span className="text-sm font-semibold text-primary">Day 1 streak</span></>
                : streakStatus === "active"   ? <><span className="text-sm">🔥</span><span className="text-sm font-semibold text-primary">12-day streak</span></>
                : <><span className="text-sm">💛</span><span className="text-sm font-semibold" style={{ color: "hsl(var(--coach))" }}>Ready to restart</span></>}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Date + Metrics grid ── */}
      <motion.div variants={fade} className="px-6 mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Today, {todayLabel}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {METRICS.map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-2xl border border-border bg-card p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("w-3.5 h-3.5", m.color)} />
                  <span className="text-xs text-muted-foreground font-medium">{m.label}</span>
                </div>
                <p className="text-xl font-bold tabular leading-none mb-0.5">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
                <div className="mt-2.5 h-[3px] bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${Math.min(m.progress * 100, 100)}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Coach card ── */}
      <motion.div variants={fade} className="mx-6 mb-5">
        <button onClick={() => navigate("/coach")} className="w-full text-left group">
          <div className="rounded-2xl p-4 flex items-start gap-3 transition-all group-hover:scale-[1.01]"
            style={{ background: "hsl(var(--coach-bg))", border: "1px solid hsl(var(--coach-border))" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "hsl(var(--coach))" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "hsl(var(--coach))" }}>Aura</p>
              <p className="text-sm leading-relaxed text-foreground">
                {allDone
                  ? "Perfect day! You've completed everything. Let's plan tomorrow together 🌟"
                  : "You're building great habits. Complete today's plan to see your full wellness score."}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs font-semibold" style={{ color: "hsl(var(--coach))" }}>Ask your coach</span>
                <ChevronRight className="w-3 h-3" style={{ color: "hsl(var(--coach))" }} />
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      {/* ── Today's Plan ── */}
      <motion.div variants={fade} className="px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Today's Plan
          </h2>
          <div className="flex items-center gap-2">
            {allDone && <span className="text-[10px] font-semibold text-primary flex items-center gap-1"><Check className="w-3 h-3" />All done!</span>}
            <span className="text-xs font-semibold text-primary">{doneCount}/{plan.length}</span>
          </div>
        </div>

        {/* Success banner */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3 mb-3"
            >
              <PartyPopper className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-primary">Today's Tasks Completed!</p>
                <p className="text-xs text-muted-foreground mt-0.5">Brilliant work — your score is unlocked above.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task list */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {plan.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isOpen={openTaskId === task.id}
              onToggleOpen={() => toggleOpen(task.id)}
              onToggleComplete={() => toggleTask(task.id)}
              logInput={logInputs[task.id] ?? ""}
              loggedValue={loggedValues[task.id] ?? ""}
              onLogChange={v => handleLogChange(task.id, v)}
              onLogSubmit={() => handleLogSubmit(task)}
            />
          ))}

          {/* Progress bar */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Daily completion</span>
              <span className={cn("font-semibold", allDone ? "text-primary" : "text-foreground")}>{pct}%</span>
            </div>
            <div className="h-[3px] bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Upcoming Day Plan (revealed on completion) ── */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="px-6 mt-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Tomorrow's Plan
              </h2>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Preview</span>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {TOMORROW_PLAN.map((item, i) => (
                <div key={item.label} className={cn("flex items-center gap-3 px-4 py-3", i < TOMORROW_PLAN.length - 1 && "border-b border-border")}>
                  <span className="text-base">{item.emoji}</span>
                  <p className="flex-1 text-sm font-medium">{item.label}</p>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{item.time}</span>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-border">
                <button
                  onClick={() => navigate("/coach")}
                  className="w-full text-xs font-semibold text-primary flex items-center justify-center gap-1.5 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Customise with your coach
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
