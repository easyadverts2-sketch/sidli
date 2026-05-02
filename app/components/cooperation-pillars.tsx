"use client";

import { useEffect, useRef, useState } from "react";

type Pillar = {
  title: string;
  description: string;
  icon: string;
};

type CooperationPillarsProps = {
  pillars: Pillar[];
};

export function CooperationPillars({ pillars }: CooperationPillarsProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShow(true), 380);
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="cooperation-graphics">
      {pillars.map((pillar, index) => (
        <article
          key={`${pillar.title}-${index}`}
          className={`cooperation-graphic ${
            index === 1 ? "cooperation-graphic-center" : "cooperation-graphic-side"
          } ${show ? "show" : ""}`}
          style={{ animationDelay: `${index * 180}ms` }}
        >
          <span className="cooperation-graphic-icon">{pillar.icon}</span>
          <h3>{pillar.title}</h3>
          <p className={show ? "typed" : ""} style={{ animationDelay: `${index * 260 + 240}ms` }}>
            {pillar.description}
          </p>
        </article>
      ))}
    </div>
  );
}
