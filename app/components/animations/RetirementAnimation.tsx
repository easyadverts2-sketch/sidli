"use client";

import { motion } from "framer-motion";
import { ProductAnimationFrame, palette } from "./ProductAnimationFrame";

export function RetirementAnimation() {
  return (
    <ProductAnimationFrame label="Zajištění na důchod - dědeček v křesle s pivem">
      {({ reduced }) => (
        <>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.45 }}>
            <rect x="248" y="76" width="72" height="56" rx="4" fill={palette.cream} />
            <polygon points="238,76 284,50 330,76" fill={palette.coral} />
            <rect x="278" y="94" width="12" height="38" fill="#5a6d8a" />
          </motion.g>

          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.35 }}
          >
            <rect x="122" y="98" width="104" height="36" rx="10" fill="#3d5a78" />
            <rect x="190" y="68" width="28" height="50" rx="8" fill="#3d5a78" />
            <rect x="108" y="90" width="18" height="34" rx="8" fill="#3d5a78" />

            <circle cx="138" cy="58" r="14" fill="#d4e4f4" />
            <path d="M128 51 Q138 44 148 51" fill="none" stroke="#D9DFEA" strokeWidth="4" strokeLinecap="round" />
            <rect x="124" y="72" width="28" height="34" rx="12" fill="#93A4D1" />
            <rect x="145" y="83" width="24" height="8" rx="4" fill="#d4e4f4" />
            <rect x="126" y="100" width="24" height="8" rx="4" fill="#4D4363" />
            <rect x="145" y="100" width="24" height="8" rx="4" fill="#4D4363" />
            <circle cx="133" cy="58" r="1.8" fill="#2A1D48" />
            <circle cx="142" cy="58" r="1.8" fill="#2A1D48" />
            <path d="M131 65 Q138 70 145 65" fill="none" stroke="#6b7d9e" strokeWidth="1.8" strokeLinecap="round" />
          </motion.g>

          <motion.g
            initial={{ opacity: 0, rotate: 15, x: -4 }}
            animate={reduced ? { opacity: 1, rotate: -3, x: 0 } : { opacity: 1, rotate: [-6, 4, -6], x: [0, 4, 0] }}
            transition={{ duration: reduced ? 0 : 2.2, delay: reduced ? 0 : 0.9, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
            style={{ originX: 0.43, originY: 0.7 }}
          >
            <rect x="168" y="73" width="11" height="25" rx="2.5" fill="#4a7cba" />
            <rect x="166" y="62" width="15" height="13" rx="2.5" fill="#6ee7b7" />
            <rect x="167" y="59" width="13" height="4" rx="2" fill="#F1F4F8" />
          </motion.g>
        </>
      )}
    </ProductAnimationFrame>
  );
}
