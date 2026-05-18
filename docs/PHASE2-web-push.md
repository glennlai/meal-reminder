# Phase 2 — Next.js migration + Web Push

Two related goals:

1. **Migrate** the client PWA from Vite + React Router to **Next.js 15** (App Router, React 19).
2. **Add** a minimal backend for reliable 1-hour-before push when the app is closed.

No meal photos are uploaded in this phase.

---

See **[PHASE2-Next15-migration-plan.md](./PHASE2-Next15-migration-plan.md)** for the minimal Next 15 folder layout, route mapping, and client/server boundaries.

---

## Part A — Vite → Next 15 migration checklist

### When to do this

- Recommended **before or alongside** Web Push work so API routes live in the same repo as the app.
- Optional to delay if MVP on Vite is still iterating and Phase 2 is months away.

### Prerequisites

- [ ] Node 18.18+ (you have 24.x)
- [ ] pnpm enabled (`corepack enable` or `brew install pnpm`)
- [ ] MVP on Vite is stable (log meal, countdown, local reminders)

### 1. Scaffold Next app (in place or new branch)

- [ ] `pnpm create next-app@latest .` **or** manual setup on a branch
- [ ] Choose: TypeScript, App Router, Tailwind, use `src/` for lib/db/repos
- [ ] Set `"packageManager": "pnpm@10.11.0"` in `package.json`
- [ ] Align versions with `personal-website`: `next@15`, `react@19`, `tailwindcss@4`

### 2. Move shared code (minimal changes)

| From (Vite) | To (Next) | Notes |
|-------------|-----------|--------|
| `src/lib/schedule.ts` | `src/lib/schedule.ts` | No `"use client"` |
| `src/lib/*.test.ts` | `src/lib/*.test.ts` | Vitest + `vitest.config.ts` |
| `src/types/meal.ts` | `src/types/meal.ts` | |
| `src/db/dexie.ts` | `src/db/dexie.ts` | Client-only consumers |
| `src/repositories/*` | `src/repositories/*` | |
| `src/hooks/*` | `src/hooks/*` | Top of file: `"use client"` |
| `src/components/*` | `src/components/*` | `"use client"` where using hooks/DOM |
| `src/pages/home-page.tsx` | `app/page.tsx` | Re-export or inline; `"use client"` |
| `src/pages/log-meal-page.tsx` | `app/log/page.tsx` | |
| `src/pages/history-page.tsx` | `app/history/page.tsx` | |
| `src/components/layout.tsx` | `app/layout.tsx` + nav component | Drop `react-router-dom` `Link` → `next/link` |

- [ ] Delete: `src/main.tsx`, `src/App.tsx`, `src/pages/`, `index.html`, `vite.config.ts`, `src/vite-env.d.ts`
- [ ] Remove deps: `vite`, `@vitejs/plugin-react`, `vite-plugin-pwa`, `react-router-dom`, `workbox-window`
- [ ] Add deps: `next`, Serwist (or `@ducanh2912/next-pwa`), `eslint-config-next`

### 3. Client vs server boundaries

- [ ] Every page under `app/` that uses Dexie, hooks, camera, or `Notification` → **`"use client"`** at top
- [ ] `app/layout.tsx`: can be server component wrapping a **client** `Providers` + nav if needed
- [ ] Never import `dexie` / `reminder-service` from a Server Component or `route.ts`
- [ ] `image-resize.ts`, `reminder-service.ts` → only imported from client components/hooks

### 4. PWA + service worker on Next

- [ ] Pick **Serwist** (actively maintained) or `@ducanh2912/next-pwa`
- [ ] Port logic from `src/sw.ts`:
  - precache app shell
  - `notificationclick` → focus/open `/`
  - `message` handlers: `SET_REMINDER`, `CLEAR_REMINDER`, `CHECK_NOW`
- [ ] Register SW from a client component in `app/layout.tsx` (not from `main.tsx`)
- [ ] Manifest: `name`, `short_name`, `theme_color`, `display: standalone`, icons in `public/`
- [ ] Keep `reminder-service.ts` timeout-safe `getRegistration()` (avoid hanging on `serviceWorker.ready`)
- [ ] Test: install PWA, log meal, background tab, reopen within reminder window

