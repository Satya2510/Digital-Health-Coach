import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import Insights from "@/pages/Insights";
import Settings from "@/pages/Settings";
import Coach from "@/pages/Coach";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

function RootRedirect() {
  const loggedIn   = localStorage.getItem("aura_logged_in") === "true";
  const onboarded  = localStorage.getItem("aura_onboarded") === "true";
  if (!loggedIn)   return <Navigate to="/login" replace />;
  if (!onboarded)  return <Navigate to="/onboarding" replace />;
  return <Navigate to="/dashboard" replace />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const loggedIn = localStorage.getItem("aura_logged_in") === "true";
  if (!loggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <BrowserRouter>
          <Routes>
            {/* Root */}
            <Route path="/" element={<RootRedirect />} />

            {/* Auth flow — phone frame, no bottom nav */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route
                path="/onboarding"
                element={
                  <RequireAuth><Onboarding /></RequireAuth>
                }
              />
            </Route>

            {/* App — phone frame + bottom nav */}
            <Route
              element={
                <RequireAuth><AppLayout /></RequireAuth>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/coach"     element={<Coach />} />
              <Route path="/insights"  element={<Insights />} />
              <Route path="/settings"  element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ style: { fontFamily: "inherit", fontSize: "13px" } }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
