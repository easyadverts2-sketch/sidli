"use client";

import { motion } from "framer-motion";
import { ProductAnimationFrame, palette } from "./ProductAnimationFrame";

const coinX = [152, 170, 188, 160, 180];
const billX = [158, 184, 172];

export function LoanAnimation() {
  return (
    <ProductAnimationFrame label="Úvěry - peníze padají do dlaní">
      {({ reduced }) => (
        <>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.4 }}>
            <path d="M100 122 Q136 114 166 136 Q130 148 92 138 Z" fill={palette.skin} stroke={palette.lineSoft} />
            <path d="M260 122 Q224 114 194 136 Q230 148 268 138 Z" fill={palette.skin} stroke={palette.lineSoft} />
            <rect x="153" y="124" width="34" height="16" rx="7" fill={palette.skin} stroke={palette.lineSoft} />
            <rect x="109" y="128" width="8" height="12" rx="4" fill={palette.skin} />
            <rect x="121" y="128" width="8" height="12" rx="4" fill={palette.skin} />
            <rect x="233" y="128" width="8" height="12" rx="4" fill={palette.skin} />
            <rect x="245" y="128" width="8" height="12" rx="4" fill={palette.skin} />
          </motion.g>

          <motion.ellipse
            cx="170"
            cy="131"
            rx="17"
            ry="6.5"
            fill={palette.coin}
            initial={{ scale: reduced ? 1 : 0.6, opacity: 0.4 }}
            animate={reduced ? { scale: 1 } : { scale: [0.6, 1.15, 1.35], opacity: [0.4, 0.7, 0.9] }}
            transition={{ duration: reduced ? 0 : 1.7, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
          />

          {billX.map((x, index) => (
            <motion.g
              key={`bill-${x}-${index}`}
              initial={{ y: 0, opacity: 0, rotate: -10 }}
              animate={
                reduced
                  ? { y: 72, opacity: 0.8, rotate: 0 }
                  : { y: [0, 34, 72], opacity: [0, 1, 0], rotate: [-10, 8, -2] }
              }
              transition={{
                duration: reduced ? 0 : 2,
                repeat: reduced ? 0 : Infinity,
                delay: reduced ? 0 : index * 0.45,
                ease: "easeIn",
              }}
              transform={`translate(${x} 26)`}
            >
              <rect x="-10" y="-6" width="20" height="12" rx="2" fill={palette.money} />
              <circle cx="0" cy="0" r="2.2" fill="#5CA367" />
            </motion.g>
          ))}

          {coinX.map((x, index) => (
            <motion.g
              key={`${x}-${index}`}
              initial={{ y: 0, opacity: 0 }}
              animate={
                reduced
                  ? { y: 84, opacity: 0.7 }
                  : {
                      y: [0, 42, 84],
                      opacity: [0, 1, 0],
                      rotate: [-8, 8, -4],
                    }
              }
              transition={{
                duration: reduced ? 0 : 1.45,
                repeat: reduced ? 0 : Infinity,
                delay: reduced ? 0 : index * 0.22,
                ease: "easeIn",
              }}
              transform={`translate(${x} 26)`}
            >
              <circle cx="0" cy="0" r="6" fill={palette.coin} />
              <circle cx="0" cy="0" r="3.2" fill="#E1A643" />
            </motion.g>
          ))}
        </>
      )}
    </ProductAnimationFrame>
  );
}
