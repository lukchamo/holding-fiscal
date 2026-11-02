"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LogoMark } from "@/components/brand/LogoMark";
import { useBrand } from "@/components/brand/BrandProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AdvisorPortrait, FounderPortrait, LawyerPortrait } from "@/components/sections/Portraits";
import { AGENTS, TEAM } from "@/content/data";
import { ALERTS, COMPANIES, GROUP, USER } from "./dashData";
import { Icon, type IconName } from "./Icons";
import s from "./shell.module.css";

export type DesignKey = "hoy" | "panel" | "calendario";

export const DESIGNS: readonly { key: DesignKey; tag: string; label: string; href: string }[] = [
  { key: "hoy", tag: "A", label: "Hoy", href: "/design/hoy" },
  { key: "panel", tag: "B", label: "Panel", href: "/design/panel" },
  { key: "calendario", tag: "C", label: "Calendario", href: "/design/calendario" },
];

const NAV: readonly { icon: IconName; label: string; badge?: number }[] = [
  { icon: "home", label: "Inicio" },
  { icon: "inbox", label: "Bandeja", badge: 3 },
  { icon: "calendar", label: "Calendario" },
  { icon: "file", label: "Documentos" },
  { icon: "receipt", label: "Facturas" },
  { icon: "euro", label: "Ayudas" },
  { icon: "building", label: "Sociedades" },
];

const TABS: readonly { icon: IconName; label: string }[] = [
  { icon: "home", label: "Inicio" },
  { icon: "inbox", label: "Bandeja" },
  { icon: "calendar", label: "Calendario" },
  { icon: "file", label: "Documentos" },
  { icon: "users", label: "Equipo" },
];

/** Cierra un desplegable al pulsar fuera o con Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

function GroupSwitch() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div ref={ref} className={s.group}>
      <button type="button" className={s.groupBtn} aria-expanded={open} aria-controls="grupo-lista" onClick={() => setOpen((o) => !o)}>
        <span className={s.groupMono} aria-hidden="true">
          GA
        </span>
        <span className={s.groupText}>
          <b>{GROUP}</b>
          <small>{COMPANIES.length} sociedades</small>
        </span>
        <Icon name="chevron" size={16} className={s.groupChev} />
      </button>
      {open ? (
        <ul id="grupo-lista" className={s.groupList}>
          {COMPANIES.map((c) => (
            <li key={c.key}>
              <i style={{ background: c.color }} aria-hidden="true" />
              <span>
                {c.name}
                {c.note ? <small>{c.note}</small> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Bell() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div ref={ref} className={s.bellWrap}>
      <button type="button" className={s.iconBtn} aria-expanded={open} aria-controls="avisos" aria-label={`Avisos: ${ALERTS.length} nuevos`} onClick={() => setOpen((o) => !o)}>
        <Icon name="bell" />
        <span className={s.badge} aria-hidden="true">
          {ALERTS.length}
        </span>
      </button>
      {open ? (
        <div id="avisos" className={s.popover}>
          <p className={s.popTitle}>Avisos</p>
          <ul>
            {ALERTS.map((a) => (
              <li key={a.title} data-level={a.level}>
                <Icon name={a.level === "attention" ? "alert" : "info"} size={18} />
                <span>
                  <b>{a.title}</b>
                  {a.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Armazón de la app (el mismo en las tres alternativas): barra lateral con el
 * grupo, la navegación y el equipo; barra superior con búsqueda, avisos y tu
 * perfil. En el móvil, la navegación baja a una barra inferior.
 */
export function AppShell({ current, children }: { current: DesignKey; children: ReactNode }) {
  const { brand } = useBrand();
  return (
    <div className={s.app}>
      <aside className={s.side} aria-label="Navegación de la app">
        <div className={s.logo}>
          <span className={s.logoFull}>
            <BrandLogo size={26} withWord />
          </span>
          <span className={s.logoMark}>
            <LogoMark brand={brand.key} size={26} title={brand.name} />
          </span>
        </div>

        <GroupSwitch />

        <nav aria-label="Secciones">
          <ul className={s.nav}>
            {NAV.map((n) => {
              const on = n.label === "Inicio";
              return (
                <li key={n.label}>
                  {on ? (
                    <a href={`/design/${current}`} className={s.navItem} aria-current="page">
                      <Icon name={n.icon} />
                      <span className={s.navLabel}>{n.label}</span>
                    </a>
                  ) : (
                    <span className={s.navItem} title="En el prototipo solo está la pantalla de inicio">
                      <Icon name={n.icon} />
                      <span className={s.navLabel}>{n.label}</span>
                      {n.badge ? (
                        <span className={s.navBadge}>
                          {n.badge}
                          <span className="visually-hidden"> pendientes</span>
                        </span>
                      ) : null}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={s.team}>
          <p className={s.teamTitle}>Tu equipo</p>
          <ul className={s.people}>
            <li>
              <span className={s.face} aria-hidden="true">
                <LawyerPortrait label="" />
              </span>
              <span className={s.personText}>
                <b>{TEAM.abogada.name}</b>
                <small>
                  <i data-status="on" aria-hidden="true" /> Disponible
                </small>
              </span>
            </li>
            <li>
              <span className={s.face} aria-hidden="true">
                <AdvisorPortrait label="" />
              </span>
              <span className={s.personText}>
                <b>{TEAM.gestor.name}</b>
                <small>
                  <i data-status="busy" aria-hidden="true" /> En una reunión
                </small>
              </span>
            </li>
          </ul>
          <ul className={s.agents} aria-label="Agentes">
            {AGENTS.map((a) => (
              <li key={a.name} style={{ "--c": a.color } as CSSProperties} title={`${a.name} · ${a.role}`}>
                <span aria-hidden="true">{a.initial}</span>
                <span className="visually-hidden">
                  {a.name}, {a.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className={s.main}>
        <header className={s.top}>
          <div className={s.topBrand}>
            <LogoMark brand={brand.key} size={24} title={brand.name} />
            <b>{GROUP}</b>
          </div>
          <div className={s.search}>
            <Icon name="search" size={18} />
            <label htmlFor="dash-search" className="visually-hidden">
              Buscar
            </label>
            <input id="dash-search" type="search" placeholder="Busca facturas, plazos o documentos" autoComplete="off" />
            <kbd>⌘K</kbd>
          </div>
          <div className={s.topActions}>
            <ThemeToggle />
            <Bell />
            <span className={s.me} title={USER.name}>
              <FounderPortrait label={USER.name} />
            </span>
          </div>
        </header>

        <div className={s.content}>{children}</div>
      </div>

      <nav className={s.tabbar} aria-label="Secciones">
        {TABS.map((t) => (
          <span key={t.label} className={s.tab} aria-current={t.label === "Inicio" ? "page" : undefined}>
            <Icon name={t.icon} size={22} />
            {t.label}
          </span>
        ))}
      </nav>

      <DesignSwitch current={current} />
    </div>
  );
}

/** Selector flotante para comparar las tres alternativas (solo para la revisión). */
export function DesignSwitch({ current }: { current: DesignKey }) {
  return (
    <nav className={s.switch} aria-label="Alternativas de diseño">
      <Link href="/design" className={s.switchBack} prefetch={false}>
        <span aria-hidden="true">←</span>
        <span className={s.switchBackText}>Alternativas</span>
      </Link>
      {DESIGNS.map((d) => (
        <Link key={d.key} href={d.href} prefetch={false} className={s.switchItem} aria-current={d.key === current ? "page" : undefined}>
          <b>{d.tag}</b>
          <span>{d.label}</span>
        </Link>
      ))}
    </nav>
  );
}
