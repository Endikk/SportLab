import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllExercisePRs } from "../utils/storage";

const SORT_OPTIONS = [
  { id: "1rm",   label: "1RM" },
  { id: "max",   label: "Poids max" },
  { id: "recent", label: "Récent" },
];

const GROUP_COLOR = {
  Pectoraux: "#FF6A13",
  Dos: "#3B82F6",
  Épaules: "#F59E0B",
  Biceps: "#EC4899",
  Triceps: "#EF4444",
  Bras: "#EC4899",
  Trapèzes: "#6366F1",
  Lombaires: "#6366F1",
  Quadriceps: "#10B981",
  Ischios: "#059669",
  Mollets: "#14B8A6",
  Abdos: "#F97316",
  Cardio: "#22D3EE",
  Mobilité: "#A78BFA",
  Autre: "#5A5A65",
};

function fmtDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Records() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("1rm");

  const rows = useMemo(() => {
    const base = getAllExercisePRs();
    if (sortBy === "max") return [...base].sort((a, b) => b.bestWeight - a.bestWeight);
    if (sortBy === "recent") return [...base].sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
    return base;
  }, [sortBy]);

  return (
    <div className="page records-page">
      <header className="home-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
      </header>

      <div className="page-title-row">
        <h1 className="big-title">Records</h1>
        <span className="big-title-meta">{rows.length} exercices</span>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" aria-hidden="true">
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
            <path d="M7 4H4v3a3 3 0 003 3M17 4h3v3a3 3 0 01-3 3" />
          </svg>
          <p>Aucun record encore.</p>
          <p className="empty-hint">Termine ta première séance pour débloquer tes records.</p>
        </div>
      ) : (
        <>
          <div className="period-chips" role="tablist">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                role="tab"
                aria-selected={sortBy === opt.id}
                className={`period-chip ${sortBy === opt.id ? "active" : ""}`}
                onClick={() => setSortBy(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="records-list">
            {rows.map((row) => {
              const color = GROUP_COLOR[row.muscleGroup] || GROUP_COLOR.Autre;
              return (
                <button
                  key={row.exerciseId}
                  className="record-row"
                  onClick={() => navigate(`/history/${row.exerciseId}`)}
                >
                  <span className="record-stripe" style={{ background: color }} />
                  <div className="record-main">
                    <div className="record-top">
                      <span className="record-name">{row.name}</span>
                      <span className="record-group" style={{ color }}>{row.muscleGroup}</span>
                    </div>
                    <div className="record-stats">
                      <div className="record-stat">
                        <span className="record-stat-label">Max</span>
                        <span className="record-stat-value">{row.bestWeight} kg</span>
                      </div>
                      <div className="record-stat">
                        <span className="record-stat-label">1RM est.</span>
                        <span className="record-stat-value highlight">{row.best1RM} kg</span>
                      </div>
                      <div className="record-stat">
                        <span className="record-stat-label">Séances</span>
                        <span className="record-stat-value">{row.sessions}</span>
                      </div>
                    </div>
                    <span className="record-date">PR {fmtDate(row.prDate)}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="record-arrow" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
