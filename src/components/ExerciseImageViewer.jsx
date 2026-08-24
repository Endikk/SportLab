import { useEffect } from "react";
import ExerciseImage from "./ExerciseImage";

// Visionneuse plein écran du GIF d'un exercice.
// Extraite de Workout.jsx pour être partagée avec la page Exos.
export default function ExerciseImageViewer({ image, name, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    // Empêche la page derrière de scroller pendant que la visionneuse est ouverte
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      className="image-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`Démonstration : ${name}`}
      onClick={onClose}
    >
      <button className="image-viewer-close" onClick={onClose} aria-label="Fermer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* stopPropagation : regarder le GIF ne doit pas fermer la visionneuse */}
      <div className="image-viewer-stage" onClick={(e) => e.stopPropagation()}>
        <ExerciseImage name={image} alt={`Démonstration de ${name}`} className="image-viewer-img" />
        <p className="image-viewer-name">{name}</p>
      </div>
    </div>
  );
}
