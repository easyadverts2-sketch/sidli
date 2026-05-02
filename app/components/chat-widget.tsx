"use client";

import { siteConfig } from "../lib/content";

export function ChatWidget() {
  return (
    <a
      href={siteConfig.chatUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed right-5 bottom-5 z-50 block rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_12px_40px_rgba(24,24,27,0.12)]"
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${
            siteConfig.chatOnline ? "bg-[#43dd76]" : "bg-[#a5afc3]"
          }`}
        />
        <div>
          <p className="text-sm font-semibold text-foreground">Chat s poradcem</p>
          <p className="text-xs text-muted">
            {siteConfig.chatOnline
              ? `${siteConfig.advisorName} je online`
              : `${siteConfig.advisorName} je offline`}
          </p>
        </div>
      </div>
    </a>
  );
}
