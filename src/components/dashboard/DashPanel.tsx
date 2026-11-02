"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AgentAvatar, PersonPortrait } from "@/components/sections/team/TeamParts";
import {
  AGENT_LOAD,
  ALERTS,
  agentOf,
  BANKS,
  CASH,
  CLASSIFIED,
  companyOf,
  COMPANIES,
  dayOf,
  eur,
  FILINGS,
  GRANTS,
  INVOICES,
  monthLong,
  MONTHS6,
  num,
  OBLIGATIONS,
  reviewerOf,
  shortDate,
  STATE_LABEL,
  TODAY_ISO,
  toTime,
  type CompanyKey,
  type Scope,
} from "./dashData";
import { Icon } from "./Icons";
import s from "./panel.module.css";

const SCOPES: readonly { key: Scope; label: string }[] = [
  { key: "group", label: "Todo el grupo" },
  ...COMPANIES.map((c) => ({ key: c.key, label: c.short })),
];

const SERIES = ["foods", "inmuebles"] as const;
type Series = (typeof SERIES)[number];
const seriesFor = (scope: Scope): readonly Series[] => (scope === "group" ? SERIES : scope === "holding" ? [] : [scope]);
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
const inScope = (scope: Scope, k: CompanyKey) => scope === "group" || scope === k;

