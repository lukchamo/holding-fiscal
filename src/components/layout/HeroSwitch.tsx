import Link from "next/link";
import { HERO_VARIANTS } from "@/content/site";
import s from "./HeroSwitch.module.css";

/** Selector flotante para comparar las tres portadas durante la revisión. */
export function HeroSwitch({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav className={s.pill} aria-label="Variantes de portada">
      <span className={s.label}>Portada</span>
      {HERO_VARIANTS.map((v) => (
        <Link key={v.href} href={v.href} aria-current={v.n === current ? "page" : undefined} aria-label={`Portada ${v.n}: ${v.label}`} title={`${v.label}. ${v.hint}`}>
          {v.n}
        </Link>
      ))}
    </nav>
  );
}
