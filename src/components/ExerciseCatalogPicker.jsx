import { useMemo, useState } from "react";
import { getExerciseCatalog } from "../utils/storage";
import ExerciseImage from "./ExerciseImage";

const GROUP_COLORS = {
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

export default function ExerciseCatalogPicker({ onPick, onClose, excludeIds = [], title = "Ajouter un exo" }) {
  const catalog = useMemo(
    () => getExerciseCatalog().filter((e) => !excludeIds.includes(e.id)),
    [excludeIds]
  );
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");

  const groups = useMemo(() => {
    const set = new Set(catalog.map((e) => e.muscleGroup));
    return ["ALL", ...Array.from(set).sort()];
  }, [catalog]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((ex) => {
      if (groupFilter !== "ALL" && ex.muscleGroup !== groupFilter) return false;
      if (q && !ex.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [catalog, search, groupFilter]);

  return (
    <div className="catalog-modal-overlay" onClick={onClose}>
      <div className="catalog-modal" onClick={(e) => e.stopPropagation()}>
        <header className="catalog-modal-header">
          <h3 className="catalog-modal-title">{title}</h3>
          <button className="catalog-modal-close" onClick={onClose} aria-label="Fermer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="quick-search-wrap" style={{ marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="quick-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            autoFocus
          />
          {search && (
            <button className="quick-search-clear" onClick={() => setSearch("")} aria-label="Effacer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="period-chips" role="tablist" style={{ marginBottom: 10 }}>
          {groups.map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={groupFilter === g}
              className={`period-chip ${groupFilter === g ? "active" : ""}`}
              onClick={() => setGroupFilter(g)}
            >
              {g === "ALL" ? "Tous" : g}
            </button>
          ))}
        </div>

        <div className="catalog-list">
          {filtered.map((ex) => {
            const color = GROUP_COLORS[ex.muscleGroup] || GROUP_COLORS.Autre;
            return (
              <button key={ex.id} className="quick-card" onClick={() => onPick(ex)}>
                <div
                  className="quick-card-thumb"
                  style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}
                >
                  <ExerciseImage name={ex.image} alt={ex.name} className="quick-card-img" />
                </div>
                <div className="quick-card-body">
                  <span className="quick-card-name">{ex.name}</span>
                  <span className="quick-card-meta">
                    <span style={{ color }}>{ex.muscleGroup}</span>
                    {" · "}
                    {ex.sets} × {ex.reps}
                  </span>
                </div>
                <div className="quick-card-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="empty-hint" style={{ textAlign: "center", padding: "24px 0" }}>
              Aucun exo trouvé
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
