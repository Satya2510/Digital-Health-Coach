import { type ReactNode } from "react";
import { Zap } from "lucide-react";

interface PhoneShellProps {
  children: ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="min-h-screen bg-background lg:bg-[#0b0c17] lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-5 lg:py-8">
      {/* Desktop wordmark */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-white/70 text-sm font-semibold tracking-tight">Digital Health Coach</span>
        <span className="text-white/25 text-sm">· Interactive Prototype</span>
      </div>

      {/* Phone frame */}
      <div
        className="
          relative flex flex-col overflow-hidden bg-background
          w-full h-dvh
          lg:w-[393px] lg:h-[852px] lg:rounded-[52px]
          lg:shadow-[0_0_0_12px_#161726,0_50px_120px_-20px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(255,255,255,0.06)]
        "
      >
        {/* Dynamic Island notch — desktop only */}
        <div className="hidden lg:flex absolute top-3 inset-x-0 justify-center z-50 pointer-events-none">
          <div className="w-28 h-7 rounded-full" style={{ background: "#161726" }} />
        </div>

        {children}
      </div>

      <p className="hidden lg:block text-white/20 text-xs tracking-widest uppercase">
        Click to interact
      </p>
    </div>
  );
}
