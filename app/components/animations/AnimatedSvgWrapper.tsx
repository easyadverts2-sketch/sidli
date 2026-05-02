"use client";

import { useReducedMotion } from "framer-motion";

type AnimatedSvgWrapperProps = {
  children: (opts: { reduced: boolean }) => React.ReactNode;
};

export function AnimatedSvgWrapper({ children }: AnimatedSvgWrapperProps) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label="Produktová animace">
      {children({ reduced: Boolean(reduced) })}
    </svg>
  );
}
