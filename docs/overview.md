# Project Overview

## What Is This?

Digital Health Coach is a mobile-first health coaching app prototype. The app pairs users with an AI coach named **Aura** that creates personalised daily plans, tracks habits, manages streaks, and converses with the user to keep them on track.

The product was built as an **MVP prototype** — fully interactive, shareable as a browser link, and designed to demonstrate the complete user experience before investing in a real backend.

---

## What We Built

### Front-end only
Everything visible and interactive — all screens, animations, transitions, logic, and flows — is built. There is no server, no database, and no real AI behind it. It is a high-fidelity prototype that behaves like a real app.

### Phone-frame prototype
On desktop, the app renders inside a realistic iPhone-style frame (393×852px) with a Dynamic Island notch and drop shadow. This lets anyone open the link on a laptop and see it exactly as it would look on a phone.

---

## What Is Real vs. Simulated

| Feature | Status | Detail |
|---|---|---|
| All UI screens | Real | Fully built and interactive |
| Mobile OTP login | Simulated | Any 6 digits work — no SMS sent |
| Email login | Simulated | No password check |
| Goal-setting onboarding | Real | Full 5-step interactive flow |
| Daily task plan | Real UI | Tasks are hardcoded, not server-generated |
| Inline task logging | Real | Updates metrics live on screen |
| Wellness score calculation | Real | Formula runs in browser |
| Streak tracking | Real | Stored in browser localStorage |
| AI Coach chat | Simulated | Pre-written replies, not a live LLM |
| Streak recovery conversation | Real UI | Scripted 4-step flow |
| Dark / Light mode | Real | Fully working |
| Backend / Server | Not built | Nothing runs on a server |
| Database | Not built | No permanent data storage |
| Real SMS / OTP | Not built | No Twilio or gateway connected |
| Real AI / LLM | Not built | No API connected |
| Push notifications | Not built | Toggle in UI only |
| Health API (Apple/Google Fit) | Not built | Data is entered manually |

---

## Where Data Is Stored

All state lives in **browser localStorage** — the browser's own key-value store on the user's device.

Keys used:

| Key | Value | Purpose |
|---|---|---|
| `aura_logged_in` | `"true"` | Whether user is authenticated |
| `aura_onboarded` | `"true"` | Whether onboarding is complete |
| `aura_streak_status` | `"active"` / `"broken"` / `"fresh_start"` | Current streak state |
| `aura_profile` | JSON string | Name, goal, coach style from onboarding |

**Implications:**
- Data resets if the user clears browser storage
- Data does not sync across devices
- No real user accounts exist

---

## Deployment

- **Hosting:** Netlify (static file hosting)
- **SPA routing fix:** `public/_redirects` → `/* /index.html 200` prevents 404 on page refresh
- **Build command:** `npm run build` → outputs to `dist/`
- **Deploy method:** Drag and drop `dist/` folder to Netlify
