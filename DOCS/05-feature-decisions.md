# 05 — Feature Decisions

## No streak counter — anywhere

**Decision:** Zero streak mechanics in the app. Progress tab shows "X days logged this week" (Mon–Sun window).

**Why:** Streak counters are the primary reason users feel shame and stop using health apps. Once you break a streak, the sunk cost feels overwhelming. A weekly window resets cleanly every Monday — a gap on Wednesday doesn't ruin anything.

## Comeback plan instead of streak reset

**Decision:** When a user returns after 5+ days away, the app automatically generates a *lighter* plan for the week. It does not resume the previous plan and it does not display how many days were missed.

**Why:** The number-one re-engagement barrier is users feeling like they're "too far behind." A lighter plan removes that barrier. The language deliberately uses "Just" and "Only" to signal ease.

## 48-hour silence detector with 3 options

**Decision:** The cron job sends a check-in message after 48 hours of inactivity, with exactly 3 response options. The options cover the three main emotional states: ready to resume, not ready, wants to talk.

**Why:** A guilt-free re-entry requires acknowledging that users have different reasons for going quiet. Offering 3 paths respects where they actually are.

## Claude API called server-side only

**Decision:** All Claude API calls go through Supabase Edge Functions, never directly from the mobile app.

**Why:** The `ANTHROPIC_API_KEY` must never appear in a mobile app bundle — it would be extractable. Edge Functions are server-side, the key is stored as a Supabase secret, and the mobile app only makes authenticated calls to the Edge Function endpoint.

## Supabase for everything (Auth + DB + Edge Functions)

**Decision:** Auth, database, and AI proxy all live in Supabase.

**Why:** Reduces the number of services. Auth and DB already require Supabase; adding Edge Functions there means zero extra infrastructure for the core feature. Railway is only used for the cron jobs (which Supabase does not natively support as recurring schedules).

## NativeWind over StyleSheet

**Decision:** NativeWind v4 for all styling.

**Why:** Tailwind class names are immediately readable, consistent across the team, and keep styling co-located with components. The design system (colors, spacing) is defined once in `tailwind.config.js` and referenced everywhere.

## Web build for reviewer access

**Decision:** Expo web export deployed to Vercel as the primary reviewer URL.

**Why:** Reviewers may not have Android devices. A Vercel URL works in any browser on any device.
