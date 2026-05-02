"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

type StatCountersProps = {
  stats: Stat[];
};

function Counter({ value, suffix, label }: Stat) {
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1100;
    const stepMs = 22;
    const increments = duration / stepMs;
    const delta = value / increments;
    let n = 0;
    const timer = setInterval(() => {
      n += delta;
      if (n >= value) {
        setCurrent(value);
        clearInterval(timer);
        return;
      }
      setCurrent(Math.floor(n));
    }, stepMs);
    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <article ref={ref} className="text-center">
      <p className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
        {current}
        {suffix}
      </p>
      <p className="mt-1 text-xl text-muted md:text-2xl">{label}</p>
    </article>
  );
}

export function StatCounters({ stats }: StatCountersProps) {
  return (
    <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
      {stats.map((item) => (
        <Counter key={item.label} {...item} />
      ))}
    </div>
  );
}
