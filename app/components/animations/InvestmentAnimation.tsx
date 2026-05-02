"use client";

import { motion } from "framer-motion";
import { ProductAnimationFrame, palette } from "./ProductAnimationFrame";

const linePath =
  "M50 140 C78 126, 100 128, 128 112 C150 98, 170 104, 198 84 C222 68, 244 76, 268 58 C286 44, 304 48, 324 34";

export function InvestmentAnimation() {
  return (
    <ProductAnimationFrame label="Investice - růst indexu S&P 500">
      {({ reduced }) => (
        <>
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.55 }}
          >
            {[...Array(7)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="40"
                y1={24 + i * 20}
                x2="338"
                y2={24 + i * 20}
                stroke={palette.lineSoft}
                strokeOpacity="0.34"
              />
            ))}
            {[...Array(9)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={48 + i * 32}
                y1="18"
                x2={48 + i * 32}
                y2="154"
                stroke={palette.lineSoft}
                strokeOpacity="0.24"
              />
            ))}
            <line x1="42" y1="152" x2="338" y2="152" stroke={palette.lineSoft} strokeWidth="2" />
            <line x1="42" y1="16" x2="42" y2="152" stroke={palette.lineSoft} strokeWidth="2" />
          </motion.g>

          <motion.path
            d={linePath}
            fill="none"
            stroke={palette.orange}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 1.4, ease: "easeOut", delay: reduced ? 0 : 0.35 }}
          />

          <motion.circle
            cx="324"
            cy="34"
            r="5.5"
            fill="#f4f4f5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 1.55 }}
          />
          <motion.g
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 1.65 }}
          >
            <rect x="218" y="12" width="110" height="22" rx="8" fill="#27272a" stroke={palette.orange} />
            <text x="227" y="27" fill="#f4f4f5" fontSize="11" fontFamily="sans-serif">
              S&amp;P 500 +4.2%
            </text>
          </motion.g>
        </>
      )}
    </ProductAnimationFrame>
  );
}
