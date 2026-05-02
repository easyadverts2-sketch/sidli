"use client";

import { motion } from "framer-motion";
import { ProductAnimationFrame, palette } from "./ProductAnimationFrame";

export function MortgageAnimation() {
  return (
    <ProductAnimationFrame label="Hypotéky - postupná stavba domu">
      {({ reduced }) => (
        <>
          <line x1="36" y1="148" x2="332" y2="148" stroke="#7A689E" strokeDasharray="5 5" />

          <motion.rect
            x="130"
            y="126"
            width="104"
            height="22"
            rx="3"
            fill={palette.cream}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
          />
          <motion.rect
            x="138"
            y="103"
            width="88"
            height="23"
            rx="3"
            fill="#e8eef8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.32 }}
          />
          <motion.polygon
            points="126,103 182,72 238,103"
            fill={palette.coral}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 }}
          />
          <motion.rect
            x="234"
            y="130"
            width="34"
            height="18"
            rx="3"
            fill="#9ab8e8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.88 }}
          />
          <motion.rect
            x="168"
            y="113"
            width="14"
            height="13"
            rx="2"
            fill="#8FBDE5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 1.02 }}
          />
          <motion.rect
            x="191"
            y="113"
            width="14"
            height="13"
            rx="2"
            fill="#8FBDE5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 1.1 }}
          />
          <motion.rect
            x="147"
            y="125"
            width="16"
            height="23"
            rx="2"
            fill="#8F6D63"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 1.18 }}
          />

          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.28, delay: reduced ? 0 : 1.08 }}
          >
            <rect x="104" y="124" width="8" height="24" fill="#4a6288" />
            <circle cx="108" cy="115" r="16" fill={palette.mint} />
          </motion.g>
          <motion.g
            initial={{ opacity: 0, x: -10 }}
            animate={reduced ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 1.28 }}
          >
            <ellipse cx="78" cy="141" rx="16" ry="8" fill="#a8bdd8" />
            <circle cx="60" cy="138" r="7" fill="#a8bdd8" />
            <polygon points="55,132 58,126 63,132" fill="#a8bdd8" />
            <polygon points="62,132 66,126 70,132" fill="#a8bdd8" />
            <line x1="94" y1="138" x2="104" y2="132" stroke="#a8bdd8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="58" cy="139" r="1.1" fill="#2E203F" />
          </motion.g>
        </>
      )}
    </ProductAnimationFrame>
  );
}
