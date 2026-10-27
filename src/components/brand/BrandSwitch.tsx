"use client";

import { useBrand } from "./BrandProvider";
import { BRAND_ORDER, BRANDS } from "./brands";
import s from "./BrandSwitch.module.css";

export function BrandSwitch() {
  const { brand, setBrand } = useBrand();
  return (
    <div className={s.switch} role="group" aria-label="Probar otro nombre">
      <span>Probar otro nombre:</span>
      {BRAND_ORDER.map((k) => (
        <button key={k} type="button" aria-pressed={brand.key === k} onClick={() => setBrand(k)}>
          {BRANDS[k].name}
          {BRANDS[k].proposal ? <small className={s.new}>propuesta</small> : null}
        </button>
      ))}
    </div>
  );
}
