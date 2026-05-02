import { useNavigate } from "react-router-dom";
import { getLastLogForExercise, isBodyweightExercise } from "../utils/storage";
import { getGradient, getIconPath } from "../utils/exerciseVisuals";
import ExerciseImage from "./ExerciseImage";

export default function ExerciseCard({ exercise, globalIndex, sectionTitle }) {
  const navigate = useNavigate();
  const lastLog = getLastLogForExercise(exercise.id);
  const lastWeight = lastLog?.sets?.[0]?.weight;
  const lastReps = lastLog?.sets?.[0]?.reps;
  const lastDate = lastLog?.timestamp
    ? new Date(lastLog.timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null;
  const lastDoneAtBodyweight = lastLog && !lastWeight && lastReps && isBodyweightExercise(exercise.name);

  const [c1, c2] = getGradient(sectionTitle);
  const iconD = getIconPath(exercise.name);

  return (
    <div
      className="exercise-card"
      onClick={() => navigate(`/history/${exercise.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`${exercise.name} — ${exercise.sets} × ${exercise.reps}`}
    >
      <div className="exercise-number">{globalIndex}</div>
      <div
        className="exercise-thumb"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      >
        <ExerciseImage name={exercise.image} alt={exercise.name} className="exercise-thumb-img" />
        <svg viewBox="0 0 24 24" fill="white" opacity="0.7" width="26" height="26" className="exercise-thumb-fallback">
          <path d={iconD} />
        </svg>
      </div>
      <div className="exercise-info">
        <h4 className="exercise-name">{exercise.name}</h4>
        <div className="exercise-details">
          <span>{exercise.sets} × {exercise.reps}</span>
          <span className="exercise-rest">{exercise.rest}</span>
        </div>
        {lastWeight && (
          <div className="exercise-last-weight">
            Dernier{lastDate ? ` (${lastDate})` : ""} : {lastWeight} kg
          </div>
        )}
        {lastDoneAtBodyweight && (
          <div className="exercise-last-weight">
            Dernier{lastDate ? ` (${lastDate})` : ""} : PC × {lastReps}
          </div>
        )}
      </div>
      <div className="exercise-arrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  );
}
