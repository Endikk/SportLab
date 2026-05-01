import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { programHypertrophieInfo } from "../data/program-hypertrophie";

const PROGRAM_INFOS = {
  hypertrophie: programHypertrophieInfo,
};

function Section({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`info-section ${open ? "open" : ""}`}>
      <button className="info-section-header" onClick={() => setOpen((o) => !o)}>
        <span className="info-section-icon" aria-hidden="true">{icon}</span>
        <span className="info-section-title">{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="info-section-chevron"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="info-section-body">{children}</div>}
    </div>
  );
}

export default function ProgramInfo() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const info = PROGRAM_INFOS[programId];

  if (!info) {
    return (
      <div className="page">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Retour">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="page-title">Programme introuvable</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="page program-info-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Retour">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">{info.title}</h1>
          <p className="page-subtitle">{info.subtitle} · {info.version}</p>
        </div>
      </header>

      {/* Quick facts */}
      <div className="info-quickfacts">
        <div className="info-quickfact">
          <span className="info-quickfact-label">Objectif</span>
          <span className="info-quickfact-value">{info.overview.goal}</span>
        </div>
        <div className="info-quickfact">
          <span className="info-quickfact-label">Durée</span>
          <span className="info-quickfact-value">{info.duration}</span>
        </div>
        <div className="info-quickfact">
          <span className="info-quickfact-label">Cadence</span>
          <span className="info-quickfact-value">{info.overview.sessions}</span>
        </div>
        <div className="info-quickfact">
          <span className="info-quickfact-label">Priorité</span>
          <span className="info-quickfact-value">{info.overview.priority}</span>
        </div>
      </div>

      {/* Vue d'ensemble (ouvert par défaut) */}
      <Section title="Vue d'ensemble" icon="🎯" defaultOpen>
        <p className="info-paragraph">{info.overview.novelty}</p>
        <ul className="info-mini-list">
          <li><strong>Profil :</strong> {info.overview.profile}</li>
          <li><strong>Sessions :</strong> {info.overview.sessions}</li>
        </ul>
      </Section>

      {/* Planning hebdo */}
      <Section title="Planning hebdomadaire" icon="📅">
        <div className="info-week">
          {info.schedule.map((d) => (
            <div key={d.day} className={`info-week-row ${d.session === "Repos" ? "rest" : ""}`}>
              <span className="info-week-emoji">{d.emoji}</span>
              <div className="info-week-info">
                <span className="info-week-day">{d.day}</span>
                <span className="info-week-session">{d.session}</span>
              </div>
              <span className="info-week-duration">{d.duration}</span>
            </div>
          ))}
        </div>
        <h4 className="info-subtitle">Rotation abdos</h4>
        <ul className="info-mini-list">
          {info.abdosRotation.map((r) => (
            <li key={r.day}><strong>{r.day} :</strong> {r.exercises}</li>
          ))}
        </ul>
      </Section>

      {/* Volume hebdomadaire */}
      <Section title="Volume hebdomadaire" icon="📊">
        <div className="info-table-wrap">
          <table className="info-table">
            <thead>
              <tr>
                <th>Muscle</th>
                <th>Séries/sem</th>
                <th>Fréq.</th>
                <th>Cible</th>
              </tr>
            </thead>
            <tbody>
              {info.volumeTable.map((row) => (
                <tr key={row.muscle} className={row.priority ? "highlight" : ""}>
                  <td>{row.muscle}{row.priority && " ⭐"}</td>
                  <td>{row.weekly}</td>
                  <td>{row.freq}</td>
                  <td>{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="info-caption">⭐ = muscle prioritaire · MEV = volume minimum, MAV = volume optimal (RP 2024)</p>
      </Section>

      {/* Progression */}
      <Section title="Progression" icon="📈">
        <p className="info-paragraph">
          <strong>Méthode :</strong> {info.progression.method}.<br />
          {info.progression.rule}
        </p>
        <p className="info-paragraph">
          <strong>Sauts :</strong> {info.progression.increments}
        </p>
        <p className="info-paragraph"><em>{info.progression.example}</em></p>

        <h4 className="info-subtitle">Plan 6 semaines</h4>
        <div className="info-table-wrap">
          <table className="info-table">
            <thead>
              <tr>
                <th>Sem</th>
                <th>RIR</th>
                <th>Volume</th>
                <th>Charge</th>
              </tr>
            </thead>
            <tbody>
              {info.progression.plan.map((p) => (
                <tr key={p.week} className={p.label === "Deload" ? "highlight" : ""}>
                  <td>{p.week} <small>{p.label}</small></td>
                  <td>{p.rir}</td>
                  <td>{p.volume}</td>
                  <td>{p.load}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 className="info-subtitle">Techniques d'intensification</h4>
        <ul className="info-mini-list">
          {info.intensification.map((p) => (
            <li key={p.phase}>
              <strong>{p.phase} — {p.name} :</strong> {p.details}
            </li>
          ))}
        </ul>
        <p className="info-warning">⚠️ {info.intensificationGoldenRule}</p>
      </Section>

      {/* Nutrition */}
      <Section title="Nutrition" icon="🍽️">
        <div className="info-stats-row">
          <div className="info-stat-pill">
            <span className="info-stat-pill-label">Maintenance</span>
            <span className="info-stat-pill-value">{info.nutrition.maintenance}</span>
          </div>
          <div className="info-stat-pill highlight">
            <span className="info-stat-pill-label">Cible</span>
            <span className="info-stat-pill-value">{info.nutrition.target}</span>
          </div>
        </div>

        <h4 className="info-subtitle">Macros à 3 300 kcal</h4>
        <div className="info-table-wrap">
          <table className="info-table">
            <thead>
              <tr><th>Macro</th><th>Quantité</th><th>kcal</th></tr>
            </thead>
            <tbody>
              {info.nutrition.macros.map((m) => (
                <tr key={m.name}>
                  <td>{m.name}</td>
                  <td>{m.grams} <small>({m.ratio})</small></td>
                  <td>{m.kcal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 className="info-subtitle">Ajustement après 2 semaines</h4>
        <ul className="info-mini-list">
          {info.nutrition.adjust.map((a) => (
            <li key={a.gain}><strong>{a.gain} :</strong> {a.action}</li>
          ))}
        </ul>

        <h4 className="info-subtitle">Suppléments</h4>
        <div className="info-supp-list">
          {info.nutrition.supplements.map((s) => (
            <div key={s.name} className={`info-supp ${s.essential ? "essential" : ""}`}>
              <div className="info-supp-top">
                <span className="info-supp-name">{s.name}</span>
                <span className="info-supp-dose">{s.dose}</span>
              </div>
              <span className="info-supp-why">{s.why}</span>
            </div>
          ))}
        </div>

        <h4 className="info-subtitle">Conseils ectomorphe</h4>
        <ul className="info-mini-list">
          {info.nutrition.tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </Section>

      {/* Règles d'or */}
      <Section title="Règles d'or" icon="✨">
        <ul className="info-mini-list golden">
          {info.golden.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
      </Section>

      {/* Erreurs à éviter */}
      <Section title="Erreurs à éviter" icon="⚠️">
        <ol className="info-mini-list errors">
          {info.errors.map((e, i) => <li key={i}>{e}</li>)}
        </ol>
      </Section>
    </div>
  );
}
