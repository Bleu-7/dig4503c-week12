# Game Log - Implementation Plan

A Letterboxd-style video game tracking website.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Data (MVP) | localStorage (abstracted behind a service layer) |
| Data (Post-MVP) | Supabase (migration-ready by design) |
| Game Data API | RAWG |

---

## CSS Styling: Tailwind CSS + shadcn/ui

### Why This Stack

- Vite has first-class Tailwind support
- shadcn/ui ships dark mode by default using CSS variables
- Tailwind's `dark:` variant makes light/dark toggling trivial
- shadcn components have a deliberately understated, minimal aesthetic
- Responsive design is handled natively via Tailwind's prefix-based breakpoint system

### Setup

```bash
npm create vite@latest my-game-tracker -- --template react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init
```

During `shadcn init`, choose **Zinc** or **Slate** as the base color for dark minimalism.

### Recommended Dark Mode Color Palette

| Role | Tailwind Token |
|---|---|
| Background | `zinc-950` or `slate-950` |
| Surface / Cards | `zinc-900` |
| Border | `zinc-800` |
| Primary Text | `zinc-100` |
| Muted Text | `zinc-400` |
| Accent | `violet-500` or `emerald-500` (one bold color) |

### Responsive Design

Tailwind's breakpoint system is mobile-first. A single line handles all screen sizes:

```jsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
```

| UI Pattern | Responsive Approach |
|---|---|
| Game grid / browse | `grid-cols-2 md:grid-cols-4 lg:grid-cols-6` |
| Game detail page | Stack vertically on mobile, side-by-side on desktop |
| Navigation | Use shadcn `Sheet` component as mobile drawer from day one |
| Review cards | Full-width mobile, constrained max-width on desktop |

---

## Data Layer: localStorage → Supabase Migration Strategy

### Abstract the Data Layer from Day One

Do NOT scatter localStorage calls across components. Centralize all data access in a service file:

```js
// lib/gameService.js
export const getGames = () => JSON.parse(localStorage.getItem('games')) ?? []
export const addGame = (game) => { ... }
export const removeGame = (id) => { ... }
```

When migrating to Supabase, only `gameService.js` needs to be rewritten — components remain untouched.

### Why Supabase Over Firebase

| | Supabase | Firebase |
|---|---|---|
| Data model | Relational (SQL) | Document / NoSQL |
| Auth built-in | Yes | Yes |
| Fit for this app | Better — users/games/reviews are naturally relational | Requires more denormalization |
| Free tier | Generous | Generous |

SQL handles relational queries naturally (e.g. "all reviews for a game sorted by rating").

### What the Migration Involves

1. Create Supabase project and define tables matching your existing data shape
2. Install `@supabase/supabase-js` and configure the client
3. Rewrite service functions to use Supabase queries instead of localStorage
4. Integrate Supabase Auth (~50 lines with React)
5. Handle async/await — the main adjustment (localStorage is sync, Supabase is async)

Using React Query or standard `useEffect` patterns from the start minimizes this friction.