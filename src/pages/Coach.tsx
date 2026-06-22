import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CoachMessage } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── Static responses ──────────────────────────────────────── */
const REPLIES: Record<string, string> = {
  "How am I doing today?":
    "You're crushing it 🎯 — steps at 78%, calories on target. The one gap is an evening walk to close the step goal. You usually feel great on days you do both morning and evening activity.",
  "Tips for tonight's sleep":
    "Based on your data, you sleep deepest when you wind down before 10 PM. Avoid screens 30 min before bed and keep the room under 19°C. Your best-ever sleep nights all followed evening walks 🌙",
  "Best workout today":
    "You've done 3 strength sessions this week — your body will thank you for a recovery-pace walk tonight instead of another HIIT. Aim for 25–30 minutes. 💪",
  "What should I eat now?":
    "You're 32g short on protein (88g vs 120g goal). A Greek yoghurt or a handful of almonds before your walk covers that gap without spiking your calories. 🍽️",
  default:
    "That's a great question. Based on your trend: you sleep 23 min longer after strength training days, and your best mood scores follow days with 3+ water logs. Consistency really is your superpower 🌟",
};

const QUICK = [
  "How am I doing today?",
  "Tips for tonight's sleep",
  "Best workout today",
  "What should I eat now?",
];

/* ─── Recovery flow ─────────────────────────────────────────── */
type RecoveryStep = 1 | 2 | 3 | 4;

const BARRIERS = [
  { value: "busy",       label: "Life got busy",       emoji: "📅" },
  { value: "sick",       label: "I wasn't feeling well", emoji: "🤒" },
  { value: "travel",     label: "Travelling",           emoji: "✈️" },
  { value: "motivation", label: "Lost motivation",      emoji: "😔" },
];

const ENERGY_LEVELS = [
  { value: "low",    label: "Low — ease me in",    emoji: "🌱" },
  { value: "medium", label: "Medium — steady pace", emoji: "⚡" },
  { value: "high",   label: "High — let's go!",    emoji: "🔥" },
];

const RESTART_PLANS: Record<string, string[]> = {
  low:    ["10-min morning stretch", "Light walk after lunch", "Sleep by 10 PM"],
  medium: ["20-min walk", "Track your meals", "8 glasses of water"],
  high:   ["30-min workout", "Full meal plan", "Evening walk to close steps"],
};

/* ─── Typing dots ────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "hsl(var(--muted-foreground))" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

/* ─── Coach message bubble ──────────────────────────────────── */
function CoachBubble({ content }: { content: string }) {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
        style={{ background: "hsl(var(--coach))" }}
      >
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div
        className="max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded-2xl rounded-tl-sm"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
      >
        {content}
      </div>
    </div>
  );
}

