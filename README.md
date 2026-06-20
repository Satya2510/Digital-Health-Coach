# Health-First — AI Digital Health Coach

An AI-powered mobile app for urban Indian professionals that provides personalised health coaching without streaks, guilt, or pressure.

## What it does

- **Daily check-in** — 3-tap morning pulse (sleep, energy, stress) → AI coach message
- **Holistic log** — log meals, sleep, stress in one screen
- **AI coach thread** — contextual daily messages from Claude
- **Weekly insight** — cross-domain pattern detection (e.g. sleep → food choices)
- **48-hour check-in** — if you go quiet, your coach reaches out warmly
- **Comeback plan** — return after a gap and get a lighter re-entry plan, not a streak reset

## Tech stack

| Layer | Tool |
|---|---|
| Mobile | React Native + Expo (SDK 56) |
| Navigation | Expo Router v3 |
| Styling | NativeWind v4 (Tailwind for RN) |
| Auth + DB | Supabase (PostgreSQL + Auth) |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Background jobs | Railway (Node.js cron) |
| Web deploy | Vercel (Expo web export) |
| Push notifications | Expo Notifications |

## Quick start (development)

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/Digital-Health-Coach.git
cd Digital-Health-Coach
npm install

# 2. Set up env vars
cp .env.example .env
# Fill in your Supabase URL, anon key, etc.

# 3. Run Supabase migrations
# Paste supabase/migrations/001_initial_schema.sql into Supabase SQL Editor → Run
# Then paste 002_helper_functions.sql

# 4. Start the app
npm start
# Scan QR code with Expo Go on your Android phone
```

## Project structure

```
app/              Expo Router screens (file = route)
  (auth)/         Login + signup
  (onboarding)/   3-step onboarding flow
  (tabs)/         Main app: Home, Log, Coach, Progress
components/       Reusable UI components
lib/              Supabase client, utilities
constants/        Design tokens, Claude prompt templates
supabase/
  migrations/     SQL schema files
  functions/      Edge Functions (Claude API proxy)
cron/             Railway background service
DOCS/             Architecture, decisions, deployment guide
```

## Deployment

See [DOCS/06-deployment-guide.md](DOCS/06-deployment-guide.md) for full step-by-step instructions.

**Web (for reviewers):** Deployed to Vercel — open in any browser.  
**Android APK:** Built with EAS — direct install.

## Design principles

- No streak counters anywhere
- Coach messages always in green (`#E1F5EE`)
- Insight cards always in purple (`#EEEDFE`)
- Comeback states in coral (`#FAECE7`)
- One primary CTA per screen
- Tone: warm, direct, non-judgmental
