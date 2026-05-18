import { createContext, useContext, type ReactNode } from "react";
import { useActiveSchedule } from "@/hooks/use-active-schedule";

type ScheduleContextValue = ReturnType<typeof useActiveSchedule>;

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const value = useActiveSchedule();
  return (
    <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) {
    throw new Error("useSchedule must be used within ScheduleProvider");
  }
  return ctx;
}
