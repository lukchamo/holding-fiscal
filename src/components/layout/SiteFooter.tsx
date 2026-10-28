import Link from "next/link";
import { BrandName, BrandTagline } from "@/components/brand/BrandProvider";
import { BrandSwitch } from "@/components/brand/BrandSwitch";
import { HERO_VARIANTS, type HeroVariant } from "@/content/site";
import s from "./SiteFooter.module.css";

export function SiteFooter({ hero }: { hero?: HeroVariant }) {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.foot}`}>
        <div>
          <b className={s.brand}>
            <BrandName />
          </b>{" "}
          <span className={s.tagline}>
            <BrandTagline />
          </span>
          <BrandSwitch />
          <nav className={s.heroes} aria-label="Probar otra portada">
            <span>Probar otra portada:</span>
            {HERO_VARIANTS.map((v) => (
              <Link key={v.href} href={v.href} prefetch={false} aria-current={v.n === hero ? "page" : undefined} title={v.hint}>
                {v.n}. {v.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className={s.meta}>
          <p>Prototipo con datos de ejemplo.</p>
          <p>
            <Link href="/marca">Propuesta de marca y logotipo</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
