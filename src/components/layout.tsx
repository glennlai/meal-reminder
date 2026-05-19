import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ScheduleProvider } from "@/context/schedule-provider";

function LayoutShell() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]"
      onClick={() => setOpen(false)}
    >
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-brand-50"
          >
            <h1 className="text-2xl font-bold tracking-tight text-brand-900">
              Meal Reminder
            </h1>

            {/* subtle affordance */}
            <span className="ml-1 text-sm text-brand-400 opacity-0 transition group-hover:opacity-100">
              ↗
            </span>
          </Link>

          <div
            className="flex items-center gap-2 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              to="/meal-reminder/add"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white shadow-sm transition hover:scale-105 hover:bg-brand-700"
            >
              +
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-brand-900 transition hover:bg-brand-100 active:scale-95"
            >
              ⋮
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-12 z-50 w-40 rounded-xl border border-brand-200 bg-white shadow-lg">

                <Link
                  to="/meal-reminder/history"
                  className="block px-4 py-3 text-sm hover:bg-brand-50"
                  onClick={() => setOpen(false)}
                >
                  History
                </Link>

                <Link
                  to="/project/settings"
                  className="block px-4 py-3 text-sm hover:bg-brand-50"
                  onClick={() => setOpen(false)}
                >
                  Settings
                </Link>

                <Link
                  to="/project/account"
                  className="block px-4 py-3 text-sm hover:bg-brand-50"
                  onClick={() => setOpen(false)}
                >
                  Account
                </Link>

              </div>
            )}
          </div>
        </div>

        <p className="mt-1 text-sm text-brand-700/80">
          Log meals, count down to the next one
        </p>

      </header>

      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>

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
