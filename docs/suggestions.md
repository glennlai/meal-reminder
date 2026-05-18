Medium impact (polish & clarity)
5. Progressive onboarding instead of one big banner
OnboardingBanner is useful but long and always fights for attention until dismissed.

Split into steps:

First visit → short welcome + “Log your first meal”
After first log → notifications prompt
Only if not installed → Add to Home Screen (iOS-specific copy)
Keep technical limits (closed-tab behavior) in a “How reminders work” link, not the main hero.

6. History that feels purposeful
History is a flat list with no actions.

Recommendations:

Badge or pin the active meal at top (“Current timer”).
Empty state: CTA button to /log, not only text.
Optional later: swipe/delete or “Clear history” in settings.
7. Stronger loading and empty states
Loading is plain text (Loading…, Loading history…).

Recommendations:

Skeleton cards matching MealCard / countdown layout.
Empty home is already good; mirror that tone on history.
8. Visual feedback for timer urgency
Countdown uses text-5xl and amber text — good start.

Consider:

Progress ring or bar: elapsed % of interval (loggedAt → nextMealAt).
Gentle background shift as you enter the 1-hour reminder window (not only text color).
Update countdown every 1s only in the last 15 minutes; keep 10s or 30s earlier to save battery.
Lower priority (nice later)
Idea	Why
Dark mode	Matches system preference; easy win with CSS variables you already have in @theme.
Haptic on save	navigator.vibrate(10) on supported devices — satisfying “done” feeling.
FAB “Log meal” on home	Faster than nav; only if you don’t duplicate CTAs.
Relative labels	“Next meal in 2h 15m” + subtitle “around 6:30 PM” — you have both pieces already.
Confirm before leaving log with photo unsaved	Avoid losing a captured image.
Settings page