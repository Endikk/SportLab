import { useNavigate } from "react-router-dom";
import { getLastLogForExercise } from "../utils/storage";

export default function ExerciseCard({ exercise, index }) {
  const navigate = useNavigate();
  const lastLog = getLastLogForExercise(exercise.id);
  const lastWeight = lastLog?.sets?.[0]?.weight;

  return (
    <div className="exercise-card" onClick={() => navigate(`/history/${exercise.id}`)}>
      <div className="exercise-number">{index + 1}</div>
      <div className="exercise-image-container">
        <img
          src={`/images/exercises/${exercise.image}`}
          alt={exercise.name}
          className="exercise-image"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className="exercise-image-placeholder" style={{ display: "none" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.5 6.5h-3v11h3v-11zM17.5 6.5h3v11h-3v-11zM6.5 10.5h11v3h-11z" />
          </svg>
        </div>
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
            Dernier : {lastWeight} kg
          </div>
        )}
      </div>
      <div className="exercise-arrow">›</div>
    </div>
  );
}
