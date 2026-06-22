# Tech Stack

## Core Framework

### React 18 + TypeScript
- **What it is:** The UI framework. Every screen is a React component.
- **Why:** Industry standard for building interactive UIs. TypeScript adds type safety — catches bugs at build time, not runtime.
- **Version:** React 18.x

### Vite
- **What it is:** The build tool and local dev server.
- **Why:** Extremely fast — hot reload on file save is near-instant. Much faster than the older Create React App setup.
- **Commands:**
  - `npm run dev` → starts local server at localhost:5173
  - `npm run build` → compiles everything into the `dist/` folder

---

## Styling

### Tailwind CSS v3.4
- **What it is:** A utility-first CSS framework. Instead of writing CSS files, you apply small class names directly in the HTML/JSX.
- **Why:** Fast to build with. Consistent spacing, colours, and sizing out of the box.
- **Example:** `className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-card"` — that entire line replaces what would be 10+ lines of CSS.
- **Config file:** `tailwind.config.js` — defines custom colours (`primary`, `coach`, `card` etc.) and the design system.

### CSS Custom Properties (Design Tokens)
Defined in `src/styles/globals.css`. Two semantic colour systems:
- **Teal** (`--primary`) — data, metrics, user actions
- **Amber** (`--coach`, `--coach-bg`, `--coach-border`) — AI coach identity
- Both sets have light and dark mode variants

---

## Animation

### Framer Motion
- **What it is:** The animation library for React.
- **Why:** Makes complex animations simple — page transitions, staggered list entries, the wellness score ring, success banners all use it.
- **Key patterns used:**
  - `motion.div` — any div that animates
  - `AnimatePresence` — animates components when they appear or disappear
  - `variants` — named animation states (`hidden`, `show`, `exit`) applied to parent and children
  - Stagger — children animate one after another with a delay

---

## Routing

### React Router v6
- **What it is:** Handles navigation between screens without page reloads.
- **Why:** Standard routing library for React apps.
- **How it works:** URL changes (`/dashboard`, `/coach`, `/onboarding`) render different page components. No actual network request — it's all in the browser.
- **Auth guard:** `RootRedirect` component checks localStorage before allowing access to any route.

---

## UI Components

### shadcn/ui
- **What it is:** A collection of pre-built, accessible UI components.
- **Components used:** Button, Switch, Label, Input, Card, Dialog, Badge, Progress, Separator, Tabs
- **How it works:** Components live in `src/components/ui/` — they are copied into the project (not imported from a package), so they can be customised freely.

### Lucide React
- **What it is:** Icon library.
- **Why:** Clean, consistent line icons. Used throughout the app for navigation, actions, and status indicators.

---

## Theme

### next-themes
- **What it is:** Dark/light mode management.
- **How it works:** Wraps the app and toggles a `dark` class on the HTML element. Tailwind's `dark:` variant then applies different colours automatically.
- **Persists** the user's preference in localStorage across sessions.

---

## Notifications (In-App)

### Sonner
- **What it is:** Toast notification library — the small popups that appear at the bottom of the screen.
- **Used for:** "Coming soon" messages when tapping placeholder buttons in Settings.

---

## Hosting & Deployment

### Netlify
- **What it is:** Static site hosting.
- **How it works:** The `dist/` folder (built with `npm run build`) is uploaded to Netlify, which serves it as a website.
- **SPA fix:** `public/_redirects` contains `/* /index.html 200` — this tells Netlify to always serve the React app even when the user navigates directly to a sub-URL like `/dashboard`. Without this, you get a 404.

---

## Package Summary

```json
Dependencies (shipped to users):
  react, react-dom          — core framework
  react-router-dom          — routing
  framer-motion             — animations
  next-themes               — dark/light mode
  lucide-react              — icons
  sonner                    — toast notifications
  tailwind-merge, clsx      — CSS class utilities
  @radix-ui/*               — primitive components (used by shadcn/ui)

Dev Dependencies (build tools only):
  vite                      — build tool
  typescript                — type checking
  tailwindcss               — CSS framework
  autoprefixer, postcss     — CSS processing
  @vitejs/plugin-react      — Vite + React integration
```
