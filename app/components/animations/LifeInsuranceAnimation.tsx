"use client";

import { motion } from "framer-motion";
import { ProductAnimationFrame, palette } from "./ProductAnimationFrame";

export function LifeInsuranceAnimation() {
  return (
    <ProductAnimationFrame label="Životní pojištění - rodina chráněná štítem">
      {({ reduced }) => (
        <>
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45 }}
          >
            <circle cx="152" cy="92" r="12" fill={palette.skin} />
            <rect x="141" y="104" width="22" height="34" rx="10" fill="#86A7D8" />

            <circle cx="190" cy="92" r="11" fill={palette.skin} />
            <rect x="180" y="103" width="20" height="35" rx="10" fill="#9DB6E2" />

            <circle cx="171" cy="100" r="8" fill="#c8daf2" />
            <rect x="164" y="108" width="14" height="24" rx="7" fill="#B9CAE9" />
          </motion.g>

          <motion.path
            d="M172 24 L244 50 L244 108 L172 154 L100 108 L100 50 Z"
            fill="none"
            stroke={palette.shield}
            strokeWidth="4"
            strokeLinejoin="round"
            initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0.8 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 1.15, delay: reduced ? 0 : 0.35, ease: "easeOut" }}
          />
          <motion.path
            d="M172 36 L232 57 L232 104 L172 142 L112 104 L112 57 Z"
            fill="#34d39933"
            stroke="#6ee7b766"
            initial={{ opacity: 0 }}
            animate={reduced ? { opacity: 0.8 } : { opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: reduced ? 0 : 2.1, repeat: reduced ? 0 : Infinity, delay: reduced ? 0 : 1.2 }}
          />

          <motion.path
            d="M164 73 C164 67, 170 65, 172 70 C174 65, 180 67, 180 73 C180 79, 172 84, 172 84 C172 84, 164 79, 164 73 Z"
            fill="#F09AB1"
            initial={{ scale: reduced ? 1 : 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.28, delay: reduced ? 0 : 1.1 }}
            style={{ originX: 0.48, originY: 0.42 }}
          />
        </>
      )}
    </ProductAnimationFrame>
  );
}
