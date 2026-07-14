# RankPilot — SEO Ranker SaaS Project Rules

## Project Overview

**RankPilot** is an AI-powered SEO analyzer SaaS built with a React + TypeScript frontend ("Clint main") and a Node.js/Express backend ("server"). It allows users to enter a website URL, run an AI-powered SEO audit, view detailed reports, and track keyword rankings over time.

---

## Architecture

### Monorepo Structure (Two Independent Apps)
```
SEO ranker/
├── Clint main/     ← Frontend (React + Vite + TailwindCSS v4)
├── server/         ← Backend (Express + MongoDB + JWT auth)
└── .agents/        ← Project context & rules (this folder)
```

**IMPORTANT**: The client folder is literally named `Clint main` (with a space). Always use this exact name.

---

## Frontend — `Clint main/`

### Tech Stack
| Technology | Version | Notes |
|---|---|---|
| React | 19.x | Uses functional components + hooks only |
| TypeScript | 6.x | Strict mode |
| Vite | 8.x | Build tool with `@vitejs/plugin-react` |
| TailwindCSS | 4.x | **v4 syntax** — uses `@import "tailwindcss"` + `@theme {}` block, NOT `@tailwind` directives |
| React Router DOM | 7.x | `<BrowserRouter>` wraps the app in `main.tsx` |
| Axios | 1.18.x | HTTP client for API calls |
| Lucide React | 1.14.x | Icon library — all icons come from here |
| react-hot-toast | 2.6.x | Toast notifications |
| @icons-pack/react-simple-icons | 13.x | Social media icons (footer only) |

### Entry Points
- **HTML**: `Clint main/index.html` — root `<div id="root">`
- **JS Entry**: `Clint main/src/main.tsx` — mounts `<App />` inside `<BrowserRouter>` + `<ThemeProvider>`
- **CSS Entry**: `Clint main/src/index.css` — global styles, CSS variables, TailwindCSS v4 `@theme` config

### Routing (React Router v7)
| Route | Component | Auth Required |
|---|---|---|
| `/` | `Home` | No |
| `/login` | `Login` (state="login") | No |
| `/register` | `Login` (state="register") | No |
| `/dashboard` | `Dashboard` | Yes (ProtectedRoute) |
| `/analyze` | `Analyze` | Yes |
| `/report/:id` | `Report` | Yes |
| `/history` | `History` | Yes |
| `/rank-tracker` | `RankTracker` | Yes |
| `/rank/:id` | `RankDetail` | Yes |

- Navbar is hidden on `/login` and `/register`
- All authenticated routes are wrapped in `<ProtectedRoute>` (currently just renders `<Outlet />` — **not yet fully implemented**)

### Design System (CSS Variables — `index.css`)
The app uses CSS custom properties for theming. Dark mode is toggled by adding `.dark` class to `<html>`.

