"use client";

import type { CSSProperties } from "react";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "motion/react";
import s from "./HeroNight.module.css";

/* Estrellas deterministas (mismo resultado en servidor y cliente). */
function seeded(n: number) {
  let x = 7;
  const rnd = () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
  return Array.from({ length: n }, () => ({ x: rnd() * 100, y: rnd() * 62, r: 0.6 + rnd() * 1.5, d: rnd() * 4, t: 2.4 + rnd() * 3 }));
}
const STARS = seeded(54);

export interface SkyPalette {
  top: string[];
  bottom: string[];
  ground: [string, string];
  line: [string, string];
}

export const LIGHT_SKY: SkyPalette = {
  top: ["#0E1426", "#141B33", "#2C2A4E", "#F2B48F", "#FDF1E4"],
  bottom: ["#1F2742", "#2D2A4A", "#9C5F78", "#FBE0C8", "#FDF9F4"],
  ground: ["#0A0F1F", "#EBDDCB"],
  line: ["rgba(243,238,231,0.22)", "rgba(45,47,52,0.16)"],
};

export const DARK_SKY: SkyPalette = {
  top: ["#0B1020", "#10162B", "#241F3D", "#5A3C3E", "#2A2620"],
  bottom: ["#182038", "#231F3A", "#5E3B4E", "#3A2C26", "#1B1A18"],
  ground: ["#05080F", "#23201C"],
  line: ["rgba(243,238,231,0.2)", "rgba(243,238,231,0.14)"],
};

const STOPS = [0, 0.45, 0.55, 0.64, 0.8];

interface ArcGeo {
  w: number;
  h: number;
  cx: number;
  cy: number;
  r: number;
}

/** Cielo de la historia: degradado noche → amanecer, estrellas, el arco con la luna que se pone y el sol que sale, y la ciudad. */
export function Sky({ p, palette }: { p: MotionValue<number>; palette: SkyPalette }) {
  const top = useTransform(p, STOPS, palette.top);
  const bottom = useTransform(p, STOPS, palette.bottom);
  const background = useMotionTemplate`linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`;
  const stars = useTransform(p, [0, 0.48, 0.6], [1, 0.75, 0]);

  return (
    <motion.div className={s.sky} style={{ background }} aria-hidden="true">
      <motion.div className={s.stars} style={{ opacity: stars }}>
        {STARS.map((st, i) => (
          <span key={i} style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.r * 2, height: st.r * 2, animationDelay: `${-st.d}s`, animationDuration: `${st.t}s` } as CSSProperties} />
        ))}
      </motion.div>
      <ArcLayer p={p} palette={palette} geo={{ w: 1600, h: 900, cx: 800, cy: 900, r: 690 }} className={s.onlyDesk} />
      <ArcLayer p={p} palette={palette} geo={{ w: 600, h: 1000, cx: 300, cy: 700, r: 268 }} className={s.onlyMob} />
      <City p={p} palette={palette} />
    </motion.div>
  );
}

const rad = (deg: number) => (deg * Math.PI) / 180;

function ArcLayer({ p, palette, geo, className }: { p: MotionValue<number>; palette: SkyPalette; geo: ArcGeo; className: string }) {
  const { w, h, cx, cy, r } = geo;
  // La luna se pone por la izquierda; el sol sale por la derecha, sobre el mismo arco.
  const moonA = useTransform(p, [0, 0.56], [116, 174]);
  const moonX = useTransform(moonA, (a) => cx + r * Math.cos(rad(a)));
  const moonY = useTransform(moonA, (a) => cy - r * Math.sin(rad(a)));
  const moonO = useTransform(p, [0, 0.46, 0.56], [1, 1, 0]);
  const sunA = useTransform(p, [0.53, 1], [3, 50]);
  const sunX = useTransform(sunA, (a) => cx + r * Math.cos(rad(a)));
  const sunY = useTransform(sunA, (a) => cy - r * Math.sin(rad(a)));
  const sunO = useTransform(p, [0.53, 0.6], [0, 1]);
  const line = useTransform(p, [0.5, 0.66], palette.line);

  return (
    <svg className={`${s.arc} ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax slice">
      <defs>
        <radialGradient id={`halo-${w}`}>
          <stop offset="0" stopColor="#F67748" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F67748" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`moon-${w}`}>
          <stop offset="0" stopColor="#F3EEE7" stopOpacity="0.4" />
          <stop offset="1" stopColor="#F3EEE7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.path
        d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        strokeWidth={w > 1000 ? 2 : 1.6}
        strokeDasharray="2 9"
        strokeLinecap="round"
        style={{ stroke: line }}
      />
      <motion.g style={{ opacity: moonO }}>
        <motion.circle r={w > 1000 ? 70 : 40} fill={`url(#moon-${w})`} cx={moonX} cy={moonY} />
        <motion.circle r={w > 1000 ? 22 : 13} fill="#F3EEE7" cx={moonX} cy={moonY} />
      </motion.g>
      <motion.g style={{ opacity: sunO }}>
        <motion.circle r={w > 1000 ? 120 : 64} fill={`url(#halo-${w})`} cx={sunX} cy={sunY} />
        <motion.circle r={w > 1000 ? 30 : 17} fill="#F67748" cx={sunX} cy={sunY} />
      </motion.g>
    </svg>
  );
}

/* Ciudad con dos ventanas que cuentan la historia: la de Mariana se apaga; la del despacho se enciende al amanecer. */
const BUILDINGS: [number, number, number][] = [
  [0, 70, 110],
  [70, 46, 64],
  [116, 90, 92],
  [206, 58, 128],
  [264, 120, 76],
  [384, 64, 104],
  [448, 96, 60],
  [544, 50, 116],
  [594, 130, 84],
  [724, 72, 136],
  [796, 110, 70],
  [906, 54, 98],
  [960, 120, 58],
  [1080, 66, 122],
  [1146, 104, 88],
  [1250, 60, 64],
  [1310, 126, 104],
  [1436, 70, 74],
  [1506, 94, 112],
];

function City({ p, palette }: { p: MotionValue<number>; palette: SkyPalette }) {
  const ground = useTransform(p, [0.5, 0.7], palette.ground);
  const home = useTransform(p, [0, 0.2, 0.26], [1, 1, 0]);
  const office = useTransform(p, [0.56, 0.62, 0.84, 0.9], [0, 1, 1, 0.35]);
  return (
    <svg className={s.city} viewBox="0 0 1600 140" preserveAspectRatio="xMidYMax slice">
      <motion.g style={{ fill: ground }}>
        {BUILDINGS.map(([x, w, hgt]) => (
          <rect key={x} x={x} y={140 - hgt} width={w} height={hgt} />
        ))}
      </motion.g>
      <motion.rect x={410} y={140 - 104 + 24} width={14} height={18} rx={2} fill="#F7B267" style={{ opacity: home }} />
      <motion.rect x={1176} y={140 - 88 + 22} width={14} height={18} rx={2} fill="#FFD9A0" style={{ opacity: office }} />
      <motion.rect x={1198} y={140 - 88 + 22} width={14} height={18} rx={2} fill="#FFD9A0" style={{ opacity: office }} />
    </svg>
  );
}
