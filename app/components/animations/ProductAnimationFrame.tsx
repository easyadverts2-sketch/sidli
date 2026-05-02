"use client";

import { useReducedMotion } from "framer-motion";

type ProductAnimationFrameProps = {
  label: string;
  children: (opts: { reduced: boolean }) => React.ReactNode;
};

export const palette = {
  scene: "#e4e4e7",
  sceneSoft: "#f4f4f5",
  lineSoft: "#a1a1aa",
  cream: "#ffffff",
  coral: "#34d399",
  orange: "#059669",
  mint: "#6ee7b7",
  sky: "#ccfbf1",
  money: "#10b981",
  coin: "#fde68a",
  skin: "#e4e4e7",
  shield: "#34d399",
};

export function ProductAnimationFrame({ label, children }: ProductAnimationFrameProps) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id="sceneGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.sceneSoft} />
          <stop offset="100%" stopColor={palette.scene} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="180" rx="14" fill="url(#sceneGradient)" />
      {children({ reduced: Boolean(reduced) })}
    </svg>
  );
}