function msgAnim(children: React.ReactNode) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function Coach() {
  const location = useLocation();
  const navigate  = useNavigate();
  const isRecovery = (location.state as { recovery?: boolean } | null)?.recovery === true;

  /* ── Recovery state ── */
  const [recovStep, setRecovStep] = useState<RecoveryStep>(1);
  const [barrier,   setBarrier]   = useState("");
  const [energy,    setEnergy]    = useState("");
  const [recovTyping, setRecovTyping] = useState(false);
  const [showRecovStep, setShowRecovStep] = useState<RecoveryStep>(1);

  /* ── Chat state ── */
  const [messages, setMessages] = useState<CoachMessage[]>(() => {
    if (isRecovery) return [];
    const profile = (() => {
      try { return JSON.parse(localStorage.getItem("aura_profile") ?? "{}"); } catch { return {}; }
    })();
    const firstName = (profile.name ?? "Priya").split(" ")[0];
    return [{
      id: "0",
      role: "coach" as const,
      content: `Hi ${firstName}! 👋 I've been watching your progress today — 84% on steps and you're ahead of your calorie target. What's on your mind?`,
      timestamp: new Date(),
    }];
  });
  const [input,  setInput]  = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, recovStep, recovTyping, showRecovStep]);

  /* ── Recovery: advance to next step with typing delay ── */
  const advanceRecovery = (next: RecoveryStep, delay = 900) => {
    setRecovTyping(true);
    setTimeout(() => {
      setRecovTyping(false);
      setShowRecovStep(next);
      setRecovStep(next);
    }, delay);
  };

  const pickBarrier = (val: string) => {
    setBarrier(val);
    advanceRecovery(2);
  };

  const pickEnergy = (val: string) => {
    setEnergy(val);
    advanceRecovery(3, 1100);
  };

  const finishRecovery = () => {
    localStorage.setItem("aura_streak_status", "fresh_start");
    navigate("/dashboard");
  };

  /* ── Regular chat send ── */
  const send = (text: string = input) => {
    const msg = text.trim();
    if (!msg) return;
    setMessages(m => [...m, { id: Date.now().toString(), role: "user", content: msg, timestamp: new Date() }]);
    setInput("");
    setTyping(true);
    const delay = 900 + Math.random() * 400;
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content: REPLIES[msg] ?? REPLIES.default,
        timestamp: new Date(),
      }]);
    }, delay);
  };

  const profile = (() => {
    try { return JSON.parse(localStorage.getItem("aura_profile") ?? "{}"); } catch { return {}; }
  })();
  const firstName = (profile.name ?? "Priya").split(" ")[0];
  const restartPlan = RESTART_PLANS[energy] ?? RESTART_PLANS.medium;

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <div
        className="flex-shrink-0 px-6 pt-10 pb-4 border-b border-border"
        style={{ background: "hsl(var(--coach-bg))" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "hsl(var(--coach))", boxShadow: "0 4px 20px hsl(35 80% 50% / 0.35)" }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Aura</h1>
            <p className="text-xs flex items-center gap-1.5 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#22c55e" }} />
              <span>Always here for you</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      {isRecovery ? (
        /* ════ RECOVERY CONVERSATION FLOW ════ */
        <div className="flex-1 px-4 py-5 space-y-5">

          {/* Step 1 — always visible */}
          {msgAnim(
            <CoachBubble content={`Hey ${firstName}, no guilt here 💛 Streaks break — what matters is that you're back. What got in the way?`} />
          )}

          {showRecovStep >= 1 && recovStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.3 }}
              className="grid grid-cols-2 gap-2 pl-8"
            >
              {BARRIERS.map(b => (
                <button
                  key={b.value}
                  onClick={() => pickBarrier(b.value)}
                  className="p-3 rounded-2xl border-2 border-border hover:border-primary/40 bg-card text-left transition-all active:scale-[0.97]"
                >
                  <span className="text-xl block mb-1">{b.emoji}</span>
                  <span className="text-xs font-semibold">{b.label}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* User barrier reply */}
          {barrier && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
              className="flex justify-end"
            >
              <div className="px-4 py-3 text-sm rounded-2xl rounded-tr-sm text-white" style={{ background: "hsl(var(--primary))" }}>
                {BARRIERS.find(b => b.value === barrier)?.label ?? barrier}
              </div>
            </motion.div>
          )}

          {/* Typing after barrier */}
          {recovTyping && recovStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--coach))" }}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <TypingDots />
              </div>
            </motion.div>
          )}

          {/* Step 2 — energy level */}
          {showRecovStep >= 2 && (
            <>
              {msgAnim(<CoachBubble content="Totally understandable. Now — what's your energy feeling like right now? I'll shape your restart around that." />)}

              {recovStep === 2 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}
                  className="flex flex-col gap-2 pl-8"
                >
                  {ENERGY_LEVELS.map(e => (
                    <button
                      key={e.value}
                      onClick={() => pickEnergy(e.value)}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-border hover:border-primary/40 bg-card text-left transition-all active:scale-[0.98]"
                    >
                      <span className="text-xl">{e.emoji}</span>
                      <span className="text-sm font-semibold">{e.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/* User energy reply */}
          {energy && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
              className="flex justify-end"
            >
              <div className="px-4 py-3 text-sm rounded-2xl rounded-tr-sm text-white" style={{ background: "hsl(var(--primary))" }}>
                {ENERGY_LEVELS.find(e => e.value === energy)?.label ?? energy}
              </div>
            </motion.div>
          )}

          {/* Typing after energy */}
          {recovTyping && recovStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--coach))" }}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <TypingDots />
              </div>
            </motion.div>
          )}

          {/* Step 3 — plan preview */}
          {showRecovStep >= 3 && (
            <>
              {msgAnim(<CoachBubble content={`Perfect. I've updated your plan for a fresh start${energy === "low" ? " — nice and gentle" : energy === "high" ? " — ambitious, I like it 🔥" : ""}. Here's your Day 1:`} />)}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
                className="ml-8 rounded-2xl border border-primary/20 bg-primary/5 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Day 1 — Fresh Start</p>
                <div className="space-y-2">
                  {restartPlan.map((item, i) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-white">{i + 1}</span>
                      </div>
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* Step 4 — done CTA */}
          {showRecovStep >= 3 && recovStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}
              className="ml-8"
            >
              <button
                onClick={finishRecovery}
                className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-[0.98]"
                style={{ background: "hsl(var(--coach))" }}
              >
                <span>Let's do this — Day 1!</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-muted-foreground mt-2.5">
                No pressure — your coach will check in throughout the day.
              </p>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      ) : (
        /* ════ REGULAR CHAT MODE ════ */
        <>
          <div className="flex-1 px-4 py-5 space-y-4">
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "coach" && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                      style={{ background: "hsl(var(--coach))" }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                      msg.role === "coach" ? "rounded-tl-sm" : "rounded-tr-sm text-white"
                    }`}
                    style={
                      msg.role === "coach"
                        ? { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }
                        : { background: "hsl(var(--primary))" }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--coach))" }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm"
                    style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  >
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Sticky input */}
          <div className="sticky bottom-0 bg-background border-t border-border">
            <div className="flex gap-2 px-4 pt-3 pb-2 overflow-x-auto">
              {QUICK.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-card"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2 px-4 pb-6 pt-1">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask your coach anything…"
                className="flex-1 h-11 px-4 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-35"
                style={{ background: "hsl(var(--coach))" }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
