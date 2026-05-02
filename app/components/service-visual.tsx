import type { ReactNode } from "react";
import { LifeInsuranceAnimation } from "./animations/LifeInsuranceAnimation";
import { ServiceVideoPlayer } from "./service-video-player";

const VIDEO_BY_TITLE: Record<string, string> = {
  Hypotéky: "/animace/hypo.mp4",
  "Zajištění na důchod": "/animace/děda.mp4",
  Úvěry: "/animace/mone.mp4",
  "Neživotní pojištění": "/animace/zivo.mp4",
  Investice: "/animace/invs.mp4",
};

export function ServiceVisual({ title }: { title: string }) {
  const withFrame = (content: ReactNode) => (
    <div className="scene-svg">{content}</div>
  );

  if (title === "Životní pojištění") {
    return withFrame(<LifeInsuranceAnimation />);
  }

  const videoSrc = VIDEO_BY_TITLE[title];
  if (videoSrc) {
    return withFrame(
      <ServiceVideoPlayer
        src={videoSrc}
        playbackRate={title === "Hypotéky" ? 0.75 : 1}
      />,
    );
  }

  return withFrame(
    <svg viewBox="0 0 360 180" className="h-full w-full" aria-hidden>
      <rect x="0" y="0" width="360" height="180" rx="14" fill="#f4f4f5" />
      <path
        d="M180 42 L224 58 L224 106 L180 142 L136 106 L136 58 Z"
        fill="#6ee7b7"
      />
      <path
        d="M90 126 C122 114, 148 132, 180 126 C210 118, 240 130, 272 126"
        fill="none"
        stroke="#059669"
        strokeWidth="4"
      />
    </svg>,
  );
}
