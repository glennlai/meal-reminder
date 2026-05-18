import { Link, Outlet, useLocation } from "react-router-dom";
import { ScheduleProvider, useSchedule } from "@/context/schedule-provider";

const nav = [
  { to: "/", label: "Home" },
  { to: "/log", label: "Log meal" },
  { to: "/history", label: "History" },
];

function LayoutShell() {
  const { pathname } = useLocation();
  const { schedule } = useSchedule();
  const hasActiveTimer = !!schedule;

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-brand-900">
          Meal Reminder
        </h1>
        <p className="mt-1 text-sm text-brand-700/80">
          Log meals, count down to the next one
        </p>
      </header>

      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-brand-50/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
        aria-label="Main"
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2 p-3">
          {nav.map((item) => {
            const active = pathname === item.to;
            const showTimerDot = item.to === "/" && hasActiveTimer && !active;

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`interactive-focus relative rounded-xl px-2 py-2.5 text-center text-sm font-medium transition ${
                  active
                    ? "interactive-focus-inverse bg-brand-700 text-white"
                    : "bg-white text-brand-800 shadow-sm ring-1 ring-brand-100 hover:bg-brand-50"
                }`}
              >
                {item.label}
                {showTimerDot && (
                  <span
                    className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white"
                    aria-label="Active meal timer"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function Layout() {
  return (
    <ScheduleProvider>
      <LayoutShell />
    </ScheduleProvider>
  );
}
