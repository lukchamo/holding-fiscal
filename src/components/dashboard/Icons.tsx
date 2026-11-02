/** Iconos de trazo del panel (24 × 24, decorativos: el texto de al lado da el nombre). */
const PATHS = {
  home: "M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z",
  inbox: "M3.5 13.5h4.5l1.8 2.8h4.4l1.8-2.8h4.5M3.5 13.5 6 5h12l2.5 8.5V19a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z",
  calendar: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8.5 3v4M15.5 3v4",
  file: "M6.5 3h7.5l4.5 4.5V20a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v4.5h4.5",
  receipt: "M6 3h12v18l-3-1.8-3 1.8-3-1.8L6 21zM9 8h6M9 12h6M9 16h3",
  euro: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 9.2a4 4 0 1 0 0 5.6M7.5 11h6M7.5 13h6",
  building: "M4 21V8.5L12 3.5l8 5V21M9 21v-5.5h6V21M8 11h.01M12 11h.01M16 11h.01",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M17.5 14.7c2 .7 3.5 2.6 3.5 5.3",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16.2 16.2 21 21",
  bell: "M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 0 0 4 0",
  chevron: "M6 9.5l6 6 6-6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  sparkle: "M12 3.5l1.9 4.9 4.9 1.9-4.9 1.9-1.9 4.9-1.9-4.9-4.9-1.9 4.9-1.9zM18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  alert: "M12 4 21 19.5H3zM12 10v4.2M12 17v.3",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5.5M12 7.8v.3",
  download: "M12 4v11M7 10.5l5 5 5-5M5 20h14",
  close: "M6 6l12 12M18 6 6 18",
  pen: "M4 20l4.2-1L19 8.2 15.8 5 5 15.8zM13.8 7l3.2 3.2",
  doc: "M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 12h6M9 16h4",
  send: "M4 12l16-8-6 16-2.5-6.5z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
