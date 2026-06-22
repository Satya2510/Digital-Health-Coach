import { Outlet } from "react-router-dom";
import { PhoneShell } from "./PhoneShell";

/** Wraps Login and Onboarding in the same phone frame — no bottom nav. */
export function AuthLayout() {
  return (
    <PhoneShell>
      <div className="flex-1 min-h-0 overflow-y-auto lg:pt-7">
        <Outlet />
      </div>
    </PhoneShell>
  );
}
