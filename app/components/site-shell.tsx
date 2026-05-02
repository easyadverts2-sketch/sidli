"use client";

import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { navItems } from "../lib/content";

type SiteShellProps = {
  children: React.ReactNode;
};

const liteLogoFont = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  style: ["italic"],
  display: "swap",
});

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <header className="top-header fixed top-0 right-0 left-0 z-50">
        <div className="container-page flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <Link
              href="#uvod"
              className={`site-logo ${liteLogoFont.className} text-3xl text-foreground`}
            >
              Finance Šidlichovský
            </Link>
          </div>
          <nav className="top-nav hidden gap-4 text-base text-muted md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="top-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-20 border-t border-white/[0.08] bg-[#0c0c0e]">
        <div className="container-page py-10 text-sm text-[#a1a1aa]">
          <p>© 2026 Finance Šidlichovský. Všechna práva vyhrazena.</p>
          <p className="mt-2">
            Finanční poradenství, investice, pojištění a úvěry na míru klientům v celé ČR.
          </p>
          <p className="mt-3">
            Instagram:{" "}
            <a
              href="https://www.instagram.com/finance.sidlichovsky?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-[var(--primary-deep)]"
            >
              @finance.sidlichovsky
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
