import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLastLogForExercise } from "../utils/storage";

export default function ExerciseCard({ exercise, globalIndex }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const lastLog = getLastLogForExercise(exercise.id);
  const lastWeight = lastLog?.sets?.[0]?.weight;
  const lastDate = lastLog?.timestamp
    ? new Date(lastLog.timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null;

  return (
    <div
      className="exercise-card"
      onClick={() => navigate(`/history/${exercise.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`${exercise.name} — ${exercise.sets} × ${exercise.reps}`}
    >
      <div className="exercise-number">{globalIndex}</div>
      <div className="exercise-image-container">
        {!imgError ? (
          <img
            src={`/images/exercises/${exercise.image}`}
            alt={exercise.name}
            className="exercise-image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="exercise-image-placeholder">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6.5 6.5h-3v11h3v-11zM17.5 6.5h3v11h-3v-11zM6.5 10.5h11v3h-11z" />
            </svg>
          </div>
        )}
      </div>
      <div className="exercise-info">
        <h4 className="exercise-name">{exercise.name}</h4>
        <div className="exercise-details">
          <span>{exercise.sets} × {exercise.reps}</span>
          <span className="exercise-rest">{exercise.rest}</span>
        </div>
        <p className="exercise-notes">{exercise.notes}</p>
        {lastWeight && (
          <div className="exercise-last-weight">
            Dernier{lastDate ? ` (${lastDate})` : ""} : {lastWeight} kg
          </div>
        )}
      </div>
      <div className="exercise-arrow" aria-hidden="true">›</div>
    </div>
  );
}
