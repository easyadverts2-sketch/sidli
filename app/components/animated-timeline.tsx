"use client";

import { useEffect, useRef, useState } from "react";

type TimelineStep = {
  icon: string;
  title: string;
  text: string;
};

type AnimatedTimelineProps = {
  steps: TimelineStep[];
};

function TimelineItem({
  step,
  index,
}: {
  step: TimelineStep;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.32 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`timeline-item ${visible ? "is-visible" : ""} ${index % 2 ? "right" : "left"}`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <span className="timeline-icon">{step.icon}</span>
      <div className="timeline-content">
        <h3>{step.title}</h3>
        <p
          className={`timeline-type ${visible ? "typed" : ""}`}
          style={{ animationDelay: `${index * 180 + 180}ms` }}
        >
          {step.text}
        </p>
      </div>
    </article>
  );
}

export function AnimatedTimeline({ steps }: AnimatedTimelineProps) {
  return (
    <div className="timeline-vertical">
      {steps.map((step, index) => (
        <TimelineItem key={step.title} step={step} index={index} />
      ))}
    </div>
  );
}
