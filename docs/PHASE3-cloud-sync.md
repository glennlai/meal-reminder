# Phase 3 — Cloud sync (deferred)

Full backup and multi-device support.

## Outline

1. Auth (passkeys or magic link).
2. `CloudMealRepository` implementing `MealRepository`.
3. `SyncMealRepository` — write-through local, background upload, pull on login.
4. Photo storage (S3/R2) with metadata in Postgres/Supabase.
5. Active schedule conflict: latest device wins.

See `src/repositories/meal-repository.ts` for the interface to implement.
