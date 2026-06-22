import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PhoneShell } from "./PhoneShell";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  return (
    <PhoneShell>
      {/* Scrollable content — single overflow-y-auto container */}
      <div className="flex-1 min-h-0 overflow-y-auto lg:pt-7">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
