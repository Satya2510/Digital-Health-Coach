# 06 — Deployment Guide

## Prerequisites
- Node.js 18+, Expo CLI, EAS CLI installed
- Accounts: GitHub, Expo, Supabase, Railway, Vercel, Anthropic

---

## Step 1 — GitHub

```bash
git init
git add .
git commit -m "feat: initial project structure"
git remote add origin https://github.com/YOUR_USERNAME/Digital-Health-Coach.git
git push -u origin main
```

---

## Step 2 — Supabase database migration

1. Open your Supabase project → **SQL Editor**
2. Paste contents of `supabase/migrations/001_initial_schema.sql` → click **Run**
3. Paste contents of `supabase/migrations/002_helper_functions.sql` → click **Run**
4. Verify tables appear in the Table Editor

---

## Step 3 — Supabase Edge Functions

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref YOUR_PROJECT_REF`
4. Set secrets:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```
5. Deploy all edge functions:
   ```bash
   supabase functions deploy coach-message
   supabase functions deploy comeback-plan
   supabase functions deploy insight
   supabase functions deploy coach-response
   ```

---

## Step 4 — Environment variables (local)

```bash
cp .env.example .env
```

Fill in:
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # DO NOT commit
ANTHROPIC_API_KEY=sk-ant-...       # DO NOT commit
RAILWAY_CRON_SECRET=generate-a-random-string-here
```

---

## Step 5 — Run locally

```bash
npm start
```
Scan the QR code with Expo Go on your Android phone.

---

## Step 6 — Build APK (Android, for sharing)

```bash
eas login
eas build:configure
eas build --platform android --profile preview
```

EAS will return a download URL for the APK. Share this link with Android reviewers.

---

## Step 7 — Deploy web version to Vercel

1. Push your code to GitHub (Step 1 must be done)
2. Go to vercel.com → **Add New Project** → import `Digital-Health-Coach`
3. Set environment variables in Vercel dashboard:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
4. Set **Framework Preset** to `Other`
5. Set **Build Command** to: `npx expo export --platform web`
6. Set **Output Directory** to: `dist`
7. Click **Deploy**

Your web URL is live — share this with reviewers.

---

## Step 8 — Deploy Railway cron service

1. Go to railway.app → **New Project** → **Deploy from GitHub repo**
2. Select `Digital-Health-Coach` → set **Root Directory** to `cron`
3. Set environment variables in Railway:
   ```
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ANTHROPIC_API_KEY=sk-ant-...
   RAILWAY_CRON_SECRET=same-value-as-local
   ```
4. Railway auto-detects `package.json` and runs `npm start`
5. Verify in logs: "Health-First cron service started."

---

## Step 9 — OTA updates (code changes only)

For JavaScript-only changes (no native module additions):

```bash
eas update --branch main --message "your update message"
```

Users get the update automatically on next app open. No new APK needed.

---

## Verify end-to-end

1. Open the web URL → see splash screen
2. Sign up → complete onboarding (3 steps)
3. Complete daily check-in → coach message appears (green bubble)
4. Visit Log tab → add a meal
5. Visit Progress tab → see days logged this week
6. Visit Coach tab → see all messages