**Color Variables:**
- `--background`, `--foreground`, `--card`, `--border`, `--muted`, `--muted-foreground`
- `--primary`, `--primary-dark`, `--accent`
- `--success` (#10b981), `--warning` (#f59e0b), `--danger` (#ef4444)
- `--glass-bg`, `--glass-border`

**Typography:**
- Primary font: `Outfit` (Google Fonts)
- Serif accent font: `DM Serif Display` (class: `dm-serif`)

**Utility Classes (custom, not Tailwind):**
- `.glass` — card-like container with border
- `.glass-strong` — backdrop-blur glassmorphism
- `.gradient-text` — gradient from `--primary` to `--accent`
- `.gradient-bg` — solid primary background
- `.score-good`, `.score-medium`, `.score-poor` — text color for scores
- `.score-bg-good`, `.score-bg-medium`, `.score-bg-poor` — background variants
- `.severity-critical`, `.severity-warning`, `.severity-info` — issue badges
- `.bg-dot-pattern` — radial dot pattern background

**Score thresholds (used EVERYWHERE — KEEP CONSISTENT):**
- `>= 80` → good (green/success)
- `>= 50` → medium (amber/warning)
- `< 50` → poor (red/danger)

### Context Providers
1. **ThemeProvider** (`context/ThemeContext.tsx`)
   - Manages `dark` | `light` | `system` theme
   - Persists to `localStorage` key: `rankpilot-theme`
   - Hook: `useTheme()` → `{ theme, setTheme }`

2. **AppContext** (`context/AppContext.tsx`)
   - **INCOMPLETE / WIP** — Has the interface defined but no Provider component yet
   - Defines `User` interface: `{ id, name, email, plan, analysisCount }`
   - Defines `AppContextType` with: `user`, `token`, `loading`, `api`, `login()`, `register()`
   - **Has a syntax error**: Extra closing brace on line 21

### Component Architecture
```
src/
├── components/
│   ├── home/           ← Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   ├── Navbar.tsx       ← Main nav (fixed top, responsive mobile menu)
│   ├── ProtectedRoute.tsx ← Auth guard (WIP — currently passes all through)
│   ├── ScoreGauge.tsx   ← Circular SVG progress gauge
│   ├── AnalysesCard.tsx ← Card showing analysis summary
│   ├── IssueCard.tsx    ← Expandable issue with severity badge
│   └── Loading.tsx      ← Full-screen spinner
├── pages/
│   ├── Home.tsx         ← Assembles Hero + Features + HowItWorks + Pricing + Footer
│   ├── Login.tsx        ← Login/Register form (dual-mode via `state` prop)
│   ├── Dashboard.tsx    ← User dashboard with quick analyze + stats + recent analyses
│   ├── Analyze.tsx      ← URL input → 4-step progress animation → redirect to report
│   ├── Report.tsx       ← Full SEO report with tabs (Overview/Meta/Content/Issues)
│   ├── History.tsx      ← Paginated history list with search/filter/sort
│   ├── RankTracker.tsx  ← Keyword rank tracker with add modal
│   └── RankDetail.tsx   ← Single keyword detail with canvas chart + competitors + history
├── context/
│   ├── ThemeContext.tsx
│   └── AppContext.tsx   ← WIP
└── assets/
    ├── assets.tsx       ← Static data: features, dummy analysis data, dummy rankings
    └── gemini-assets.ts ← Gemini AI schema + prompt template (reference only, not imported)
```

### Current State: USING DUMMY DATA
**CRITICAL**: The frontend currently uses **hardcoded dummy data** from `assets/assets.tsx` instead of real API calls. All `fetch` functions use `setTimeout()` to simulate loading. Key dummy data exports:
- `dummyAnalysisData` — Array of analysis summaries (used in Dashboard, History)
- `dummyWebsiteAnalysis` — Full analysis object (used in Report)
- `dummyRankings` — Array of keyword tracking items (used in RankTracker)
- `dummyWebsiteRanking` — Full ranking detail (used in RankDetail)
- `homeFeaturesData`, `homeHowItWorksData`, `homefooterLinks`, `HomeWave` — Landing page content

### Navbar Hardcoded User
The Navbar currently has a **hardcoded user** object:
```tsx
const { user } = { user: { name: "John", email: "john@example.com", plan: "PRO" } };
```
This should eventually come from `AppContext`.

### Deployment
- **Client**: Deployed to **Vercel** — `vercel.json` has SPA rewrites configured
- Build command: `tsc -b && vite build`
- Dev command: `vite` (port 5173 by default)

---

## Backend — `server/`

### Tech Stack
| Technology | Version | Notes |
|---|---|---|
| Node.js/Express | Express 5.x | ES Modules (`"type": "module"`) |
| MongoDB/Mongoose | Mongoose 9.x | Cloud MongoDB Atlas cluster |
| JWT | jsonwebtoken 9.x | Token-based auth |
| bcrypt | 6.x | Password hashing |
| cors | 2.8.x | Cross-origin requests |
| dotenv | 17.x | Env variables (loaded via `"dotenv/config"` import) |
| nodemon | 3.1.x | Dev server |

### Server Structure
```
server/
├── server.js           ← Entry point (Express app, cors, routes)
├── config/db.js        ← MongoDB connection via mongoose
├── controllers/
│   └── authController.js ← register, login, getUser
├── middleware/
│   └── auth.js         ← JWT verification middleware
├── model/
│   └── User.js         ← Mongoose User schema
├── routes/
│   └── authRoutes.js   ← POST /register, POST /login, GET /user
├── .env                ← Environment variables
└── package.json
```

### API Routes
| Method | Endpoint | Auth | Controller | Description |
|---|---|---|---|---|
| GET | `/` | No | inline | Health check ("Server is running") |
| POST | `/api/auth/register` | No | `register` | Create new user |
| POST | `/api/auth/login` | No | `login` | Authenticate user |
| GET | `/api/auth/user` | Yes | `getUser` | Get current user (excludes password) |

### User Model (Mongoose)
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  password: String (required),
  plan: String (enum: ["free", "pro"], default: "free"),
  analysisCount: Number (default: 0),
  lastanalysisDate: Date (default: null)
}
// timestamps: true (auto createdAt, updatedAt)
```

### Environment Variables (server/.env)
- `JWT_TOKEN` — JWT signing secret
- `MONGODB_URI` — MongoDB Atlas connection string

### Known Bugs in Backend
1. **`authController.js` line 31**: `User.crete(...)` → should be `User.create(...)`
2. **`authController.js` line 7 vs `middleware/auth.js` line 12**: JWT secret mismatch — controller uses `process.env.JWT_TOKEN` but middleware uses `process.env.JWT_SECRET`
3. **`authController.js` line 19**: Typo in message: "All fiels are required" → "All fields are required"
4. **`authController.js` line 37, 76**: Error log says "Registerd error" even in login handler

### Auth Flow
1. Register: Hash password → create user → return JWT + user
2. Login: Find user by email → compare passwords → return JWT + user
3. Protected routes: `Authorization: Bearer <token>` header → middleware verifies JWT → sets `req.userId`

### Server Commands
- Dev: `npm run server` (uses nodemon)
- Production: `npm run start` (uses node)
- Default port: `8000` (configurable via `PORT` env var)

---

## Important Patterns & Conventions

### Button Styling Pattern
Primary buttons use this pattern throughout the app:
```tsx
<button className="bg-primary ..." style={{ color: "var(--background)" }}>
```
The `style={{ color: "var(--background)" }}` is needed because `text-primary-foreground` doesn't work correctly with the current Tailwind v4 setup. **Always use this pattern for primary buttons.**

### Score Display Pattern
Used in Dashboard, History, Report, AnalysesCard:
```tsx
const getScoreClass = (s: number) => {
  if (s >= 80) return "score-good";
  if (s >= 50) return "score-medium";
  return "score-poor";
};
```

### Card Styling
All cards use the `glass` class or `bg-card border border-border rounded-2xl` pattern.

### Icon Usage
All icons come from `lucide-react`. The app uses `<ChartNoAxesColumnIcon />` as the brand logo.

### Landing Page
The Home page is composed of 5 sections in order: Hero → Features → HowItWorks → Pricing → Footer. The Hero includes an animated SVG wave (`HomeWave` component).

---

## What's NOT Built Yet (WIP/TODO)

1. **AppContext Provider** — Interface defined but no Provider implementation. No actual auth state management.
2. **ProtectedRoute** — Just renders `<Outlet />`, no actual authentication check.
3. **Real API integration** — All pages use dummy data with `setTimeout()`.
4. **Analysis API endpoints** — No server routes for creating/fetching SEO analyses.
5. **Rank Tracker API endpoints** — No server routes for keyword tracking.
6. **Gemini AI integration** — Schema and prompt exist in `gemini-assets.ts` but not wired up.
7. **BrowserBase integration** — Referenced in UI text but no implementation.
8. **Payment/Stripe integration** — Pricing page exists but no payment flow.
9. **User plan enforcement** — Free tier limits (5/day) shown in UI but not enforced.
10. **Login page** — Form exists but `handleSubmit` does nothing.

---

## Rules for AI Agents

1. **Always use TailwindCSS v4 syntax** — `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
2. **Follow the existing theme system** — Use CSS variables (`var(--background)`, etc.) not hardcoded colors
3. **Keep the score threshold consistent**: ≥80 good, ≥50 medium, <50 poor
4. **Use `lucide-react` for all icons** — Don't introduce other icon libraries
5. **Use ES Modules in the server** — `import/export` syntax, file extensions in imports (`.js`)
6. **Maintain the existing component structure** — pages in `pages/`, reusable components in `components/`
7. **The brand name is "RankPilot"** (or "Rank Pilot" with space) — keep this consistent
8. **Client folder is `Clint main`** — always reference with this exact name
9. **Primary font is Outfit, accent serif is DM Serif Display**
10. **Use `react-hot-toast` for notifications** — already imported in App.tsx
