import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Data ──────────────────────────────────────────────────── */
const GOALS = [
  { value: "lose_weight",   emoji: "🎯", label: "Lose weight",     desc: "Reduce body fat sustainably" },
  { value: "build_muscle",  emoji: "💪", label: "Build muscle",    desc: "Gain strength progressively" },
  { value: "improve_sleep", emoji: "🌙", label: "Better sleep",    desc: "Optimise recovery & rest" },
  { value: "boost_energy",  emoji: "⚡", label: "More energy",     desc: "Combat fatigue, feel sharper" },
  { value: "all_round",     emoji: "✨", label: "All-round health", desc: "Balance fitness & wellbeing" },
];

const COACH_STYLES = [
  { value: "gentle",   emoji: "🌿", label: "Gentle",      desc: "Encouragement-first, low pressure" },
  { value: "balanced", emoji: "⚖️",  label: "Balanced",   desc: "Data-driven with motivational nudges" },
  { value: "intense",  emoji: "🔥", label: "High-performance", desc: "Direct feedback, ambitious targets" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLAN_STEPS = [
  "Analysing your goals…",
  "Building your workout schedule…",
  "Calibrating nutrition targets…",
  "Mapping your daily routines…",
  "Your plan is ready ✓",
];

const TOTAL = 5;

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28 } },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.2 } }),
};

