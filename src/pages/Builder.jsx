import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  saveCustomSession,
  findSessionById,
  generateCustomSessionId,
  generateCustomExerciseId,
} from "../utils/storage";

const TYPES = [
  { id: "strength", label: "Force",     emoji: "FORCE" },
  { id: "cardio",   label: "Cardio",    emoji: "CARDIO" },
  { id: "mobility", label: "Mobilité",  emoji: "MOBI" },
  { id: "custom",   label: "Perso",     emoji: "PERSO" },
];

const GRADIENT_PRESETS = [
  { id: "orange", colors: ["#FF6B2C", "#FF8F52"] },
  { id: "blue",   colors: ["#2563EB", "#60A5FA"] },
  { id: "green",  colors: ["#059669", "#34D399"] },
  { id: "purple", colors: ["#7C3AED", "#A78BFA"] },
  { id: "cyan",   colors: ["#0EA5E9", "#22D3EE"] },
  { id: "pink",   colors: ["#BE185D", "#EC4899"] },
];

const KINDS = [
  { id: "sets-reps", label: "Séries × reps" },
  { id: "duration",  label: "Durée" },
  { id: "distance",  label: "Distance" },
];

function makeBlankExercise(sessionId) {
  return {
    id: generateCustomExerciseId(sessionId),
    name: "",
    sets: 3,
    reps: "10",
    rest: "1 min",
    kind: "sets-reps",
    notes: "",
  };
}

function makeBlankSection() {
  return { title: "EXERCICES", exercises: [] };
}

function loadInitialState(sessionId) {
  const existing = sessionId ? findSessionById(sessionId) : null;
  const isValidEdit = existing && existing.custom;
  const draftId = sessionId || generateCustomSessionId();

  if (!isValidEdit) {
    return {
      draftId,
      name: "",
      type: "strength",
      emoji: "",
      duration: "",
      muscleGroups: "",
      gradientId: "orange",
      sections: [makeBlankSection()],
      loadError: sessionId ? "Séance introuvable ou non modifiable" : null,
    };
  }

  const matchedGradient = existing.gradient
    ? GRADIENT_PRESETS.find(
        (p) => p.colors[0] === existing.gradient[0] && p.colors[1] === existing.gradient[1]
      )
    : null;

  return {
    draftId,
    name: existing.name || "",
    type: existing.type || "strength",
    emoji: existing.emoji || "",
    duration: existing.duration || "",
    muscleGroups: existing.muscleGroups || "",
    gradientId: matchedGradient?.id || "orange",
    sections: existing.sections?.length
      ? existing.sections.map((s) => ({
          title: s.title || "EXERCICES",
          exercises: (s.exercises || []).map((ex) => ({
            id: ex.id,
            name: ex.name || "",
            sets: Number(ex.sets) || 3,
            reps: String(ex.reps || "10"),
            rest: String(ex.rest || "1 min"),
            kind: ex.kind || "sets-reps",
            notes: ex.notes || "",
          })),
        }))
      : [makeBlankSection()],
    loadError: null,
  };
}

