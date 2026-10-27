import type { CSSProperties } from "react";
import { MARK_GEOMETRY, type BrandKey } from "./brands";
import s from "./Logo.module.css";

interface MarkProps {
  brand: BrandKey;
  size?: number;
  /** Reproduce la animación de entrada (trazo, caída del punto). Solo CSS: funciona antes de hidratar. */
  animated?: boolean;
  /** Color del trazo; por defecto hereda el color del texto. */
  ink?: string;
  className?: string;
  title?: string;
}

const EMBER = "#F67748";

/**
 * Símbolo de cada marca. Los de "resguardo" y "cala" son la propuesta nueva
 * (concepto «el abrazo»); los demás reproducen el prototipo original.
 */
export function LogoMark({ brand, size = 30, animated = false, ink = "currentColor", className, title }: MarkProps) {
  const cls = [s.mark, animated ? s.animated : "", className ?? ""].join(" ").trim();
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  if (brand === "resguardo") {
    const g = MARK_GEOMETRY.resguardo;
    return (
      <svg className={cls} width={size} height={size} viewBox="0 0 32 32" {...a11y}>
        <path className={`${s.stroke} ${s.s1}`} pathLength={1} d={g.stem} fill="none" stroke={ink} strokeWidth={3.4} strokeLinecap="round" />
        <path className={`${s.stroke} ${s.s2}`} pathLength={1} d={g.arc} fill="none" stroke={ink} strokeWidth={3.4} strokeLinecap="round" />
        <circle className={s.dot} cx={g.dot.cx} cy={g.dot.cy} r={g.dot.r} fill={EMBER} />
      </svg>
    );
  }

  if (brand === "lucero") {
    const g = MARK_GEOMETRY.lucero;
    return (
      <svg className={cls} width={size} height={size} viewBox="0 0 32 32" {...a11y}>
        <path className={`${s.stroke} ${s.s2}`} pathLength={1} d={g.arc} fill="none" stroke={ink} strokeWidth={3.4} strokeLinecap="round" />
        <circle className={`${s.dot} ${s.rise}`} cx={g.dot.cx} cy={g.dot.cy} r={g.dot.r} fill={EMBER} />
        <path className={s.rays} d={g.rays} fill="none" stroke={EMBER} strokeWidth={1.9} strokeLinecap="round" />
      </svg>
    );
  }

  if (brand === "sereno") {
    return (
      <svg className={cls} width={size} height={size} viewBox="0 0 32 32" {...a11y}>
        <circle cx="10" cy="16" r="6.5" fill="none" stroke={ink} strokeWidth="2.6" />
        <path d="M16.5 16H29M24 16v5M28 16v4" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="10" cy="16" r="2.4" fill={EMBER} />
      </svg>
    );
  }

  if (brand === "cauce") {
    return (
      <svg className={cls} width={Math.round(size * 1.3)} height={size} viewBox="0 0 200 140" {...a11y}>
        <path d="M20 30 C80 30 90 70 130 70" fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round" />
        <path d="M20 70 H130" fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round" />
        <path d="M20 110 C80 110 90 70 130 70" fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round" />
        <path d="M130 70 H182" fill="none" stroke={EMBER} strokeWidth="16" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={cls} width={size} height={size} viewBox="0 0 32 32" {...a11y}>
      <circle cx="16" cy="16" r="13" fill="#A3243B" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="#E7A3AE" strokeWidth="1.2" strokeDasharray="2 2" />
      <text x="16" y="17" textAnchor="middle" dominantBaseline="middle" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="14" fill="#FFFFFF">
        l
      </text>
    </svg>
  );
}

/** Logotipo en texto con entrada letra a letra. */
export function Wordmark({ name, animated = false, className }: { name: string; animated?: boolean; className?: string }) {
  if (!animated) return <span className={`${s.word} ${className ?? ""}`}>{name}</span>;
  return (
    <span className={`${s.word} ${className ?? ""}`}>
      <span className="visually-hidden">{name}</span>
      <span className={s.wordAnimated} aria-hidden="true">
        {Array.from(name).map((ch, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