/** Ancho real de un elemento (para dibujar las gráficas en píxeles nítidos). */
function useWidth(fallback: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/**
 * Alternativa B · «Panel». Cómo va el grupo de un vistazo: un filtro por
 * sociedad que gobierna todo lo de debajo, indicadores con su contexto y las
 * gráficas justas, cada una con su tabla de datos.
 */
export function DashPanel() {
  const [scope, setScope] = useState<Scope>("group");
  const holding = scope === "holding";

  const exportCsv = () => {
    const series = seriesFor(scope);
    const head = ["Mes", ...series.map((k) => companyOf(k).name), "Total"].join(";");
    const rows = MONTHS6.map((m, i) => [m, ...series.map((k) => INVOICES[k][i]), sum(series.map((k) => INVOICES[k][i]))].join(";"));
    const blob = new Blob([[head, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `facturas-${scope}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div>
          <h1>Panel del grupo</h1>
          <p className={s.sub}>Datos a {shortDate(TODAY_ISO)} · actualizado hace 4 minutos</p>
        </div>
      </header>

      {/* Un único filtro, encima de todo lo que gobierna */}
      <div className={s.filterRow}>
        <div className={s.segmented} role="group" aria-label="Sociedad">
          {SCOPES.map((o) => (
            <button key={o.key} type="button" aria-pressed={scope === o.key} onClick={() => setScope(o.key)}>
              {o.key !== "group" ? <i style={{ background: companyOf(o.key).color }} aria-hidden="true" /> : null}
              {o.label}
            </button>
          ))}
        </div>
        <button type="button" className={s.export} onClick={exportCsv} disabled={holding}>
          <Icon name="download" size={18} />
          Exportar CSV
        </button>
      </div>

      {holding ? (
        <p className={s.notice}>
          <Icon name="info" size={18} />
          Andino Holding SL se constituye el 24 de noviembre: hasta entonces no tiene facturas, cuentas ni plazos propios.
        </p>
      ) : null}

      <Kpis scope={scope} />

      <div className={s.grid}>
        <InvoicesChart scope={scope} />
        <Alerts scope={scope} />
        <AgentsTable scope={scope} />
        <DueCalendar scope={scope} />
        <Grants scope={scope} />
        <Cash scope={scope} />
      </div>
    </div>
  );
}

/* ---------- Indicadores ---------- */
function Kpis({ scope }: { scope: Scope }) {
  const keys = COMPANIES.map((c) => c.key).filter((k) => inScope(scope, k));
  const filed = keys.reduce<[number, number]>((a, k) => [a[0] + FILINGS[k][0], a[1] + FILINGS[k][1]], [0, 0]);
  const cls = keys.reduce<[number, number]>((a, k) => [a[0] + CLASSIFIED[k][0], a[1] + CLASSIFIED[k][1]], [0, 0]);
  const grants = GRANTS.filter((g) => inScope(scope, g.company));
  const grantSum = sum(grants.map((g) => g.amount));
  const series = seriesFor(scope);
  const cash = MONTHS6.map((_, i) => sum(series.map((k) => CASH[k][i])));
  const last = cash[cash.length - 1];
  const prev = cash[cash.length - 2];
  const delta = prev ? ((last - prev) / prev) * 100 : 0;
  const empty = !keys.length || filed[1] === 0;

  return (
    <ul className={s.kpis}>
      <li className={s.kpi}>
        <span className={s.kLabel}>Plazos a tiempo en 2026</span>
        <span className={s.kValue}>{empty ? "—" : `${filed[0]} de ${filed[1]}`}</span>
        <Meter value={filed[0]} total={filed[1]} />
        <span className={s.kNote}>
          {empty ? (
            "Sin plazos propios todavía"
          ) : (
            <>
              <Icon name="check" size={16} className={s.good} /> Sin recargos ni sanciones
            </>
          )}
        </span>
      </li>
      <li className={s.kpi}>
        <span className={s.kLabel}>Facturas de octubre clasificadas</span>
        <span className={s.kValue}>{cls[1] ? `${cls[0]} de ${cls[1]}` : "—"}</span>
        <Meter value={cls[0]} total={cls[1]} />
        <span className={s.kNote}>
          {cls[1] - cls[0] > 0 ? (
            <>
              <Icon name="clock" size={16} /> {cls[1] - cls[0]} esperan el visto bueno de {reviewerOf("gestor").first}
            </>
          ) : cls[1] ? (
            <>
              <Icon name="check" size={16} className={s.good} /> Todas registradas
            </>
          ) : (
            "Sin facturas todavía"
          )}
        </span>
      </li>
      <li className={s.kpi}>
        <span className={s.kLabel}>Ayudas en curso</span>
        <span className={s.kValue}>{grantSum ? `Hasta ${eur(grantSum)}` : "—"}</span>
        <span className={s.kNote}>{grants.length ? `${grants.length} convocatorias · encaje medio del ${Math.round(sum(grants.map((g) => g.fit)) / grants.length)} %` : "Ninguna convocatoria encaja aún"}</span>
      </li>
      <li className={s.kpi}>
        <span className={s.kLabel}>Caja a 31 de octubre</span>
        <span className={s.kValue}>{last ? eur(last) : "—"}</span>
        {last ? <Sparkline values={cash} /> : null}
        <span className={s.kNote}>{last ? `${delta >= 0 ? "+" : "−"}${num(Math.abs(Math.round(delta * 10) / 10))} % respecto a septiembre` : "Sin cuenta bancaria todavía"}</span>
      </li>
    </ul>
  );
}

function Meter({ value, total }: { value: number; total: number }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <span className={s.meter} aria-hidden="true">
      <span style={{ width: `${pct}%` }} />
    </span>
  );
}

function Sparkline({ values }: { values: readonly number[] }) {
  const W = 120;
  const H = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => [4 + (i * (W - 8)) / (values.length - 1), 4 + (1 - (v - min) / (max - min || 1)) * (H - 8)] as const);
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className={s.spark} viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true">
      <polyline points={pts.map((p) => p.join(",")).join(" ")} />
      <circle cx={lx} cy={ly} r={4} />
    </svg>
  );
}

/* ---------- Facturas por mes: columnas apiladas ---------- */
function InvoicesChart({ scope }: { scope: Scope }) {
  const [ref, width] = useWidth(640);
  const [hover, setHover] = useState<number | null>(null);
  const series = seriesFor(scope);
  const totals = MONTHS6.map((_, i) => sum(series.map((k) => INVOICES[k][i])));
  const H = 220;
  const PAD = { l: 34, r: 8, t: 22, b: 26 };
  const plotW = Math.max(200, width) - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const max = 150;
  const ticks = [0, 50, 100, 150];
  const band = plotW / MONTHS6.length;
  const colW = Math.min(24, band * 0.5);
  const y = (v: number) => PAD.t + plotH - (v / max) * plotH;
  const last = MONTHS6.length - 1;

  const onKey = (e: ReactKeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = (i + (e.key === "ArrowRight" ? 1 : MONTHS6.length - 1)) % MONTHS6.length;
      (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
    }
  };

  return (
    <section className={`${s.card} ${s.span8}`} aria-labelledby="h-facturas">
      <div className={s.cardHead}>
        <h2 id="h-facturas">Facturas recibidas por mes</h2>
        {series.length > 1 ? (
          <ul className={s.legend} aria-label="Leyenda">
            {series.map((k) => (
              <li key={k}>
                <i style={{ background: companyOf(k).color }} aria-hidden="true" />
                {companyOf(k).name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {series.length ? (
        <div ref={ref} className={s.chartBox}>
          <svg width={Math.max(200, width)} height={H} role="img" aria-label={`Facturas recibidas de mayo a octubre: ${totals.map((t, i) => `${MONTHS6[i]} ${t}`).join(", ")}`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.l} x2={PAD.l + plotW} y1={y(t)} y2={y(t)} className={s.gridLine} />
                <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" className={s.tick}>
                  {t}
                </text>
              </g>
            ))}
            {MONTHS6.map((m, i) => {
              const cx = PAD.l + band * i + band / 2;
              let base = 0;
              return (
                <g key={m} className={s.col} data-dim={hover !== null && hover !== i}>
                  {series.map((k, si) => {
                    const v = INVOICES[k][i];
                    const top = si === series.length - 1;
                    const y0 = y(base) - (si > 0 ? 2 : 0); // 2 px de hueco entre tramos
                    const y1 = y(base + v);
                    base += v;
                    return <path key={k} d={bar(cx - colW / 2, y1, colW, Math.max(0, y0 - y1), top ? 4 : 0)} style={{ fill: companyOf(k).color }} />;
                  })}
                  <text x={cx} y={H - 8} textAnchor="middle" className={s.tick}>
                    {m}
                  </text>
                  {i === last ? (
                    <text x={cx} y={y(totals[i]) - 8} textAnchor="middle" className={s.direct}>
                      {totals[i]}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
          {/* Zonas de lectura: más anchas que la columna, también con el teclado */}
          <div className={s.hits} style={{ left: PAD.l, width: plotW, top: PAD.t, height: plotH }}>
            {MONTHS6.map((m, i) => (
              <span
                key={m}
                tabIndex={0}
                role="img"
                aria-label={`${m}: ${series.map((k) => `${companyOf(k).short} ${INVOICES[k][i]}`).join(", ")}${series.length > 1 ? `, total ${totals[i]}` : ""}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => onKey(e, i)}
              />
            ))}
          </div>
          {hover !== null ? (
            <div className={s.tooltip} style={{ left: Math.min(PAD.l + band * hover + band / 2, Math.max(200, width) - 90), top: Math.max(4, y(totals[hover]) - 70) }} aria-hidden="true">
              <b className={s.ttTitle}>{MONTHS6[hover]} de 2026</b>
              {series.map((k) => (
                <span key={k}>
                  <i style={{ background: companyOf(k).color }} />
                  <b>{INVOICES[k][hover]}</b> {companyOf(k).short}
                </span>
              ))}
              {series.length > 1 ? (
                <span className={s.ttTotal}>
                  <b>{totals[hover]}</b> en total
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <p className={s.emptyChart}>Sin facturas todavía.</p>
      )}

      {series.length ? (
        <details className={s.table}>
          <summary>Ver los datos en una tabla</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Mes</th>
                {series.map((k) => (
                  <th key={k} scope="col">
                    {companyOf(k).short}
                  </th>
                ))}
                {series.length > 1 ? <th scope="col">Total</th> : null}
              </tr>
            </thead>
            <tbody>
              {MONTHS6.map((m, i) => (
                <tr key={m}>
                  <th scope="row">{m}</th>
                  {series.map((k) => (
                    <td key={k}>{INVOICES[k][i]}</td>
                  ))}
                  {series.length > 1 ? <td>{totals[i]}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ) : null}
    </section>
  );
}

/** Columna con el extremo de datos redondeado (4 px) y la base recta. */
function bar(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h, w / 2);
  return `M${x} ${y + h}V${y + rr}Q${x} ${y} ${x + rr} ${y}H${x + w - rr}Q${x + w} ${y} ${x + w} ${y + rr}V${y + h}Z`;
}

/* ---------- Avisos ---------- */
function Alerts({ scope }: { scope: Scope }) {
  const list = ALERTS.filter((a) => inScope(scope, a.company));
  return (
    <section className={`${s.card} ${s.span4}`} aria-labelledby="h-avisos">
      <div className={s.cardHead}>
        <h2 id="h-avisos">Avisos</h2>
      </div>
      {list.length ? (
        <ul className={s.alerts}>
          {list.map((a) => (
            <li key={a.title} data-level={a.level}>
              <Icon name={a.level === "attention" ? "alert" : "info"} size={18} />
              <span>
                <b>{a.title}</b>
                <span className={s.alertMeta}>
                  {companyOf(a.company).short} · {a.level === "attention" ? "Requiere tu firma" : "Informativo"}
                </span>
                {a.text}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.emptyChart}>Nada que destacar.</p>
      )}
    </section>
  );
}

/* ---------- Agentes ---------- */
function AgentsTable({ scope }: { scope: Scope }) {
  const rows = AGENT_LOAD.filter((r) => scope === "group" || r.scope.includes(scope as CompanyKey));
  const maxDone = Math.max(...AGENT_LOAD.map((r) => r.doneWeek));
  return (
    <section className={`${s.card} ${s.span6}`} aria-labelledby="h-agentes">
      <div className={s.cardHead}>
        <h2 id="h-agentes">Agentes esta semana</h2>
      </div>
      <div className={s.scrollX}>
        <table className={s.agents}>
          <thead>
            <tr>
              <th scope="col">Agente</th>
              <th scope="col" className={s.numCol}>
                En curso
              </th>
              <th scope="col">Hechas</th>
              <th scope="col">Esperan visto bueno</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const a = agentOf(r.agent);
              const by = a.validates === "tu gestor" ? "gestor" : "abogada";
              return (
                <tr key={r.agent}>
                  <th scope="row">
                    <span className={s.agentCell}>
                      <AgentAvatar agent={a} size={32} />
                      <span>
                        <b>{a.name}</b>
                        <small>{a.role}</small>
                      </span>
                    </span>
                  </th>
                  <td className={s.numCol}>{r.doing}</td>
                  <td>
                    <span className={s.doneCell}>
                      <span className={s.doneBar} aria-hidden="true">
                        <span style={{ width: `${(r.doneWeek / maxDone) * 100}%` }} />
                      </span>
                      {r.doneWeek}
                    </span>
                  </td>
                  <td>
                    <span className={s.waitCell}>
                      <span className={s.mini} aria-hidden="true">
                        <PersonPortrait k={by} />
                      </span>
                      {r.waiting ? `${r.waiting} · ${reviewerOf(by).first}` : `Al día · ${reviewerOf(by).first}`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- Calendario de vencimientos (mapa de calor de un solo tono) ---------- */
const MONTH_STARTS = ["2026-11-01", "2026-12-01", "2027-01-01"];

function DueCalendar({ scope }: { scope: Scope }) {
  const [focus, setFocus] = useState<string | null>(null);
  const items = OBLIGATIONS.filter((o) => o.state !== "done" && inScope(scope, o.company));
  const byDay = new Map<string, typeof items>();
  items.forEach((o) => byDay.set(o.due, [...(byDay.get(o.due) ?? []), o]));
  const focused = focus ? byDay.get(focus) : undefined;

  return (
    <section className={`${s.card} ${s.span6}`} aria-labelledby="h-vencimientos">
      <div className={s.cardHead}>
        <h2 id="h-vencimientos">Vencimientos</h2>
        <ul className={s.legend} aria-label="Leyenda">
          <li>
            <i className={s.lv1} aria-hidden="true" />1
          </li>
          <li>
            <i className={s.lv2} aria-hidden="true" />2 o más
          </li>
          <li>
            <i className={s.lvYou} aria-hidden="true" />
            Te necesita
          </li>
        </ul>
      </div>
      <div className={s.months}>
        {MONTH_STARTS.map((start) => (
          <MonthGrid key={start} start={start} byDay={byDay} focus={focus} onFocusDay={setFocus} />
        ))}
      </div>
      <p className={s.dayInfo} aria-live="polite">
        {focus ? (
          focused?.length ? (
            <>
              <b>{shortDate(focus)}:</b> {focused.map((o) => `${o.title} (${companyOf(o.company).short}, ${STATE_LABEL[o.state].toLowerCase()})`).join(" · ")}
            </>
          ) : (
            <>
              <b>{shortDate(focus)}:</b> sin vencimientos
            </>
          )
        ) : (
          "Pasa por un día o recórrelo con el teclado para ver qué vence."
        )}
      </p>
      <details className={s.table}>
        <summary>Ver los vencimientos en una tabla</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Qué</th>
              <th scope="col">Sociedad</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {[...items]
              .sort((a, b) => toTime(a.due) - toTime(b.due))
              .map((o) => (
                <tr key={o.id}>
                  <th scope="row">{shortDate(o.due)}</th>
                  <td>{o.title}</td>
                  <td>{companyOf(o.company).short}</td>
                  <td>{STATE_LABEL[o.state]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

function MonthGrid({ start, byDay, focus, onFocusDay }: { start: string; byDay: Map<string, unknown[]>; focus: string | null; onFocusDay: (d: string | null) => void }) {
  const d0 = new Date(toTime(start));
  const year = d0.getUTCFullYear();
  const month = d0.getUTCMonth();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (d0.getUTCDay() + 6) % 7; // semana que empieza en lunes
  const name = monthLong(start);
  const iso = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return (
    <div className={s.month}>
      <p className={s.monthName}>
        {name} {year !== 2026 ? year : ""}
      </p>
      <div className={s.week} aria-hidden="true">
        {["L", "M", "X", "J", "V", "S", "D"].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className={s.days}>
        {Array.from({ length: lead }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = iso(i + 1);
          const list = (byDay.get(d) ?? []) as { state: string }[];
          const level = list.length >= 2 ? 2 : list.length;
          const you = list.some((o) => o.state === "you");
          // Solo los días con vencimientos son paradas del teclado
          if (!list.length) {
            return (
              <span key={d} className={s.day} data-level={0} data-today={d === TODAY_ISO} aria-hidden="true">
                {i + 1}
              </span>
            );
          }
          return (
            <button
              key={d}
              type="button"
              className={s.day}
              data-level={level}
              data-you={you}
              data-today={d === TODAY_ISO}
              data-focus={focus === d}
              aria-label={`${dayOf(d)} de ${name}: ${list.length} vencimiento${list.length > 1 ? "s" : ""}${you ? ", te necesita" : ""}`}
              onPointerEnter={() => onFocusDay(d)}
              onFocus={() => onFocusDay(d)}
              onClick={() => onFocusDay(d)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Ayudas: barras ordenadas, un solo tono (todas son de Foods) ---------- */
function Grants({ scope }: { scope: Scope }) {
  const list = GRANTS.filter((g) => inScope(scope, g.company));
  return (
    <section className={`${s.card} ${s.span6}`} aria-labelledby="h-ayudas">
      <div className={s.cardHead}>
        <h2 id="h-ayudas">Encaje de las ayudas</h2>
      </div>
      {list.length ? (
        <ul className={s.grants}>
          {list.map((g) => (
            <li key={g.label}>
              <span className={s.grantHead}>
                <b>{g.label}</b>
                <span>
                  Hasta {eur(g.amount)} · {g.state}
                </span>
              </span>
              <span className={s.grantRow}>
                <span className={s.grantTrack} aria-hidden="true">
                  <span style={{ width: `${g.fit}%`, background: companyOf(g.company).color } as CSSProperties} />
                </span>
                <b className={s.grantPct}>{g.fit}&nbsp;%</b>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.emptyChart}>Ninguna convocatoria encaja aún con esta sociedad.</p>
      )}
    </section>
  );
}

/* ---------- Caja por banco: barra segmentada fina + lista ---------- */
function Cash({ scope }: { scope: Scope }) {
  const list = BANKS.filter((b) => inScope(scope, b.company));
  const total = sum(list.map((b) => b.balance));
  return (
    <section className={`${s.card} ${s.span6}`} aria-labelledby="h-caja">
      <div className={s.cardHead}>
        <h2 id="h-caja">Caja por banco</h2>
        {total ? <span className={s.cardValue}>{eur(total)}</span> : null}
      </div>
      {list.length ? (
        <>
          <div className={s.segBar} role="img" aria-label={list.map((b) => `${b.bank} (${companyOf(b.company).short}): ${eur(b.balance)}`).join("; ")}>
            {list.map((b) => (
              <span key={b.bank} style={{ flexGrow: b.balance, background: companyOf(b.company).color }} />
            ))}
          </div>
          <ul className={s.banks}>
            {list.map((b) => (
              <li key={b.bank}>
                <i style={{ background: companyOf(b.company).color }} aria-hidden="true" />
                <span>
                  <b>{b.bank}</b> · {companyOf(b.company).short}
                </span>
                <span className={s.bankVal}>{eur(b.balance)}</span>
                <span className={s.bankPct}>{Math.round((b.balance / total) * 100)}&nbsp;%</span>
              </li>
            ))}
          </ul>
          <p className={s.footnote}>Conexión de solo lectura (PSD2). Ningún agente puede mover dinero.</p>
        </>
      ) : (
        <p className={s.emptyChart}>Sin cuentas bancarias todavía.</p>
      )}
    </section>
  );
}
