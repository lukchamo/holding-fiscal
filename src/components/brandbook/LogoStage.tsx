"use client";

import { useState } from "react";
import { LogoMark, Wordmark } from "@/components/brand/LogoMark";
import type { BrandKey } from "@/components/brand/brands";
import s from "./Brandbook.module.css";

/** Logotipo grande con botón para repetir la animación. */
export function LogoStage({ brand, name, tone = "paper" }: { brand: BrandKey; name: string; tone?: "paper" | "ink" | "ember" }) {
  const [n, setN] = useState(0);
  return (
    <div className={s.logoStage} data-tone={tone}>
      <div key={n} className={s.logoLockup}>
        <LogoMark brand={brand} size={132} animated title={`Símbolo de ${name}`} />
        <Wordmark name={name} animated className={s.bigWord} />
      </div>
      <button type="button" className={s.replay} onClick={() => setN((v) => v + 1)}>
        Repetir animación
      </button>
    </div>
  );
}
