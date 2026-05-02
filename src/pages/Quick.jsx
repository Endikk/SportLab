import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExerciseCatalog, createFreestyleSession } from "../utils/storage";
import ExerciseImage from "../components/ExerciseImage";

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

export default function Quick() {
  const navigate = useNavigate();
  const catalog = useMemo(() => getExerciseCatalog(), []);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [selected, setSelected] = useState([]); // ordered list of exercise IDs
  const [error, setError] = useState(null);

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

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const move = (id, dir) => {
    setSelected((prev) => {
      const idx = prev.indexOf(id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const handleStart = () => {
    setError(null);
    if (!selected.length) {
      setError("Sélectionne au moins un exercice");
      return;
    }
    try {
      const session = createFreestyleSession(selected);
      navigate(`/workout/${session.id}`);
    } catch (e) {
      setError(e.message || "Erreur");
    }
  };

  return (
    <div className="page quick-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Retour">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">Séance libre</h1>
          <p className="page-subtitle">Coche tes exos, l'ordre = ordre de sélection</p>
        </div>
      </header>

      {/* Search */}
      <div className="quick-search-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-search-icon" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="quick-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un exercice…"
        />
        {search && (
          <button className="quick-search-clear" onClick={() => setSearch("")} aria-label="Effacer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Group filter */}
      <div className="period-chips" role="tablist">
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

      {/* Selected order summary */}
      {selected.length > 0 && (
        <div className="quick-selected-block">
          <h3 className="logs-section-title" style={{ marginTop: 12 }}>
            Sélection ({selected.length})
          </h3>
          <div className="quick-selected-list">
            {selected.map((id, i) => {
              const ex = catalog.find((e) => e.id === id);
              if (!ex) return null;
              return (
                <div key={id} className="quick-selected-row">
                  <span className="quick-selected-num">{i + 1}</span>
                  <span className="quick-selected-name">{ex.name}</span>
                  <div className="quick-selected-actions">
                    <button
                      className="builder-icon-btn"
                      onClick={() => move(id, -1)}
                      disabled={i === 0}
                      aria-label="Monter"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      className="builder-icon-btn"
                      onClick={() => move(id, 1)}
                      disabled={i === selected.length - 1}
                      aria-label="Descendre"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      className="builder-icon-btn danger"
                      onClick={() => toggle(id)}
                      aria-label="Retirer"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Catalog */}
      <h3 className="logs-section-title" style={{ marginTop: 16 }}>
        Catalogue ({filtered.length})
      </h3>
      <div className="quick-catalog">
        {filtered.map((ex) => {
          const isSel = selected.includes(ex.id);
          const order = isSel ? selected.indexOf(ex.id) + 1 : null;
          const color = GROUP_COLORS[ex.muscleGroup] || GROUP_COLORS.Autre;
          return (
            <button
              key={ex.id}
              className={`quick-card ${isSel ? "selected" : ""}`}
              onClick={() => toggle(ex.id)}
            >
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
              <div className={`quick-card-check ${isSel ? "checked" : ""}`}>
                {isSel ? (
                  <span className="quick-card-order">{order}</span>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="empty-hint" style={{ textAlign: "center", padding: "24px 0" }}>
            Aucun exercice trouvé
          </p>
        )}
      </div>

      {error && <p className="builder-error">{error}</p>}

      {/* Sticky start bar */}
      <div className="builder-save-bar">
        <button className="builder-cancel-btn" onClick={() => navigate(-1)}>
          Annuler
        </button>
        <button
          className="builder-save-btn"
          onClick={handleStart}
          disabled={selected.length === 0}
        >
          Démarrer ({selected.length})
        </button>
      </div>
    </div>
  );
}
