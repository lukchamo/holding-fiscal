/** Ilustraciones del equipo humano (del prototipo). */

export function LawyerPortrait({ label = "Ilustración de la abogada fiscal" }: { label?: string }) {
  return (
    <svg viewBox="0 0 160 160" role="img" aria-label={label}>
      <circle cx="80" cy="80" r="80" style={{ fill: "var(--dust)" }} />
      <path d="M48 80 C44 42 62 28 80 28 C100 28 118 44 112 82 C110 98 104 108 100 112 L60 112 C54 104 50 96 48 80 Z" fill="#5A3B2E" />
      <path d="M38 160 C38 120 58 104 80 104 C102 104 122 120 122 160 Z" fill="#2D2F34" />
      <path d="M70 104 L80 124 L90 104 Z" fill="#FDF9F4" />
      <circle cx="80" cy="72" r="24" fill="#E7C3A2" />
      <path d="M57 66 C60 44 100 42 104 64 C94 55 70 54 57 66 Z" fill="#5A3B2E" />
    </svg>
  );
}

export function AdvisorPortrait({ label = "Ilustración del gestor del grupo" }: { label?: string }) {
  return (
    <svg viewBox="0 0 160 160" role="img" aria-label={label}>
      <circle cx="80" cy="80" r="80" style={{ fill: "var(--dust)" }} />
      <path d="M36 160 C36 120 56 104 80 104 C104 104 124 120 124 160 Z" fill="#F67748" />
      <circle cx="80" cy="72" r="25" fill="#C98E66" />
      <path d="M55 66 C55 42 105 40 105 66 C99 54 62 54 55 66 Z" fill="#2D2F34" />
      <circle cx="71" cy="74" r="7" fill="none" stroke="#2D2F34" strokeWidth="2.5" />
      <circle cx="89" cy="74" r="7" fill="none" stroke="#2D2F34" strokeWidth="2.5" />
      <path d="M78 74 H82" stroke="#2D2F34" strokeWidth="2.5" />
    </svg>
  );
}

/** Mariana, la fundadora del caso de ejemplo (mismo estilo de ilustración). */
export function FounderPortrait({ label = "Ilustración de Mariana, fundadora de Andino Foods" }: { label?: string }) {
  return (
    <svg viewBox="0 0 160 160" role="img" aria-label={label}>
      <circle cx="80" cy="80" r="80" style={{ fill: "var(--dust)" }} />
      <path d="M46 84 C40 44 60 26 80 26 C102 26 122 44 114 86 C112 104 108 118 104 124 L56 124 C50 112 47 98 46 84 Z" fill="#231A17" />
      <path d="M36 160 C36 122 56 106 80 106 C104 106 124 122 124 160 Z" fill="#4B8B6E" />
      <circle cx="80" cy="72" r="24" fill="#B9845E" />
      <path d="M56 70 C56 46 104 42 106 68 C96 52 70 52 56 70 Z" fill="#231A17" />
      <circle cx="104" cy="50" r="7" fill="#F67748" />
    </svg>
  );
}
