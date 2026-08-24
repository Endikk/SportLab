import { useMemo, useState } from "react";
import { ACTIVE_PROGRAM, getMuscleGroupForSection } from "../utils/storage";
import { getSessionVisual, muscleColors } from "../utils/exerciseVisuals";
import ExerciseImage from "../components/ExerciseImage";
import ExerciseImageViewer from "../components/ExerciseImageViewer";

// On lit le programme directement plutôt que getExerciseCatalog() : ce dernier
// déduplique par nom et retrie par muscle, ce qui perdrait l'ordre des séances et
// masquerait les exos présents dans deux séances (ex. le leg extension).
function buildGroups() {
  return ACTIVE_PROGRAM.sessions.map((session) => ({
    id: session.id,
    name: session.name,
    day: session.day,
    visual: getSessionVisual(session.id),
    exercises: (session.sections || []).flatMap((section) =>
      (section.exercises || []).map((ex) => ({
        ...ex,
        muscleGroup: getMuscleGroupForSection(section.title),
      }))
    ),
  }));
}

export default function Exercises() {
  const groups = useMemo(() => buildGroups(), []);
  const [viewing, setViewing] = useState(null);

  const total = groups.reduce((acc, g) => acc + g.exercises.length, 0);

  return (
    <div className="page exos-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Exercices</h1>
          <p className="page-subtitle">{total} exercices · appuie pour voir la démo</p>
        </div>
      </header>

      {groups.map((group) => (
        <section key={group.id} className="exos-group">
          <div
            className="exos-group-header"
            style={{ background: `linear-gradient(135deg, ${group.visual.gradient[0]}, ${group.visual.gradient[1]})` }}
          >
            <svg viewBox="0 0 24 24" className="exos-group-icon" fill="white" opacity="0.18" aria-hidden="true">
              <path d={group.visual.icon} />
            </svg>
            <div className="exos-group-titles">
              <span className="exos-group-name">{group.visual.emoji}</span>
              <span className="exos-group-meta">
                {group.day} · {group.exercises.length} exos
              </span>
            </div>
          </div>

          <div className="exos-list">
            {group.exercises.map((ex) => {
              const color = muscleColors[ex.muscleGroup] || muscleColors.Autre;
              return (
                <button
                  key={ex.id}
                  className="quick-card"
                  onClick={() => setViewing(ex)}
                  aria-label={`Voir la démonstration de ${ex.name}`}
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
                  <span className="exos-card-zoom" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {viewing && (
        <ExerciseImageViewer
          image={viewing.image}
          name={viewing.name}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
