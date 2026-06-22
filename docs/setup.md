# Setup Guide

## Prerequisites

- **Node.js 18 or higher** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
- A terminal (Command Prompt, PowerShell, or any terminal)

---

## Run Locally

### Step 1 — Clone the repo
```bash
git clone https://github.com/Satya2510/Digital-Health-Coach.git
cd Digital-Health-Coach
```

### Step 2 — Install dependencies
```bash
npm install
```
This downloads all packages listed in `package.json` into a `node_modules/` folder (~400MB). Takes 1–2 minutes on first run.

### Step 3 — Start the dev server
```bash
npm run dev
```
Open your browser at **http://localhost:5173**

The app hot-reloads on every file save — no need to restart the server.

---

## Build for Production

```bash
npm run build
```
- TypeScript is compiled and type-checked
- All files are bundled and minified
- Output goes to the `dist/` folder
- Upload the `dist/` folder to Netlify to deploy

---

## Available Scripts

| Command | What It Does |
|---|---|
| `npm run dev` | Start local dev server at localhost:5173 |
| `npm run build` | Build production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npx tsc -b` | Run TypeScript type check only (no build) |

---

## Testing the Full Flow

To demo the complete user journey from scratch:

1. Open the app
2. If already logged in → go to **Settings → Reset & restart**
3. You'll land on the Login screen
4. Enter any 10-digit number → tap Send OTP
5. Enter any 6 digits → tap Verify
6. Complete the 5-step onboarding
7. Arrive at the Dashboard

To test streak recovery:
1. Go to **Settings → Simulate streak break**
2. The recovery card appears on the Dashboard
3. Tap it → enters Coach recovery mode
4. Complete the 4-step conversation

---

## Deploying to Netlify

1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com) → Sites → drag and drop the `dist/` folder
3. Netlify generates a public URL

The `public/_redirects` file is automatically included in the build and handles SPA routing (prevents 404 on page refresh).

---

## Project Configuration Files

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite build settings, path aliases (`@/` → `src/`) |
| `tailwind.config.js` | Design system — custom colours, fonts, spacing |
| `tsconfig.json` | TypeScript compiler settings |
| `tsconfig.app.json` | TypeScript settings specific to the app source |
| `postcss.config.js` | PostCSS setup required by Tailwind |
| `index.html` | Single HTML entry point — React mounts into `<div id="root">` |

---

## Path Alias

The project uses `@/` as a shortcut for the `src/` directory:

```typescript
// Instead of:
import { cn } from "../../lib/utils"

// You write:
import { cn } from "@/lib/utils"
```

This is configured in `vite.config.ts` and `tsconfig.app.json`.
