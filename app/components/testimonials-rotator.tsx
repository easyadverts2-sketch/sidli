"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Testimonial = {
  name: string;
  profession: string;
  avatar: string;
  quote: string;
};

type TestimonialsRotatorProps = {
  testimonials: Testimonial[];
};

export function TestimonialsRotator({ testimonials }: TestimonialsRotatorProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const active = testimonials[index];
  const previous = () => {
    setIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setIndex((current) => (current + 1) % testimonials.length);
  };

  return (
    <div className="reference-content">
      <p className="text-xs font-semibold tracking-[0.22em] uppercase text-primary">
        Co o mně říkají
      </p>
      <h3 className="mt-2 mb-14 text-4xl font-bold text-foreground sm:text-5xl md:mb-20">
        Reference klientů
      </h3>
      <div className="reference-layout">
        <button type="button" className="reference-arrow" onClick={previous} aria-label="Předchozí reference">
          ‹
        </button>
        <div className="text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name + active.quote}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center gap-4">
                <Image
                  src={active.avatar}
                  alt={active.name}
                  className="h-16 w-16 rounded-full object-cover border border-primary/35"
                  width={64}
                  height={64}
                />
                <div className="text-left">
                  <p className="text-2xl font-semibold text-zinc-900">{active.name}</p>
                  <p className="text-sm font-medium tracking-wide uppercase text-emerald-800">
                    {active.profession}
                  </p>
                </div>
              </div>
              <p className="mb-5 text-left text-xl leading-relaxed text-muted sm:text-2xl md:text-3xl">
                &quot;{active.quote}&quot;
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <button type="button" className="reference-arrow" onClick={next} aria-label="Další reference">
          ›
        </button>
      </div>
      <div className="mt-10 flex justify-center gap-2">
        {testimonials.map((item, itemIndex) => (
          <button
            key={`${item.name}-${itemIndex}`}
            type="button"
            className={`h-2.5 w-2.5 rounded-full ${
              itemIndex === index ? "bg-primary" : "bg-primary/35"
            }`}
            onClick={() => setIndex(itemIndex)}
            aria-label={`Zobrazit referenci ${itemIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
