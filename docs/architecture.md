# Architecture

## Folder Structure

```
aura/
├── public/
│   └── _redirects          → Netlify SPA routing fix
│
├── src/
│   ├── main.tsx             → App entry point — mounts React into index.html
│   ├── App.tsx              → Router setup + auth guards
│   ├── styles/
│   │   └── globals.css      → Design tokens, dark/light mode CSS variables
│   │
│   ├── pages/               → One file per screen
│   │   ├── Login.tsx        → OTP + email login screen
│   │   ├── Onboarding.tsx   → 5-step goal-setting flow
│   │   ├── Dashboard.tsx    → Home screen — tasks, metrics, score
│   │   ├── Coach.tsx        → AI coach chat + recovery flow
│   │   ├── Insights.tsx     → Weekly progress charts
│   │   └── Settings.tsx     → Preferences + demo controls
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── PhoneShell.tsx    → Desktop phone frame wrapper
│   │   │   ├── AppLayout.tsx     → Layout for logged-in pages (has BottomNav)
│   │   │   ├── AuthLayout.tsx    → Layout for login/onboarding (no BottomNav)
│   │   │   ├── BottomNav.tsx     → 3-tab bottom navigation bar
│   │   │   └── TopBar.tsx        → Top header (unused in current build)
│   │   │
│   │   ├── charts/
│   │   │   ├── InsightsCharts.tsx     → Charts on the Insights page
│   │   │   ├── WeeklyActivityChart.tsx
│   │   │   └── NutritionChart.tsx
│   │   │
│   │   ├── metrics/
│   │   │   └── MetricCard.tsx    → Individual metric card (steps, water etc.)
│   │   │
│   │   ├── coach/
│   │   │   └── CoachFAB.tsx      → Floating action button for coach
│   │   │
│   │   ├── log/
│   │   │   └── LogDrawer.tsx     → Log entry drawer (legacy, replaced by inline)
│   │   │
│   │   └── ui/                   → shadcn/ui base components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── switch.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   └── utils.ts          → `cn()` helper for merging Tailwind classes
│   │
│   └── types/
│       └── index.ts          → Shared TypeScript types
│
├── index.html                → Single HTML file — React mounts here
├── vite.config.ts            → Vite build configuration
├── tailwind.config.js        → Tailwind design system config
├── tsconfig.json             → TypeScript configuration
└── package.json              → Dependencies and scripts
```

---

## How It All Connects

### 1. Entry Point
```
index.html
  └── loads → src/main.tsx
                └── mounts → <App /> into #root div
```

### 2. App.tsx — The Router
`App.tsx` is the brain of navigation. It defines all routes and wraps them in two layouts:

```
App.tsx
  ├── PhoneShell (wraps everything in the phone frame)
  │
  ├── AuthLayout (no bottom nav)
  │   ├── /login       → Login.tsx
  │   └── /onboarding  → Onboarding.tsx
  │
  ├── AppLayout (with bottom nav)
  │   ├── /dashboard   → Dashboard.tsx
  │   ├── /coach       → Coach.tsx
  │   ├── /insights    → Insights.tsx
  │   └── /settings    → Settings.tsx
  │
  └── / (root)
        └── RootRedirect → checks localStorage → sends to /login, /onboarding, or /dashboard
```

### 3. Auth Guard Logic
Every time the app loads, `RootRedirect` runs:

```
Is aura_logged_in = "true"?
  No  → go to /login
  Yes → Is aura_onboarded = "true"?
          No  → go to /onboarding
          Yes → go to /dashboard
```

### 4. Login Flow
```
Login.tsx
  ├── Mobile tab selected
  │   ├── Enter phone number → sendOtp() → shows OTP screen
  │   └── Enter 6-digit OTP → verifyOtp()
  │         ├── Sets aura_logged_in = "true" in localStorage
  │         ├── Removes aura_onboarded (always forces onboarding)
  │         └── Redirects to /onboarding
  │
  └── Email tab selected
        └── Enter email + password → emailLogin()
              ├── Sets aura_logged_in = "true"
              └── Checks aura_onboarded → goes to /onboarding or /dashboard
```

### 5. Onboarding Flow
```
Onboarding.tsx (5 steps, internal state machine)
  Step 1: Goal selection
  Step 2: Profile (name, age, weight, height)
  Step 3: Coach style + workout days
  Step 4: Animated AI plan generation (2-second simulation)
  Step 5: Plan preview

  On complete:
    ├── Sets aura_onboarded = "true"
    ├── Sets aura_streak_status = "active"
    ├── Sets aura_profile = { name, goal, coachStyle }
    └── Redirects to /dashboard
```

### 6. Dashboard Data Flow
```
Dashboard.tsx
  │
  ├── MetricsState (local React state)
  │   └── { steps, calories, water, sleep }
  │       ↑ updated by inline task logging
  │
  ├── TaskList (hardcoded array of 6 tasks)
  │   └── Each task has: title, detail, logKey, logUnit, logMode
  │
  ├── completedTasks (Set in local state)
  │   └── tracks which tasks are checked
  │
  ├── allDone = completedTasks.size === tasks.length
  │
  └── score = allDone ? calcScore(metrics) : 0
        └── steps(35%) + calories(25%) + sleep(25%) + water(15%)
```

### 7. Bottom Navigation
```
BottomNav.tsx
  ├── Home    → /dashboard
  ├── Coach   → /coach      (center, highlighted)
  └── Insights → /insights

  Active tab detected by comparing current URL with useLocation()
```

### 8. Coach Recovery Flow
```
Coach.tsx
  ├── Checks useLocation().state?.recovery
  │     true  → enters Recovery Mode (4-step guided conversation)
  │     false → normal chat mode
  │
  └── Recovery mode steps:
        Step 1: What blocked you? (barrier chips)
        Step 2: Energy level today? (scale)
        Step 3: Updated plan preview
        Step 4: "Let's do this" confirmation
              └── Sets aura_streak_status = "fresh_start"
              └── Navigates to /dashboard
```

### 9. Theme (Dark/Light)
```
main.tsx
  └── ThemeProvider (next-themes) wraps entire app
        └── Reads/writes localStorage for preference
        └── Toggles "dark" class on <html> element
              └── Tailwind dark: variants apply automatically
```

---

## State Management Summary

This app uses **no external state management library** (no Redux, no Zustand). All state is either:

| Type | Where | Used For |
|---|---|---|
| `useState` | Inside each page component | UI state — active step, loaded data, input values |
| `localStorage` | Browser storage | Auth state, onboarding status, streak, profile |
| `useLocation().state` | React Router | Passing data between pages (e.g. recovery flag) |
| `useNavigate()` | React Router | Programmatic navigation |

---

## Key Design Decisions

**1. `window.location.href` vs `navigate()`**
After login and onboarding, the app uses `window.location.href = "/dashboard"` instead of React Router's `navigate()`. This triggers a full page reload, which re-evaluates the auth guards in `App.tsx` cleanly.

**2. Score locked at 0**
The wellness score shows 0 until ALL tasks are completed. This was intentional — it prevents a false sense of achievement from partial completion and creates a satisfying moment when all tasks are done.

**3. OTP always clears onboarding**
Mobile OTP login removes `aura_onboarded` from localStorage before redirecting. This ensures the full onboarding flow always runs in demos, regardless of prior browser state.

**4. Streak recovery without guilt**
The recovery card only appears when `aura_streak_status === "broken"`. The messaging avoids blame language. The coach guides the user back through a structured conversation, and on completion sets status to `"fresh_start"` — not back to `"active"` — to mark a new beginning rather than pretending the break didn't happen.
