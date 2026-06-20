# 02 — Architecture

## System overview

```
Mobile App (React Native + Expo)
    │
    ├── Supabase Auth       ← login, signup, session persistence
    ├── Supabase DB         ← all data: profiles, checkins, food_logs, coach_messages, plans
    ├── Supabase Edge Fns   ← Claude API proxy (server-side, key never in app bundle)
    │       ├── /coach-message     ← daily check-in response
    │       ├── /comeback-plan     ← lighter re-entry plan
    │       ├── /insight           ← weekly pattern analysis
    │       └── /coach-response    ← follow-up on user's tapped reply
    │
Railway Cron Service (Node.js)
    ├── Silence detector    ← every 6hr: finds 48hr inactive users → Claude → push notification
    └── Weekly insight      ← every Sunday: generates insight for active users
```

## Data flow: daily check-in

```
User taps 3-tap check-in (sleep/energy/stress)
  → POST /api/checkins → Supabase: insert into checkins
  → POST /supabase/functions/v1/coach-message
      → Edge Function reads goal from profiles
      → Calls Claude API (ANTHROPIC_API_KEY server-side)
      → Inserts message into coach_messages
      → Returns { message } to mobile app
  → App displays message in green CoachBubble
```

## Data flow: 48-hour silence detector

```
Railway cron: every 6 hours
  → Query: get_inactive_users() RPC
    (users inactive 48hr+ who haven't received checkin_48hr in last 48hr)
  → For each user:
    → Call Claude API → generate check-in message with 3 response options
    → Insert into coach_messages (type: checkin_48hr)
    → POST to Expo push notification API (if expo_push_token exists)
```

## Security

- `ANTHROPIC_API_KEY` never in mobile bundle — only in Railway env and Supabase Edge Function secrets
- `SUPABASE_SERVICE_ROLE_KEY` never in mobile bundle — only in Railway env and Edge Functions
- Mobile app uses only `EXPO_PUBLIC_SUPABASE_ANON_KEY` + Row Level Security policies
- All user data protected by RLS: users can only query their own rows

## Key dependencies

- `@supabase/supabase-js` — database + auth client
- `@react-native-async-storage/async-storage` — session persistence
- `nativewind` — Tailwind CSS for React Native
- `expo-notifications` — push notification registration
- `expo-router` — file-based navigation
