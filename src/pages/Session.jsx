import { useParams, useNavigate } from "react-router-dom";
import { program } from "../data/program";
import ExerciseCard from "../components/ExerciseCard";

export default function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = program.sessions.find((s) => s.id === sessionId);

  if (!session) return <div className="page">Séance introuvable</div>;

  const totalExercises = session.sections.reduce(
    (acc, s) => acc + s.exercises.length,
    0
  );

  return (
    <div className="page session-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">{session.name}</h1>
          <p className="page-subtitle">{session.muscleGroups} • {session.duration}</p>
        </div>
      </header>

      <div className="session-stats">
        <div className="stat">
          <span className="stat-value">{totalExercises}</span>
          <span className="stat-label">Exercices</span>
        </div>
        <div className="stat">
          <span className="stat-value">{session.sections.length}</span>
          <span className="stat-label">Groupes</span>
        </div>
      </div>

      {session.warmup && (
        <div className="tip-banner">
          <span className="tip-icon">💡</span>
          <p>{session.warmup}</p>
        </div>
      )}

      <button
        className="start-workout-btn"
        onClick={() => navigate(`/workout/${sessionId}`)}
      >
        Démarrer la séance
      </button>

      {session.sections.map((section) => (
        <div key={section.title} className="exercise-section">
          <h3 className="exercise-section-title">{section.title}</h3>
          {section.exercises.map((exercise, i) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
          ))}
        </div>
      ))}
    </div>
  );
}