export default function Builder() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const isEdit = Boolean(sessionId);

  const [initial] = useState(() => loadInitialState(sessionId));
  const [draftId] = useState(initial.draftId);
  const [name, setName] = useState(initial.name);
  const [type, setType] = useState(initial.type);
  const [emoji, setEmoji] = useState(initial.emoji);
  const [duration, setDuration] = useState(initial.duration);
  const [muscleGroups, setMuscleGroups] = useState(initial.muscleGroups);
  const [gradientId, setGradientId] = useState(initial.gradientId);
  const [sections, setSections] = useState(initial.sections);
  const [error, setError] = useState(initial.loadError);

  const updateSection = useCallback((sIdx, patch) => {
    setSections((prev) => prev.map((sec, i) => (i === sIdx ? { ...sec, ...patch } : sec)));
  }, []);

  const updateExercise = useCallback((sIdx, eIdx, patch) => {
    setSections((prev) =>
      prev.map((sec, i) => {
        if (i !== sIdx) return sec;
        const exercises = sec.exercises.map((ex, j) => (j === eIdx ? { ...ex, ...patch } : ex));
        return { ...sec, exercises };
      })
    );
  }, []);

  const addExercise = (sIdx) => {
    setSections((prev) =>
      prev.map((sec, i) =>
        i === sIdx ? { ...sec, exercises: [...sec.exercises, makeBlankExercise(draftId)] } : sec
      )
    );
  };

  const removeExercise = (sIdx, eIdx) => {
    setSections((prev) =>
      prev.map((sec, i) => {
        if (i !== sIdx) return sec;
        return { ...sec, exercises: sec.exercises.filter((_, j) => j !== eIdx) };
      })
    );
  };

  const addSection = () => {
    setSections((prev) => [...prev, { title: "GROUPE " + (prev.length + 1), exercises: [] }]);
  };

  const removeSection = (sIdx) => {
    setSections((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== sIdx)));
  };

  const moveExercise = (sIdx, eIdx, dir) => {
    setSections((prev) =>
      prev.map((sec, i) => {
        if (i !== sIdx) return sec;
        const target = eIdx + dir;
        if (target < 0 || target >= sec.exercises.length) return sec;
        const arr = [...sec.exercises];
        [arr[eIdx], arr[target]] = [arr[target], arr[eIdx]];
        return { ...sec, exercises: arr };
      })
    );
  };

  const moveSection = (sIdx, dir) => {
    setSections((prev) => {
      const target = sIdx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const arr = [...prev];
      [arr[sIdx], arr[target]] = [arr[target], arr[sIdx]];
      return arr;
    });
  };

  const handleSave = () => {
    setError(null);
    if (!name.trim()) {
      setError("Donne un nom à ta séance");
      return;
    }
    const totalExos = sections.reduce((acc, s) => acc + s.exercises.length, 0);
    if (totalExos === 0) {
      setError("Ajoute au moins un exercice");
      return;
    }
    const cleanedSections = sections
      .map((sec) => ({
        title: (sec.title || "EXERCICES").trim().toUpperCase().slice(0, 40),
        exercises: sec.exercises
          .filter((ex) => ex.name.trim())
          .map((ex) => ({
            id: ex.id,
            name: ex.name.trim(),
            sets: Math.max(1, Math.min(10, Number(ex.sets) || 3)),
            reps: ex.reps.trim() || "10",
            rest: ex.rest.trim() || "1 min",
            kind: ex.kind || "sets-reps",
            notes: ex.notes.trim().slice(0, 200),
          })),
      }))
      .filter((sec) => sec.exercises.length > 0);

    if (!cleanedSections.length) {
      setError("Ajoute au moins un exercice avec un nom");
      return;
    }

    try {
      saveCustomSession({
        id: draftId,
        name: name.trim(),
        type,
        emoji: emoji.trim().toUpperCase(),
        gradient: GRADIENT_PRESETS.find((p) => p.id === gradientId)?.colors || null,
        muscleGroups: muscleGroups.trim(),
        duration: duration.trim(),
        sections: cleanedSections,
      });
      navigate("/");
    } catch (e) {
      setError(e.message || "Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="page builder-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Retour">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">{isEdit ? "Modifier" : "Nouvelle séance"}</h1>
          <p className="page-subtitle">Crée ta propre séance</p>
        </div>
      </header>

      <div className="builder-section">
        <label className="builder-label">Nom de la séance</label>
        <input
          className="builder-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Cardio matin, Stretching, Full body…"
          maxLength={50}
        />
      </div>

      <div className="builder-section">
        <label className="builder-label">Type</label>
        <div className="builder-chips">
          {TYPES.map((t) => (
            <button
              key={t.id}
              className={`builder-chip ${type === t.id ? "active" : ""}`}
              onClick={() => setType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="builder-row">
        <div className="builder-section" style={{ flex: 1 }}>
          <label className="builder-label">Étiquette (3–6 lettres)</label>
          <input
            className="builder-input"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value.slice(0, 6).toUpperCase())}
            placeholder="MATIN"
          />
        </div>
        <div className="builder-section" style={{ flex: 1 }}>
          <label className="builder-label">Durée estimée</label>
          <input
            className="builder-input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="~30 min"
            maxLength={20}
          />
        </div>
      </div>

      <div className="builder-section">
        <label className="builder-label">Couleur</label>
        <div className="builder-gradients">
          {GRADIENT_PRESETS.map((p) => (
            <button
              key={p.id}
              className={`builder-gradient ${gradientId === p.id ? "active" : ""}`}
              style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
              onClick={() => setGradientId(p.id)}
              aria-label={p.id}
            />
          ))}
        </div>
      </div>

      <div className="builder-section">
        <label className="builder-label">Groupes musculaires (optionnel)</label>
        <input
          className="builder-input"
          value={muscleGroups}
          onChange={(e) => setMuscleGroups(e.target.value)}
          placeholder="Ex: Cardio, Pectoraux, Abdos…"
          maxLength={60}
        />
      </div>

      {/* Sections d'exercices */}
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="builder-block">
          <div className="builder-block-header">
            <input
              className="builder-input builder-section-title-input"
              value={section.title}
              onChange={(e) => updateSection(sIdx, { title: e.target.value })}
              placeholder="GROUPE"
              maxLength={30}
            />
            {sections.length > 1 && (
              <div className="builder-reorder">
                <button
                  className="builder-icon-btn"
                  onClick={() => moveSection(sIdx, -1)}
                  aria-label="Monter le groupe"
                  disabled={sIdx === 0}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </button>
                <button
                  className="builder-icon-btn"
                  onClick={() => moveSection(sIdx, 1)}
                  aria-label="Descendre le groupe"
                  disabled={sIdx === sections.length - 1}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <button
                  className="builder-icon-btn danger"
                  onClick={() => removeSection(sIdx)}
                  aria-label="Supprimer le groupe"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {section.exercises.length === 0 ? (
            <p className="builder-empty">Aucun exercice. Ajoute-en un ci-dessous.</p>
          ) : (
            section.exercises.map((ex, eIdx) => (
              <div key={ex.id} className="builder-exercise">
                <div className="builder-exercise-row">
                  <input
                    className="builder-input"
                    value={ex.name}
                    onChange={(e) => updateExercise(sIdx, eIdx, { name: e.target.value })}
                    placeholder="Nom de l'exercice"
                    maxLength={60}
                  />
                  <div className="builder-reorder">
                    <button
                      className="builder-icon-btn"
                      onClick={() => moveExercise(sIdx, eIdx, -1)}
                      aria-label="Monter l'exercice"
                      disabled={eIdx === 0}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      className="builder-icon-btn"
                      onClick={() => moveExercise(sIdx, eIdx, 1)}
                      aria-label="Descendre l'exercice"
                      disabled={eIdx === section.exercises.length - 1}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      className="builder-icon-btn danger"
                      onClick={() => removeExercise(sIdx, eIdx)}
                      aria-label="Supprimer l'exercice"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="builder-chips builder-chips-sm">
                  {KINDS.map((k) => (
                    <button
                      key={k.id}
                      className={`builder-chip sm ${ex.kind === k.id ? "active" : ""}`}
                      onClick={() => updateExercise(sIdx, eIdx, { kind: k.id })}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>

                <div className="builder-exercise-grid">
                  <div>
                    <label className="builder-label-xs">Séries</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="10"
                      className="builder-input"
                      value={ex.sets}
                      onChange={(e) => updateExercise(sIdx, eIdx, { sets: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="builder-label-xs">
                      {ex.kind === "duration" ? "Durée" : ex.kind === "distance" ? "Distance" : "Reps"}
                    </label>
                    <input
                      className="builder-input"
                      value={ex.reps}
                      onChange={(e) => updateExercise(sIdx, eIdx, { reps: e.target.value })}
                      placeholder={
                        ex.kind === "duration" ? "30s" : ex.kind === "distance" ? "1 km" : "10"
                      }
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label className="builder-label-xs">Repos</label>
                    <input
                      className="builder-input"
                      value={ex.rest}
                      onChange={(e) => updateExercise(sIdx, eIdx, { rest: e.target.value })}
                      placeholder="1 min"
                      maxLength={20}
                    />
                  </div>
                </div>

                <input
                  className="builder-input builder-input-sm"
                  value={ex.notes}
                  onChange={(e) => updateExercise(sIdx, eIdx, { notes: e.target.value })}
                  placeholder="Notes (optionnel)"
                  maxLength={120}
                />
              </div>
            ))
          )}

          <button className="builder-add-btn" onClick={() => addExercise(sIdx)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Ajouter un exercice</span>
          </button>
        </div>
      ))}

      <button className="builder-add-section" onClick={addSection}>
        + Ajouter un groupe (ex : Échauffement, Cardio…)
      </button>

      {error && <p className="builder-error">{error}</p>}

      <div className="builder-save-bar">
        <button className="builder-cancel-btn" onClick={() => navigate(-1)}>
          Annuler
        </button>
        <button className="builder-save-btn" onClick={handleSave}>
          {isEdit ? "Enregistrer" : "Créer la séance"}
        </button>
      </div>
    </div>
  );
}
