"use client";

import { useRef, useState } from "react";
import { useBrand } from "./BrandProvider";
import { LogoMark, Wordmark } from "./LogoMark";

const REPLAY_MS = 1500;

/** Logotipo de la marca activa. Se anima al cargar, al cambiar de marca y (opcionalmente) al pasar el ratón. */
export function BrandLogo({ size = 30, withWord = false, replayOnHover = false }: { size?: number; withWord?: boolean; replayOnHover?: boolean }) {
  const { brand } = useBrand();
  const [play, setPlay] = useState(0);
  const last = useRef(0);

  const replay = () => {
    const now = performance.now();
    if (now - last.current < REPLAY_MS) return;
    last.current = now;
    setPlay((p) => p + 1);
  };

  return (
    <span
      key={`${brand.key}-${play}`}
      onMouseEnter={replayOnHover ? replay : undefined}
      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      <LogoMark brand={brand.key} size={size} animated />
      {withWord ? <Wordmark name={brand.name} animated /> : null}
    </span>
  );
}

/** Solo el símbolo de la marca activa, sin animación (avatares, insignias). */
export function BrandMark({ size = 30, title }: { size?: number; title?: string }) {
  const { brand } = useBrand();
  return <LogoMark brand={brand.key} size={size} title={title} />;
}
