"use client";

import { motion } from "framer-motion";
import { ProductAnimationFrame, palette } from "./ProductAnimationFrame";

const drops = [
  { x: 112, delay: 0 },
  { x: 132, delay: 0.18 },
  { x: 152, delay: 0.32 },
  { x: 196, delay: 0.09 },
  { x: 218, delay: 0.26 },
  { x: 240, delay: 0.44 },
];

export function PropertyInsuranceAnimation() {
  return (
    <ProductAnimationFrame label="Neživotní pojištění - deštník chrání dům a auto před deštěm">
      {({ reduced }) => (
        <>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.45 }}>
            <rect x="102" y="104" width="84" height="44" rx="4" fill={palette.cream} />
            <polygon points="90,104 144,70 198,104" fill={palette.coral} />
            <rect x="136" y="120" width="16" height="28" fill="#647896" />
            <rect x="116" y="116" width="14" height="12" rx="2" fill="#8FBDE5" />

            <rect x="192" y="120" width="110" height="26" rx="12" fill={palette.sky} />
            <rect x="210" y="108" width="52" height="15" rx="6" fill="#B8E7F8" />
            <circle cx="218" cy="148" r="9" fill="#2D2D42" />
            <circle cx="274" cy="148" r="9" fill="#2D2D42" />
          </motion.g>

          <motion.g
            initial={{ opacity: 0, scaleY: 0.6 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.35 }}
            style={{ originY: 0.5 }}
          >
            <path d="M96 82 Q176 20 256 82 Z" fill={palette.coral} />
            <path d="M176 82 L176 126" stroke="#EDE8F8" strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.5 }}
          >
            <ellipse cx="176" cy="40" rx="62" ry="18" fill="#665586" />
            <ellipse cx="136" cy="40" rx="26" ry="14" fill="#7A6A99" />
            <ellipse cx="220" cy="38" rx="26" ry="14" fill="#7A6A99" />
          </motion.g>

          <g>
            {drops.map((drop, index) => (
              <motion.line
                key={`${drop.x}-${index}`}
                x1={drop.x}
                y1="52"
                x2={drop.x - 3}
                y2="67"
                stroke="#D9E9FF"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={
                  reduced
                    ? { opacity: 0.45 }
                    : {
                        opacity: [0, 1, 0],
                        y: [0, 28, 28],
                      }
                }
                transition={{
                  duration: reduced ? 0 : 1.2,
                  repeat: reduced ? 0 : Infinity,
                  delay: reduced ? 0 : drop.delay,
                  ease: "easeIn",
                }}
              />
            ))}
          </g>
        </>
      )}
    </ProductAnimationFrame>
  );
}
