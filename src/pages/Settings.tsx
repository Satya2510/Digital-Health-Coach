import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, ChevronRight, LogOut, Shield, HelpCircle, UserCircle, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fade = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport]   = useState(true);
  const [coachTips, setCoachTips]         = useState(true);

  const LINKS = [
    { icon: UserCircle, label: "Account & privacy" },
    { icon: Shield,     label: "Security" },
    { icon: HelpCircle, label: "Help & support" },
  ];

  return (
    <motion.div
      key="settings"
      variants={stagger}
      initial="hidden"
      animate="show"
      className="pb-8"
    >
      {/* ── Header ── */}
      <motion.div variants={fade} className="px-6 pt-10 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Account
        </p>
        <h1 className="text-[22px] font-bold tracking-tight">Settings</h1>
      </motion.div>

      {/* ── Profile ── */}
      <motion.div variants={fade} className="mx-6 mb-4">
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 flex-shrink-0">
            <span className="text-lg font-bold text-primary">PS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">Priya Sharma</p>
            <p className="text-sm text-muted-foreground truncate">priya.sharma@email.com</p>
            <p className="text-xs text-muted-foreground mt-0.5">Goal: Lose weight · 32 yrs</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 text-xs"
            onClick={() => toast.info("Profile editing coming soon")}
          >
            Edit
          </Button>
        </div>
      </motion.div>

      {/* ── Appearance ── */}
      <motion.div variants={fade} className="mx-6 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
          Appearance
        </p>
        <div className="bg-card rounded-2xl border border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex items-center gap-2 cursor-pointer">
              {theme === "dark"
                ? <Moon className="w-4 h-4 text-muted-foreground" />
                : <Sun className="w-4 h-4 text-muted-foreground" />}
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground font-normal">Easier on the eyes at night</p>
              </div>
            </Label>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={c => setTheme(c ? "dark" : "light")}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Notifications ── */}
      <motion.div variants={fade} className="mx-6 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
          Notifications
        </p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {[
            { id: "notif",  label: "Daily reminders",  desc: "Get nudged to log and stay on track", value: notifications, set: setNotifications },
            { id: "report", label: "Weekly report",    desc: "Summary of your week every Sunday",   value: weeklyReport,  set: setWeeklyReport  },
            { id: "tips",   label: "Coach tips",       desc: "Personalised insights from Aura",     value: coachTips,     set: setCoachTips     },
          ].map((item, i, arr) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
            >
              <Label htmlFor={item.id} className="flex flex-col gap-0.5 cursor-pointer">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground font-normal">{item.desc}</span>
              </Label>
              <Switch id={item.id} checked={item.value} onCheckedChange={item.set} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Links ── */}
      <motion.div variants={fade} className="mx-6 mb-5">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {LINKS.map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              onClick={() => toast.info(`${label} coming soon`)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/60 transition-colors ${i < LINKS.length - 1 ? "border-b border-border" : ""}`}
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left">{label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Demo controls ── */}
      <motion.div variants={fade} className="mx-6 mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1 flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5" />
          Prototype demo
        </p>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => {
              localStorage.setItem("aura_streak_status", "broken");
              navigate("/dashboard");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-border hover:bg-muted/60 transition-colors"
          >
            <span className="text-base">💔</span>
            <div className="flex-1 text-left">
              <p className="font-medium">Simulate streak break</p>
              <p className="text-xs text-muted-foreground">Shows recovery card on dashboard</p>
            </div>
          </button>
          <button
            onClick={() => {
              localStorage.setItem("aura_streak_status", "fresh_start");
              navigate("/dashboard");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-border hover:bg-muted/60 transition-colors"
          >
            <span className="text-base">🌱</span>
            <div className="flex-1 text-left">
              <p className="font-medium">Set fresh start</p>
              <p className="text-xs text-muted-foreground">Shows Day 1 badge on dashboard</p>
            </div>
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60 transition-colors"
          >
            <span className="text-base">🔄</span>
            <div className="flex-1 text-left">
              <p className="font-medium">Reset & restart</p>
              <p className="text-xs text-muted-foreground">Clears all data, back to login</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* ── Sign out ── */}
      <motion.div variants={fade} className="mx-6">
        <button
          onClick={() => {
            localStorage.removeItem("aura_logged_in");
            window.location.href = "/login";
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
        <p className="text-center text-xs text-muted-foreground mt-5">
          Digital Health Coach v1.0
        </p>
      </motion.div>
    </motion.div>
  );
}