/* ─── Page ──────────────────────────────────────────────────── */
export default function Onboarding() {
  const [step, setStep]             = useState(1);
  const [dir, setDir]               = useState(1);
  const [goal, setGoal]             = useState("");
  const [name, setName]             = useState("Priya Sharma");
  const [age, setAge]               = useState("32");
  const [weight, setWeight]         = useState("68");
  const [height, setHeight]         = useState("165");
  const [coachStyle, setCoachStyle] = useState("balanced");
  const [workoutDays, setWorkoutDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [planProgress, setPlanProgress] = useState(0); // 0-4 for step 4

  /* Auto-advance plan creation */
  useEffect(() => {
    if (step !== 4) return;
    const tick = () => {
      setPlanProgress(prev => {
        const next = prev + 1;
        if (next >= PLAN_STEPS.length - 1) {
          setTimeout(() => { setDir(1); setStep(5); }, 600);
        }
        return next;
      });
    };
    const intervals = [700, 800, 900, 900];
    intervals.forEach((_delay, idx) => {
      setTimeout(tick, intervals.slice(0, idx + 1).reduce((a, b) => a + b, 0));
    });
  }, [step]);

  const canProceed = () => {
    if (step === 1) return !!goal;
    if (step === 2) return name.trim().length > 0 && age.trim().length > 0;
    if (step === 3) return workoutDays.length > 0;
    return true;
  };

  const goNext = () => {
    if (step === TOTAL) {
      localStorage.setItem("aura_onboarded", "true");
      localStorage.setItem("aura_streak_status", "active");
      localStorage.setItem("aura_profile", JSON.stringify({ name, goal, coachStyle }));
      window.location.href = "/dashboard";
    } else {
      setDir(1); setStep(s => s + 1);
    }
  };
  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  const toggleDay = (day: string) => {
    setWorkoutDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const goalLabel = GOALS.find(g => g.value === goal)?.label ?? "";

  return (
    <div className="flex flex-col min-h-full">
      {/* Step indicator */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i + 1 < step ? "bg-primary" :
                i + 1 === step ? "bg-primary flex-[2]" :
                "bg-border"
              )}
              style={{ flex: i + 1 === step ? 2 : 1 }}
            />
          ))}
        </div>
        {step < 4 && (
          <p className="text-xs text-muted-foreground mt-2">
            Step {step} of {TOTAL - 1}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-hidden" style={{ minHeight: 460 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            variants={slide}
            custom={dir}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* ── Step 1: Goal ── */}
            {step === 1 && (
              <div>
                <h1 className="text-[22px] font-bold tracking-tight mb-1">
                  What's your main goal?
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Your coach will build everything around this.
                </p>
                <div className="space-y-2.5">
                  {GOALS.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={cn(
                        "w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all",
                        goal === g.value
                          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className="text-2xl flex-shrink-0">{g.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{g.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{g.desc}</p>
                      </div>
                      {goal === g.value && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Profile ── */}
            {step === 2 && (
              <div>
                <h1 className="text-[22px] font-bold tracking-tight mb-1">
                  Tell us about yourself
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Used to calculate your personalised targets.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Your name
                    </label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "age",    label: "Age",        suffix: "yrs",  value: age,    set: setAge },
                      { id: "weight", label: "Weight",     suffix: "kg",   value: weight, set: setWeight },
                      { id: "height", label: "Height",     suffix: "cm",   value: height, set: setHeight },
                    ].map(({ id, label, suffix, value, set }) => (
                      <div key={id}>
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                          {label} <span className="normal-case font-normal">{suffix}</span>
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={e => set(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl bg-card border border-border text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Preferences ── */}
            {step === 3 && (
              <div>
                <h1 className="text-[22px] font-bold tracking-tight mb-1">
                  How do you like to be coached?
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  You can always change this later.
                </p>

                {/* Coach style */}
                <div className="space-y-2.5 mb-6">
                  {COACH_STYLES.map(cs => (
                    <button
                      key={cs.value}
                      onClick={() => setCoachStyle(cs.value)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all",
                        coachStyle === cs.value
                          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className="text-2xl flex-shrink-0">{cs.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{cs.label}</p>
                        <p className="text-xs text-muted-foreground">{cs.desc}</p>
                      </div>
                      {coachStyle === cs.value && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Workout days */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Workout days
                  </p>
                  <div className="flex gap-1.5">
                    {DAYS.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all",
                          workoutDays.includes(day)
                            ? "bg-primary text-white"
                            : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {workoutDays.length} days/week selected
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 4: AI plan creation ── */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background:
                      "conic-gradient(hsl(var(--coach)) 0%, hsl(var(--coach-bg)) 60%, hsl(var(--coach)) 100%)",
                    boxShadow: "0 0 40px hsl(35 80% 50% / 0.2)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full bg-background flex items-center justify-center"
                  >
                    <Sparkles
                      className="w-7 h-7"
                      style={{ color: "hsl(var(--coach))" }}
                    />
                  </div>
                </motion.div>

                <h2 className="text-xl font-bold mb-1">Building your plan</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Aura is personalising everything for you
                </p>

                <div className="w-full space-y-2.5 text-left">
                  {PLAN_STEPS.map((text, i) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: i <= planProgress ? 1 : 0.25, x: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500",
                          i < planProgress
                            ? "bg-primary"
                            : i === planProgress
                            ? "bg-primary/20 ring-2 ring-primary/40"
                            : "bg-border"
                        )}
                      >
                        {i < planProgress && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                        {i === planProgress && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          i <= planProgress ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 5: Plan preview ── */}
            {step === 5 && (
              <div>
                {/* Coach welcome */}
                <div
                  className="rounded-2xl p-4 mb-5"
                  style={{
                    background: "hsl(var(--coach-bg))",
                    border: "1px solid hsl(var(--coach-border))",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "hsl(var(--coach))" }}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest mb-1"
                        style={{ color: "hsl(var(--coach))" }}
                      >
                        Aura
                      </p>
                      <p className="text-sm leading-relaxed text-foreground">
                        Hi {name.split(" ")[0]}! I've built a personalised plan for{" "}
                        <span className="font-semibold">{goalLabel.toLowerCase()}</span>. It starts
                        gentle — we build consistency before intensity. Let's do this together! 🌟
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Your first 3 days
                </p>

                <div className="space-y-2.5">
                  {[
                    {
                      day: "Day 1 — Today",
                      items: ["Morning walk (20 min)", "Balanced breakfast", "Hydration goal: 2L"],
                      highlight: true,
                    },
                    {
                      day: "Day 2 — Tomorrow",
                      items: ["Light stretching", "Track your meals", "Sleep by 10:30 PM"],
                    },
                    {
                      day: "Day 3",
                      items: ["Workout session (30 min)", "Post-workout protein", "Evening walk"],
                    },
                  ].map(({ day, items, highlight }) => (
                    <div
                      key={day}
                      className={cn(
                        "rounded-2xl border p-3.5",
                        highlight
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-card"
                      )}
                    >
                      <p className={cn("text-xs font-semibold mb-2", highlight ? "text-primary" : "text-muted-foreground")}>
                        {day}
                      </p>
                      <div className="space-y-1">
                        {items.map(item => (
                          <div key={item} className="flex items-center gap-2">
                            <CheckCircle2 className={cn("w-3.5 h-3.5 flex-shrink-0", highlight ? "text-primary" : "text-muted-foreground/50")} />
                            <span className="text-xs text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step !== 4 && (
        <div className="px-6 pb-8 flex gap-3 flex-shrink-0">
          {step > 1 && (
            <button
              onClick={goBack}
              className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-35 transition-opacity active:scale-[0.98]"
          >
            {step === TOTAL ? (
              "Start my journey 🚀"
            ) : (
              <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
