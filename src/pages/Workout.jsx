import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { program } from "../data/program";
import { getLastLogForExercise, saveSessionLog } from "../utils/storage";

const AUTOSAVE_KEY = "sportlab_workout_progress";

function loadProgress(sessionId) {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.sessionId === sessionId ? data.exerciseLogs : null;
  } catch {
    return null;
  }
}

function saveProgress(sessionId, exerciseLogs) {
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ sessionId, exerciseLogs }));
}

function clearProgress() {
  localStorage.removeItem(AUTOSAVE_KEY);
}

export default function Workout() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = program.sessions.find((s) => s.id === sessionId);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [saved, setSaved] = useState(false);

  const allExercises = session
    ? session.sections.flatMap((s) => s.exercises)
    : [];

  useEffect(() => {
    if (!session) return;

    const restored = loadProgress(sessionId);
    if (restored) {
      setExerciseLogs(restored);
      return;
    }

    const initial = {};
    for (const ex of allExercises) {
      const last = getLastLogForExercise(ex.id);
      const sets = [];
      for (let i = 0; i < ex.sets; i++) {
        sets.push({
          weight: last?.sets?.[i]?.weight ?? "",
          reps: last?.sets?.[i]?.reps ?? "",
          done: false,
        });
      }
      initial[ex.id] = { sets };
    }
    setExerciseLogs(initial);
  }, [sessionId]);

  useEffect(() => {
    if (Object.keys(exerciseLogs).length > 0 && !saved) {
      saveProgress(sessionId, exerciseLogs);
    }
  }, [exerciseLogs, sessionId, saved]);

  if (!session) {
    return (
      <div className="page">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate("/")} aria-label="Retour">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="page-title">Séance introuvable</h1>
        </header>
      </div>
    );
  }

  const updateSet = useCallback((exerciseId, setIndex, field, value) => {
    setExerciseLogs((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exerciseId].sets];
      sets[setIndex] = { ...sets[setIndex], [field]: value };
      updated[exerciseId] = { ...updated[exerciseId], sets };
      return updated;
    });
  }, []);

  const toggleDone = useCallback((exerciseId, setIndex) => {
    setExerciseLogs((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exerciseId].sets];
      sets[setIndex] = { ...sets[setIndex], done: !sets[setIndex].done };
      updated[exerciseId] = { ...updated[exerciseId], sets };
      return updated;
    });
  }, []);

  const handleSave = () => {
    const today = new Date().toLocaleDateString("fr-CA");
    saveSessionLog(today, sessionId, exerciseLogs);
    clearProgress();
    setSaved(true);
    setTimeout(() => navigate("/"), 1200);
  };

  const completedSets = Object.values(exerciseLogs).reduce(
    (acc, ex) => acc + (ex.sets?.filter((s) => s.done).length ?? 0),
    0
  );
  const totalSets = allExercises.reduce((acc, ex) => acc + ex.sets, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="page workout-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(`/session/${sessionId}`)} aria-label="Retour">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">{session.name}</h1>
          <p className="page-subtitle">
            {completedSets}/{totalSets} séries
          </p>
        </div>
      </header>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {session.warmup && (
        <div className="tip-banner">
          <span className="tip-icon" aria-hidden="true">💡</span>
          <p>{session.warmup}</p>
        </div>
      )}

      {session.sections.map((section) => (
        <div key={section.title} className="workout-section">
          <h3 className="exercise-section-title">{section.title}</h3>
          {section.exercises.map((exercise) => (
            <div key={exercise.id} className="workout-exercise">
              <div className="workout-exercise-header">
                <h4>{exercise.name}</h4>
                <span className="workout-reps-target">{exercise.reps} reps</span>
              </div>
              <p className="exercise-notes">{exercise.notes}</p>
              <div className="sets-grid">
                <div className="sets-header">
                  <span>Série</span>
                  <span>Kg</span>
                  <span>Reps</span>
                  <span></span>
                </div>
                {exerciseLogs[exercise.id]?.sets.map((set, i) => (
                  <div
                    key={i}
                    className={`set-row ${set.done ? "set-done" : ""}`}
                  >
                    <span className="set-number">{i + 1}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="set-input"
                      placeholder="kg"
                      min="0"
                      max="500"
                      step="0.5"
                      value={set.weight}
                      aria-label={`Poids série ${i + 1}`}
                      onChange={(e) =>
                        updateSet(exercise.id, i, "weight", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      className="set-input"
                      placeholder="reps"
                      min="0"
                      max="100"
                      step="1"
                      value={set.reps}
                      aria-label={`Reps série ${i + 1}`}
                      onChange={(e) =>
                        updateSet(exercise.id, i, "reps", e.target.value)
                      }
                    />
                    <button
                      className={`check-btn ${set.done ? "checked" : ""}`}
                      onClick={() => toggleDone(exercise.id, i)}
                      aria-label={`Valider série ${i + 1}`}
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <button
        className={`save-workout-btn ${saved ? "saved" : ""}`}
        onClick={handleSave}
        disabled={saved}
      >
        {saved ? "Séance enregistrée ✓" : "Enregistrer la séance"}
      </button>
    </div>
  );
}
