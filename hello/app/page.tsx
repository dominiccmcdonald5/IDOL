"use client";

import { useEffect, useState } from "react";

const COUNTER_LIMIT = 3600;
const MESSAGE_DURATION = 5;

function readPositiveInt(value: string | null, fallback: number) {
  const parsedValue = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function readTimerConfig() {
  if (typeof window === "undefined") {
    return {
      counterLimit: COUNTER_LIMIT,
      tickMs: 1000,
      initialTick: 0,
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const counterLimit = readPositiveInt(searchParams.get("limit"), COUNTER_LIMIT);
  const tickMs = readPositiveInt(searchParams.get("tickMs"), 1000);
  const cycleLength = counterLimit + MESSAGE_DURATION;
  const initialTick = Math.min(
    readPositiveInt(searchParams.get("startAt"), 0),
    cycleLength - 1,
  );

  return {
    counterLimit,
    tickMs,
    initialTick,
  };
}

export default function Home() {
  const [{ counterLimit, initialTick, tickMs }] = useState(readTimerConfig);
  const [tick, setTick] = useState(initialTick);

  useEffect(() => {
    const cycleLength = counterLimit + MESSAGE_DURATION;
    const interval = window.setInterval(() => {
      setTick((currentTick) => (currentTick + 1) % cycleLength);
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [counterLimit, tickMs]);

  const showMessage = tick >= counterLimit;
  const counterValue = Math.min(tick, counterLimit);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p>There might be something here, Patience is key</p>
      <p>{counterValue}</p>
      {showMessage ? <p>Ping me with a SS before its too late</p> : null}
    </main>
  );
}
