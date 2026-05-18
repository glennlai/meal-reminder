# Meal Reminder

Local-first PWA to photograph meals, set hours until your next meal, and get a reminder one hour before.

## Features

- Capture or pick a meal photo
- Set hours until next meal (0.25–24, decimals allowed)
- Live countdown on the home screen
- Notifications when the app is open, resumed, or reopened in the reminder window
- Meal history stored in IndexedDB on your device

## Development

This project uses **pnpm** (`packageManager` in `package.json`). Use one of the setups below.

### Option A — pnpm via Corepack (recommended)

Node 16.13+ ships with Corepack. If `pnpm` is not found, enable it:

```bash
sudo corepack enable
corepack prepare pnpm@10.11.0 --activate
```

Then:

```bash
cd meal-reminder
pnpm install
pnpm dev
```

If you cannot use `sudo`, run pnpm through Corepack without a global symlink:

```bash
corepack pnpm install
corepack pnpm dev
```

### Option B — Homebrew

```bash
brew install pnpm
pnpm install
pnpm dev
```

### Option C — npm

```bash
npm install
npm run dev
```

### Other scripts

```bash
pnpm build    # or: npm run build
pnpm preview
pnpm test
```

## Notifications

Browsers cannot reliably fire scheduled notifications when the PWA is fully closed. This app uses:

1. In-app countdown and status banners
2. Catch-up checks when you reopen the app
3. Service worker polling while the app was recently active

For dependable closed-app alerts, see Phase 2 in `PLAN.md` (Web Push backend).

### iOS

Install via Safari → Share → **Add to Home Screen**, then allow notifications when prompted.

## Project structure

- `src/lib/schedule.ts` — time calculations
- `src/lib/reminder-service.ts` — notification helpers
- `src/repositories/` — data access (cloud-ready interface)
- `src/sw.ts` — service worker (precache + notification click)
