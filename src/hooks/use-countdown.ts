import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/schedule";

export function useCountdown(targetMs: number | null) {
  const [label, setLabel] = useState("—");
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (targetMs == null) {
      setLabel("—");
      setRemainingMs(0);
      return;
    }

    const update = () => {
      const remaining = targetMs - Date.now();
      setRemainingMs(remaining);
      setLabel(formatCountdown(remaining));
    };

    update();
    const id = window.setInterval(update, 10_000);
    return () => clearInterval(id);
  }, [targetMs]);

  return { label, remainingMs, isPast: remainingMs <= 0 };
}
