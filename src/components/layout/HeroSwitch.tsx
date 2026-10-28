import Link from "next/link";
import { HERO_VARIANTS, type HeroVariant } from "@/content/site";
import s from "./HeroSwitch.module.css";

/** Selector flotante para comparar las portadas durante la revisión. */
export function HeroSwitch({ current }: { current: HeroVariant }) {
  return (
    <nav className={s.pill} aria-label="Variantes de portada">
      <span className={s.label}>Portada</span>
      {HERO_VARIANTS.map((v) => (
        <Link key={v.href} href={v.href} prefetch={false} aria-current={v.n === current ? "page" : undefined} aria-label={`Portada ${v.n}: ${v.label}`} title={`${v.label}. ${v.hint}`}>
          {v.n}
        </Link>
      ))}
    </nav>
  );
}