### 5. Routing & navigation

- [ ] `/` — home (countdown)
- [ ] `/log` — log meal
- [ ] `/history` — history
- [ ] Replace `useNavigate()` → `useRouter()` from `next/navigation`
- [ ] Replace `<Link to="...">` → `<Link href="...">` from `next/link`

### 6. Styling

- [ ] Tailwind 4 via `postcss.config.mjs` + `@tailwindcss/postcss` (match `personal-website`)
- [ ] Move global styles to `app/globals.css` with `@import "tailwindcss"`
- [ ] Copy `@theme` brand colors from `src/index.css`

### 7. Testing & quality

- [ ] `pnpm test` — Vitest for `schedule.ts` / reminder logic (unchanged)
- [ ] `pnpm build` — fix any `window` / `indexedDB` leaks into server bundle
- [ ] `pnpm lint` — `eslint-config-next`
- [ ] Manual QA: log meal (no stuck “Saving”), history, clear schedule, notifications

### 8. Deploy

- [ ] Vercel project linked to repo
- [ ] Env vars placeholder for Phase 2 VAPID keys
- [ ] Confirm HTTPS (required for SW + push)

### Migration risks (mitigations)

| Risk | Mitigation |
|------|------------|
| SW config regressions | Port `sw.ts` behavior test-by-test; compare with Vite build |
| Dexie on server | `"use client"` on all consumers; no top-level `db` import in RSC |
| Larger bundles | Acceptable; app is small; use dynamic import for heavy paths if needed |
| Dev SW quirks | Use Serwist dev options; hard-refresh during SW debugging |

### Definition of done (migration only)

- [ ] Same UX as Vite MVP: log photo, hours, countdown, history, onboarding
- [ ] PWA installable; offline shell loads
- [ ] Local reminders still work (in-app + catch-up on open)
- [ ] No regression on “Saving…” hang (SW registration timeouts)

---

## Part B — Web Push backend (after migration)

### Outline

1. Generate VAPID keys; store in env (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`).
2. `POST /api/push/subscribe` — body: `subscription`, `reminderAt`, `nextMealAt`; persist (KV/Postgres/Upstash).
3. `DELETE /api/push/cancel` — cancel job on new meal or clear schedule.
4. Cron or delayed job (Vercel Cron / Cloudflare Worker) fires push at `reminderAt`.
5. Client (`reminder-service.ts`):
   - After `requestPermission()` → `pushManager.subscribe()` with VAPID public key
   - On `logMeal` → POST subscribe + schedule
   - On `cancel` / new log → DELETE cancel previous

### API sketch

```typescript
// POST /api/push/subscribe
{ subscription: PushSubscriptionJSON, reminderAt: number, nextMealAt: number }

// DELETE /api/push/cancel
{ endpoint?: string } // or user/device id later
```

### Client additions

- [ ] `src/lib/push-client.ts` — subscribe, POST, DELETE (calls `/api/push/*`)
- [ ] Wire into `logMeal` / `cancel` in `use-active-schedule.ts`
- [ ] Fallback: keep existing local reminder layers if push fails

### Definition of done (Phase 2 full)

- [ ] App runs on Next 15 + deploys to Vercel
- [ ] Push notification fires ~1h before `nextMealAt` with app **fully closed** (Chrome/Android; document iOS limits)
- [ ] New meal log replaces previous server-side schedule
- [ ] No photo upload; only subscription + timestamps on server

---

## Suggested order of work

1. Branch: `feat/next-migration`
2. Complete **Part A** checklist; ship and verify MVP on Next
3. Branch: `feat/web-push`
4. Complete **Part B**; env keys on Vercel
5. Update README with dev/deploy commands (`pnpm dev`, env vars)

---

## References

- [Serwist + Next.js](https://serwist.pages.dev/docs/next)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Web Push (web.dev)](https://web.dev/articles/push-notifications-overview)
- Existing client: `src/lib/reminder-service.ts`, `src/repositories/meal-repository.ts`
