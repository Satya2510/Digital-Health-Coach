import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, ArrowRight, ChevronLeft, Zap, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type InputMode = "mobile" | "email";
type Step = "input" | "otp";

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28 } },
  exit: (dir: number) => ({ x: dir > 0 ? -32 : 32, opacity: 0, transition: { duration: 0.2 } }),
};

export default function Login() {
  const [mode, setMode]       = useState<InputMode>("mobile");
  const [step, setStep]       = useState<Step>("input");
  const [phone, setPhone]     = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [dir, setDir]         = useState(1);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Actions ── */
  const sendOtp = () => {
    if (phone.replace(/\s/g, "").length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDir(1); setStep("otp"); }, 1100);
  };

  const emailLogin = () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("aura_logged_in", "true");
      const done = localStorage.getItem("aura_onboarded") === "true";
      window.location.href = done ? "/dashboard" : "/onboarding";
    }, 1000);
  };

  const verifyOtp = () => {
    if (otp.join("").length < 6) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("aura_logged_in", "true");
      localStorage.removeItem("aura_onboarded");
      window.location.href = "/onboarding";
    }, 900);
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (next.join("").length === 6) verifyOtp();
  };

  /* ── Render ── */
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero illustration */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, hsl(169 86% 27% / 0.08) 0%, hsl(35 80% 50% / 0.06) 100%)",
          }}
        />
        {/* SVG health illustration */}
        <svg
          viewBox="0 0 393 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Background circles — depth layers */}
          <circle cx="330" cy="40" r="90" fill="hsl(169 86% 27% / 0.06)" />
          <circle cx="60" cy="170" r="70" fill="hsl(35 80% 50% / 0.07)" />
          <circle cx="200" cy="100" r="140" fill="hsl(169 86% 27% / 0.03)" />

          {/* ECG / heartbeat line */}
          <path
            d="M20 110 L80 110 L95 75 L110 145 L125 90 L140 110 L200 110 L215 95 L230 125 L245 85 L260 110 L373 110"
            stroke="hsl(169 86% 27%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />

          {/* Heart icon — centre */}
          <path
            d="M196 68 C196 68 184 57 178 63 C172 69 172 78 196 92 C220 78 220 69 214 63 C208 57 196 68 196 68Z"
            fill="hsl(35 80% 50%)"
            opacity="0.22"
          />

          {/* Leaf / wellness top-right */}
          <ellipse cx="345" cy="55" rx="18" ry="10" fill="hsl(169 86% 27%)" opacity="0.18" transform="rotate(-35 345 55)" />
          <line x1="345" y1="65" x2="345" y2="45" stroke="hsl(169 86% 27%)" strokeWidth="1.2" opacity="0.25" />

          {/* Sleep moon top-left */}
          <path
            d="M55 45 A18 18 0 1 1 73 63 A12 12 0 1 0 55 45Z"
            fill="hsl(220 60% 60%)"
            opacity="0.18"
          />

          {/* Steps / footprint dots bottom-left */}
          <ellipse cx="68" cy="155" rx="5" ry="7" fill="hsl(169 86% 27%)" opacity="0.2" transform="rotate(-15 68 155)" />
          <ellipse cx="82" cy="162" rx="5" ry="7" fill="hsl(169 86% 27%)" opacity="0.15" transform="rotate(10 82 162)" />

          {/* Water drop — bottom right */}
          <path
            d="M330 150 C330 150 318 135 318 128 C318 121 323.4 116 330 116 C336.6 116 342 121 342 128 C342 135 330 150 330 150Z"
            fill="hsl(210 80% 60%)"
            opacity="0.18"
          />

          {/* Small sparkle dots */}
          <circle cx="160" cy="45" r="2.5" fill="hsl(35 80% 50%)" opacity="0.35" />
          <circle cx="240" cy="55" r="2" fill="hsl(169 86% 27%)" opacity="0.35" />
          <circle cx="290" cy="130" r="3" fill="hsl(35 80% 50%)" opacity="0.25" />
          <circle cx="100" cy="90" r="2" fill="hsl(169 86% 27%)" opacity="0.3" />
        </svg>

        {/* Logo row — overlaid */}
        <div className="absolute bottom-4 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-primary">Digital Health Coach</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-10">
        <AnimatePresence mode="wait" custom={dir}>
          {step === "input" ? (
            <motion.div key="input" variants={slide} custom={dir} initial="enter" animate="center" exit="exit">
              <h1 className="text-[26px] font-bold tracking-tight leading-tight mb-1">
                Your health,<br />understood.
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Sign in or create your free account.
              </p>

              {/* Mode toggle */}
              <div className="flex bg-muted rounded-xl p-1 mb-7 gap-1">
                {(["mobile", "email"] as InputMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                      mode === m
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m === "mobile"
                      ? <Phone className="w-3.5 h-3.5" />
                      : <Mail className="w-3.5 h-3.5" />
                    }
                    {m === "mobile" ? "Mobile" : "Email"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {mode === "mobile" ? (
                  <motion.div
                    key="mobile"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                        Mobile number
                      </label>
                      <div className="flex gap-2">
                        <div className="h-11 flex items-center bg-card border border-border rounded-xl px-3.5 text-sm font-semibold text-muted-foreground flex-shrink-0 gap-1">
                          <span className="text-base">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="98765 43210"
                          className="flex-1 h-11 px-4 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                    <button
                      onClick={sendOtp}
                      disabled={phone.length < 10 || loading}
                      className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity active:scale-[0.98]"
                    >
                      {loading ? "Sending OTP…" : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && emailLogin()}
                          placeholder="••••••••"
                          className="w-full h-11 px-4 pr-11 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(s => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end -mt-1">
                      <button className="text-xs text-primary hover:underline">
                        Forgot password?
                      </button>
                    </div>
                    <button
                      onClick={emailLogin}
                      disabled={!email.trim() || !password || loading}
                      className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity active:scale-[0.98]"
                    >
                      {loading ? "Signing in…" : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <p className="text-center text-xs text-muted-foreground mt-8">
                By continuing you agree to our{" "}
                <button className="text-primary hover:underline">Terms</button>
                {" & "}
                <button className="text-primary hover:underline">Privacy Policy</button>
              </p>
            </motion.div>
          ) : (
            <motion.div key="otp" variants={slide} custom={dir} initial="enter" animate="center" exit="exit">
              <button
                onClick={() => { setDir(-1); setStep("input"); setOtp(["", "", "", "", "", ""]); }}
                className="flex items-center gap-1 text-sm text-muted-foreground mb-8 -ml-1 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <h1 className="text-[22px] font-bold tracking-tight mb-1">Enter the code</h1>
              <p className="text-sm text-muted-foreground mb-8">
                Sent to{" "}
                <span className="font-semibold text-foreground">+91 {phone}</span>
              </p>

              {/* OTP boxes */}
              <div className="grid grid-cols-6 gap-2 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    id={`otp-${i}`}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpInput(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    className={cn(
                      "w-full h-12 text-center rounded-xl bg-card border text-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30",
                      digit ? "border-primary text-primary" : "border-border"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={otp.join("").length < 6 || loading}
                className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity active:scale-[0.98]"
              >
                {loading ? "Verifying…" : "Verify & continue"}
              </button>

              <p className="text-center text-xs text-muted-foreground mt-5">
                Didn't receive it?{" "}
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => setOtp(["", "", "", "", "", ""])}
                >
                  Resend OTP
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
