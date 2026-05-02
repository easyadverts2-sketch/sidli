"use client";

import { useEffect, useRef } from "react";

type ServiceVideoPlayerProps = {
  src: string;
  playbackRate?: number;
};

export function ServiceVideoPlayer({
  src,
  playbackRate = 1,
}: ServiceVideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.playbackRate = playbackRate;

    const tryPlay = () => {
      el.playbackRate = playbackRate;
      void el.play().catch(() => {
        /* autoplay policy / decode — zkusíme znovu po načtení */
      });
    };

    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    tryPlay();

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
    };
  }, [src, playbackRate]);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover bg-[#f4f4f5]"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
