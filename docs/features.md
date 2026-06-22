# Features & User Flows

## Screen Map

```
/login
  ↓ (OTP or email login)
/onboarding
  ↓ (complete 5 steps)
/dashboard  ←→  /coach  ←→  /insights
                              ↕
                          /settings
```

---

## 1. Login Screen (`/login`)

### Mobile OTP Flow
1. User enters a 10-digit mobile number
2. Taps "Send OTP" → loading spinner for ~1 second (simulated)
3. Screen slides to OTP entry — 6 individual input boxes
4. User types 6 digits (any digits work in prototype)
5. Taps "Verify" → `aura_onboarded` is cleared → redirects to `/onboarding`

### Email Flow
1. User switches to Email tab
2. Enters email + password
3. Taps "Continue" → checks `aura_onboarded` → redirects to onboarding or dashboard

### UI Details
- Health-themed SVG illustration as hero (ECG line, heart, water drop, leaf, footsteps)
- Animated slide transition between phone input and OTP steps
- Logo overlaid on illustration (bottom-left)
- Auto-focus advances through OTP boxes as digits are typed
- Backspace moves focus back to previous box

---

## 2. Onboarding (`/onboarding`)

A 5-step flow that collects user context and simulates AI plan generation.

### Step 1 — Goal Selection
- 5 goals displayed as selectable cards with icons:
  - Lose weight
  - Build fitness
  - Improve sleep
  - Reduce stress
  - Build stamina
- Selected card highlights in teal

### Step 2 — Profile
- Input fields: Full name, Age, Weight (kg), Height (cm)
- Clean form layout with labels

### Step 3 — Coach Preferences
- Coach style: Motivational / Balanced / Gentle
- Preferred workout days: Mon–Sun toggle buttons (multi-select)

### Step 4 — AI Plan Generation (Animated)
- Animated loading screen simulating AI processing
- Pulsing dots + "Aura is building your plan..." text
- 2-second animation, then auto-advances

### Step 5 — Plan Preview
- Shows a summary of the generated plan
- User taps "Let's start" to complete onboarding

### On Completion
- `aura_onboarded = "true"` saved to localStorage
- `aura_streak_status = "active"` set
- `aura_profile = { name, goal, coachStyle }` saved as JSON
- Redirects to `/dashboard`

---

## 3. Dashboard (`/dashboard`)

The main screen. Divided into four sections:

### Header
- Greeting: "Good morning, [name]" (or afternoon/evening based on time)
- Date: "Today, Mon 22 Jun"
- Streak badge: shows day count and status
- Avatar → taps to `/settings`

### Metrics Row (4 cards)
| Card | Metric | Default | Target |
|---|---|---|---|
| Steps | steps walked | 5,200 | 8,000 |
| Calories | burned | 640 | 500 |
| Water | litres | 0.5 L | 2.5 L |
| Sleep | hours | 0 hrs | 8 hrs |

Cards update live as tasks are logged.

### Wellness Score Ring
- Circular progress ring (0–100)
- **Shows 0 until all tasks are completed**
- Animates to the calculated score when all tasks are done
- Score formula:
  - Steps: 35% weight (score = min(steps/8000, 1) × 35)
  - Calories: 25% weight (score = min(cals/500, 1) × 25)
  - Sleep: 25% weight (score = min(sleep/8, 1) × 25)
  - Water: 15% weight (score = min(water/2.5, 1) × 15)

### Today's Plan (6 tasks)
Each task is an expandable card:

| Task | Logs | Unit |
|---|---|---|
| Morning Walk | steps | steps |
| Protein Breakfast | calories | kcal |
| Drink 1.5L Water | water | litres |
| Strength Training | (no log) | — |
| Evening Walk | steps | steps |
| Sleep by 10:30 PM | sleep | hours |

**Task interaction:**
1. Tap task → accordion expands showing detail text
2. Tap checkbox → marks complete, accordion collapses
3. If task has a log field → input appears in expanded view
4. Submit log → metric card updates immediately

**Completion state:**
- When all 6 tasks are checked:
  - Success banner animates in ("Great work today!")
  - Wellness score ring animates from 0 to earned score
  - "Tomorrow's Plan" preview section slides in

### Streak Recovery Card
- Only visible when `aura_streak_status === "broken"`
- Message: "No worries — let's restart"
- Button → navigates to `/coach` with `{ state: { recovery: true } }`

---

## 4. Coach (`/coach`)

### Normal Chat Mode
- Chat bubbles (user right, Aura left)
- Aura avatar with amber colour identity
- Quick reply chips: "How am I doing?", "Adjust my plan", "Motivate me", "I need a rest day"
- Pre-written responses mapped to each chip
- Text input for free-form messages

### Recovery Mode (triggered from Dashboard)
A guided 4-step conversation:

**Step 1 — What blocked you?**
- Chip options: Too busy / Felt unwell / Lost motivation / Travel / Other

**Step 2 — Energy level today**
- Scale: Low / Medium / High

**Step 3 — Updated plan**
- Shows a simplified restart plan based on selections

**Step 4 — Confirmation**
- "Let's do this" button
- Sets `aura_streak_status = "fresh_start"`
- Navigates back to `/dashboard`

---

## 5. Insights (`/insights`)

- Weekly activity bar chart (steps by day)
- Habit completion ring chart
- Nutrition breakdown chart
- All charts use hardcoded sample data (no real logging history in MVP)

---

## 6. Settings (`/settings`)

### Profile Card
- Shows name, email, goal, age (from onboarding data)
- "Edit" button (shows "coming soon" toast)

### Appearance
- Dark / Light mode toggle (functional)

### Notifications
- Daily reminders toggle
- Weekly report toggle
- Coach tips toggle
(All toggles are UI-only, no actual notifications sent)

### Links
- Account & privacy (coming soon)
- Security (coming soon)
- Help & support (coming soon)

### Prototype Demo Controls
- **Simulate streak break** → sets `aura_streak_status = "broken"` → goes to dashboard (shows recovery card)
- **Set fresh start** → sets `aura_streak_status = "fresh_start"` → goes to dashboard
- **Reset & restart** → clears all localStorage → goes to login (full fresh demo)

### Sign Out
- Removes `aura_logged_in` from localStorage
- Redirects to login

---

## Streak Status State Machine

```
[Login / Onboarding complete]
        ↓
    "active"
        ↓ (demo: Settings → Simulate break)
    "broken"
        ↓ (Recovery conversation in Coach)
  "fresh_start"
        ↓ (continues normally)
    "active"
```

The recovery card only renders in the `"broken"` state.
