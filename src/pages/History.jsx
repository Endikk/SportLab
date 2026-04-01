import { useParams, useNavigate } from "react-router-dom";
import { program } from "../data/program";
import { getExerciseHistory } from "../utils/storage";

function findExercise(id) {
  for (const session of program.sessions) {
    for (const section of session.sections) {
      const ex = section.exercises.find((e) => e.id === id);
      if (ex) return ex;
    }
  }
  return null;
}

export default function History() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = findExercise(exerciseId);
  const history = getExerciseHistory(exerciseId);

  if (!exercise) {
    return (
      <div className="page">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate("/")} aria-label="Retour">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="page-title">Exercice introuvable</h1>
        </header>
      </div>
    );
  }

  const maxWeight = history.reduce((max, h) => {
    const w = Math.max(...h.sets.map((s) => Number(s.weight) || 0));
    return w > max ? w : max;
  }, 0);

  return (
    <div className="page history-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Retour">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">{exercise.name}</h1>
          <p className="page-subtitle">Historique</p>
        </div>
      </header>

      <div className="exercise-detail-card">
        <div className="detail-row">
          <span>Séries × Reps</span>
          <strong>{exercise.sets} × {exercise.reps}</strong>
        </div>
        <div className="detail-row">
          <span>Repos</span>
          <strong>{exercise.rest}</strong>
        </div>
        <div className="detail-row">
          <span>Notes</span>
          <strong>{exercise.notes}</strong>
        </div>
        {maxWeight > 0 && (
          <div className="detail-row highlight">
            <span>Record</span>
            <strong>{maxWeight} kg</strong>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" aria-hidden="true">
            <path d="M6.5 6.5h-3v11h3v-11zM17.5 6.5h3v11h-3v-11zM6.5 10.5h11v3h-11z" />
          </svg>
          <p>Aucun historique pour cet exercice.</p>
          <p className="empty-hint">Lance une séance pour commencer le suivi !</p>
        </div>
      ) : (
        <div className="history-list">
          <h3 className="section-title">Séances précédentes</h3>
          {history.slice().reverse().map((entry, i) => (
            <div key={i} className="history-entry">
              <div className="history-date">
                {new Date(entry.date + "T12:00:00").toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="history-sets">
                {entry.sets.map((set, j) => (
                  <span key={j} className="history-set">
                    {set.weight || "–"}kg × {set.reps || "–"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
