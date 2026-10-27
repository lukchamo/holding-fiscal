"use client";

import { useState } from "react";
import { NAV_LINKS } from "@/content/site";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useBrand } from "@/components/brand/BrandProvider";
import { useStart } from "@/components/start/StartProvider";
import { ThemeToggle } from "./ThemeToggle";
import s from "./SiteNav.module.css";

export function SiteNav({ tone = "paper" }: { tone?: "paper" | "night" }) {
  const [open, setOpen] = useState(false);
  const { brand } = useBrand();
  const { focusStart } = useStart();

  return (
    <div className={`wrap ${s.bar}`} data-tone={tone}>
      <nav className={s.top} aria-label="Principal">
        <a className={s.logo} href="#inicio" aria-label={`${brand.name}, ir al inicio`}>
          <BrandLogo size={30} withWord replayOnHover />
        </a>
        <div className={s.right}>
          <div className={`${s.links} ${open ? s.open : ""}`} id="navLinks">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </div>
          <ThemeToggle />
          <a
            className={`btn btn-dark ${s.cta}`}
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              focusStart();
            }}
          >
            Empieza gratis
          </a>
          <button
            type="button"
            className={`${s.round} ${s.menu}`}
            aria-expanded={open}
            aria-controls="navLinks"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
