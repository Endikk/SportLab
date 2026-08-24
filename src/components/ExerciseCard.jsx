import { useState } from "react";
import { getGradient, getIconPath } from "../utils/exerciseVisuals";
import ExerciseImage from "./ExerciseImage";
import ExerciseImageViewer from "./ExerciseImageViewer";

export default function ExerciseCard({ exercise, globalIndex, sectionTitle }) {
  const [showImage, setShowImage] = useState(false);

  const [c1, c2] = getGradient(sectionTitle);
  const iconD = getIconPath(exercise.name);

  return (
    <>
      <button
        className="exercise-card"
        onClick={() => exercise.image && setShowImage(true)}
        disabled={!exercise.image}
        aria-label={
          exercise.image
            ? `${exercise.name} — ${exercise.sets} × ${exercise.reps}. Voir la démonstration`
            : `${exercise.name} — ${exercise.sets} × ${exercise.reps}`
        }
      >
        <div className="exercise-number">{globalIndex}</div>
        <div
          className="exercise-thumb"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        >
          <ExerciseImage name={exercise.image} alt={exercise.name} className="exercise-thumb-img" />
          <svg viewBox="0 0 24 24" fill="white" opacity="0.7" width="26" height="26" className="exercise-thumb-fallback" aria-hidden="true">
            <path d={iconD} />
          </svg>
        </div>
        <div className="exercise-info">
          <h4 className="exercise-name">{exercise.name}</h4>
          <div className="exercise-details">
            <span>{exercise.sets} × {exercise.reps}</span>
            <span className="exercise-rest">{exercise.rest}</span>
          </div>
        </div>
        {exercise.image && (
          <div className="exercise-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </div>
        )}
      </button>

      {showImage && (
        <ExerciseImageViewer
          image={exercise.image}
          name={exercise.name}
          onClose={() => setShowImage(false)}
        />
      )}
    </>
  );
}
