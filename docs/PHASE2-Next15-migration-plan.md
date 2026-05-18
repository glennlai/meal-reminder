# Phase 2 — Next.js 15 migration plan

Target structure for migrating **meal-reminder** from Vite + React Router to **Next.js 15** (App Router, React 19).

For the full migration checklist and Web Push backend, see [PHASE2-web-push.md](./PHASE2-web-push.md).

---

## Minimal Next 15 folder layout (after migration)

```text
meal-reminder/
├── app/
│   ├── layout.tsx                 # root shell, nav, metadata, PWA provider (client)
│   ├── page.tsx                   # home — countdown, active meal (client)
│   ├── log/
│   │   └── page.tsx               # log meal — photo + hours (client)
│   ├── history/
│   │   └── page.tsx               # meal history (client)
│   └── api/                       # Phase 2 — add when implementing push
│       └── push/
│           ├── subscribe/
│           │   └── route.ts       # POST — save subscription + schedule
│           └── cancel/
│               └── route.ts       # DELETE — cancel scheduled push
├── public/
│   ├── favicon.svg
│   └── icons/                     # optional PNGs for manifest
├── src/
│   ├── components/                # move from current src/components
│   │   ├── layout-nav.tsx         # bottom nav (extracted from layout)
│   │   ├── countdown.tsx
│   │   ├── meal-card.tsx
│   │   ├── photo-capture.tsx
│   │   ├── hours-input.tsx
│   │   └── onboarding-banner.tsx
│   ├── hooks/
│   │   ├── use-active-schedule.ts
│   │   ├── use-countdown.ts
│   │   └── use-photo-url.ts
│   ├── lib/
│   │   ├── schedule.ts            # pure — no "use client"
│   │   ├── schedule.test.ts
│   │   ├── reminder-service.ts    # browser APIs — import only from client
│   │   ├── reminder-service.test.ts
│   │   └── image-resize.ts        # client only
│   ├── db/
│   │   └── dexie.ts               # client only
│   ├── repositories/
│   │   ├── meal-repository.ts
│   │   └── local-meal-repository.ts
│   ├── types/
│   │   └── meal.ts
│   └── sw/                        # Serwist (or next-pwa) service worker
│       └── index.ts               # notificationclick + reminder polling
├── next.config.ts                 # Serwist / PWA wrapper
├── postcss.config.mjs             # Tailwind 4 (match personal-website)
├── tsconfig.json
├── package.json                   # next, react 19, dexie, serwist, etc.
└── docs/
    ├── PHASE2-Next15-migration-plan.md
    └── PHASE2-web-push.md
```

---

## Removed after migration

| Path / dependency | Reason |
|-------------------|--------|
| `vite.config.ts` | Replaced by `next.config.ts` |
| `index.html` | Next generates HTML from `app/layout.tsx` |
| `src/main.tsx` | No Vite entry point |
| `src/App.tsx` | Replaced by App Router |
| `src/pages/*` | Routes move to `app/` |
| `react-router-dom` | Replaced by App Router + `next/link` |
| `vite-plugin-pwa` | Replaced by Serwist or `@ducanh2912/next-pwa` |

---

## Route mapping (Vite → Next)

| Current (Vite) | Next App Router |
|----------------|-----------------|
| `src/pages/home-page.tsx` | `app/page.tsx` |
| `src/pages/log-meal-page.tsx` | `app/log/page.tsx` |
| `src/pages/history-page.tsx` | `app/history/page.tsx` |
| `src/components/layout.tsx` | `app/layout.tsx` + `src/components/layout-nav.tsx` |

---

## Client vs server boundaries

| Location | `"use client"` |
|----------|----------------|
| `app/page.tsx`, `app/log/page.tsx`, `app/history/page.tsx` | Yes |
| `src/hooks/*`, interactive `src/components/*` | Yes |
| `src/lib/schedule.ts`, `src/types/*`, repository interfaces | No |
| `src/db/dexie.ts`, `src/lib/reminder-service.ts` | Import only from client code |
| `app/api/push/*/route.ts` | Server (Route Handlers) |
