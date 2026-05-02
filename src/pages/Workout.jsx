import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLastLogForExercise,
  saveSessionLog,
  parseMaxReps,
  parseRestSeconds,
  findSessionById,
  saveBodyweight,
  getLatestBodyweight,
  suggestNextWeight,
  compareWithPreviousSession,
  getExerciseNote,
  saveExerciseNote,
  isBodyweightExercise,
} from "../utils/storage";
import { getGradient, getIconPath } from "../utils/exerciseVisuals";
import ExerciseImage from "../components/ExerciseImage";
import RestTimer from "../components/RestTimer";
import ExerciseCatalogPicker from "../components/ExerciseCatalogPicker";

const RPE_VALUES = [6, 7, 8, 9, 10];

function isBodyweightStale(latest) {
  if (!latest) return true;
  const last = new Date(latest.date + "T12:00:00").getTime();
  return Date.now() - last > 7 * 86400000;
}

const AUTOSAVE_KEY = "sportlab_workout_progress";

function loadProgress(sessionId) {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.sessionId !== sessionId) return null;
    return data;
  } catch {
    return null;
  }
}

function saveProgressData(sessionId, exerciseLogs, exerciseIdx, exerciseOrder, startedAt) {
  localStorage.setItem(
    AUTOSAVE_KEY,
    JSON.stringify({ sessionId, exerciseLogs, exerciseIdx, exerciseOrder, startedAt })
  );
}

function fmtDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function clearProgress() {
  localStorage.removeItem(AUTOSAVE_KEY);
}

function findSection(session, exerciseId) {
  for (const section of session.sections) {
    if (section.exercises.some((e) => e.id === exerciseId)) return section;
  }
  return null;
}

export default function Workout() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = findSessionById(sessionId);

  const baseExercises = session ? session.sections.flatMap((s) => s.exercises) : [];

  // Extras piochés dans le catalogue pendant la séance (ajoutent des exos en fin)
  const [extraExercises, setExtraExercises] = useState([]);
  const allExercises = [...baseExercises, ...extraExercises];

  const [exerciseLogs, setExerciseLogs] = useState({});
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [exerciseOrder, setExerciseOrder] = useState(() => baseExercises.map((_, i) => i));
  const [saved, setSaved] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [exitDir, setExitDir] = useState(null);
  const [cardKey, setCardKey] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [skipToast, setSkipToast] = useState(null);

  // P4 — qualité de vie
  const [restTimerKey, setRestTimerKey] = useState(0); // change pour redémarrer le timer
  const [restTimerSec, setRestTimerSec] = useState(0); // 0 = inactif
  const [openRpeFor, setOpenRpeFor] = useState(null); // "exId-i" si popup ouvert
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");
  const [bwInput, setBwInput] = useState("");
  const [askBw] = useState(() => isBodyweightStale(getLatestBodyweight()));

  // Phase B — chrono + suggestions
  const [startedAt, setStartedAt] = useState(() => {
    const restored = loadProgress(sessionId);
    return restored?.startedAt || Date.now();
  });
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [suggestions, setSuggestions] = useState({}); // exId → suggestion
  const [comparison, setComparison] = useState(null);

  // Phase C — note par exercice
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [notesVersion, setNotesVersion] = useState(0);

  // Extras — modale catalogue
  const [showCatalog, setShowCatalog] = useState(false);

  const handlePickExtra = (exercise) => {
    // Si déjà dans la séance : on navigue vers cet exo
    if (exerciseLogs[exercise.id]) {
      const idxInAll = allExercises.findIndex((e) => e.id === exercise.id);
      const orderIdx = exerciseOrder.indexOf(idxInAll);
      if (orderIdx >= 0) {
        setExerciseIdx(orderIdx);
        setAllDone(false);
        setShowCatalog(false);
        setCardKey((k) => k + 1);
      }
      return;
    }

    // Init des sets pour ce nouvel exo (avec last log si dispo)
    const last = getLastLogForExercise(exercise.id);
    const maxReps = parseMaxReps(exercise.reps);
    const sets = [];
    const numSets = Number(exercise.sets) || 3;
    for (let i = 0; i < numSets; i++) {
      sets.push({
        weight: last?.sets?.[i]?.weight ?? "",
        reps: maxReps !== null ? String(maxReps) : exercise.reps || "",
        done: false,
      });
    }

    // Le nouvel exo s'insère à la fin de allExercises
    const newIndexInAll = allExercises.length;

    setExtraExercises((prev) => [...prev, exercise]);
    setExerciseLogs((prev) => ({ ...prev, [exercise.id]: { sets } }));
    setExerciseOrder((prev) => [...prev, newIndexInAll]);
    setExerciseIdx(exerciseOrder.length); // dernier index dans le nouveau order
    setAllDone(false);
    setShowCatalog(false);
    setCardKey((k) => k + 1);
  };

  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping = useRef(false);
  const isAnimating = useRef(false);

  // ─── Initialize ───
  useEffect(() => {
    if (!session) return;

    const restored = loadProgress(sessionId);
    if (restored?.exerciseLogs) {
      setExerciseLogs(restored.exerciseLogs);
      setExerciseIdx(restored.exerciseIdx ?? 0);
      if (restored.exerciseOrder) setExerciseOrder(restored.exerciseOrder);
      if (restored.startedAt) setStartedAt(restored.startedAt);
      return;
    }

    const initial = {};
    const sugg = {};
    for (const ex of allExercises) {
      const last = getLastLogForExercise(ex.id);
      const maxReps = parseMaxReps(ex.reps);
      const suggestion = suggestNextWeight(ex.id, maxReps);
      if (suggestion) sugg[ex.id] = suggestion;

      const initialWeight =
        suggestion?.suggestedWeight != null
          ? String(suggestion.suggestedWeight)
          : (last?.sets?.[0]?.weight ?? "");

      const sets = [];
      for (let i = 0; i < ex.sets; i++) {
        sets.push({
          weight: i === 0 ? initialWeight : (last?.sets?.[i]?.weight ?? initialWeight),
          reps: maxReps !== null ? String(maxReps) : ex.reps || "",
          done: false,
        });
      }
      initial[ex.id] = { sets };
    }
    setExerciseLogs(initial);
    setSuggestions(sugg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // ─── Ordered exercises ───
  const orderedExercises = exerciseOrder.map((i) => allExercises[i]);

  // ─── Autosave ───
  useEffect(() => {
    if (Object.keys(exerciseLogs).length > 0 && !saved) {
      saveProgressData(sessionId, exerciseLogs, exerciseIdx, exerciseOrder, startedAt);
    }
  }, [exerciseLogs, sessionId, saved, exerciseIdx, exerciseOrder, startedAt]);

  // ─── Set updaters (hooks must be before any early return) ───
  const updateField = useCallback((exerciseId, si, field, value) => {
    setExerciseLogs((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exerciseId].sets];
      const oldValue = sets[si][field];
      sets[si] = { ...sets[si], [field]: value };

      // If changing weight on set 1, propagate to sets below
      // that still have the old value (not manually edited)
      if (field === "weight" && si === 0) {
        for (let j = 1; j < sets.length; j++) {
          if (sets[j].weight === oldValue) {
            sets[j] = { ...sets[j], weight: value };
          }
        }
      }

      updated[exerciseId] = { ...updated[exerciseId], sets };
      return updated;
    });
  }, []);

  const adjustReps = useCallback((exerciseId, si, delta) => {
    setExerciseLogs((prev) => {
      const current = parseInt(prev[exerciseId]?.sets?.[si]?.reps) || 0;
      const updated = { ...prev };
      const sets = [...updated[exerciseId].sets];
      sets[si] = { ...sets[si], reps: String(Math.max(0, current + delta)) };
      updated[exerciseId] = { ...updated[exerciseId], sets };
      return updated;
    });
  }, []);

  const toggleDone = useCallback((exerciseId, si, restStr) => {
    let nowDone = false;
    setExerciseLogs((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exerciseId].sets];
      const next = !sets[si].done;
      nowDone = next;
      sets[si] = { ...sets[si], done: next };
      updated[exerciseId] = { ...updated[exerciseId], sets };
      return updated;
    });
    // Lancer le timer de repos quand un set vient d'être validé
    if (nowDone) {
      setRestTimerSec(parseRestSeconds(restStr));
      setRestTimerKey((k) => k + 1);
    }
  }, []);

  const setRpe = useCallback((exerciseId, si, value) => {
    setExerciseLogs((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exerciseId].sets];
      sets[si] = { ...sets[si], rpe: value };
      updated[exerciseId] = { ...updated[exerciseId], sets };
      return updated;
    });
    setOpenRpeFor(null);
  }, []);

  const isLast = exerciseIdx === orderedExercises.length - 1;

  const goNext = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setExitDir("right");
    setTimeout(() => {
      setExitDir(null);
      setSwipeOffset(0);
      isAnimating.current = false;
      if (isLast) {
        setAllDone(true);
      } else {
        setExerciseIdx((i) => i + 1);
      }
      setCardKey((k) => k + 1);
    }, 280);
  }, [isLast]);

  const goPrev = useCallback(() => {
    if (isAnimating.current || exerciseIdx === 0) return;
    isAnimating.current = true;
    setExitDir("left");
    setTimeout(() => {
      setExitDir(null);
      setSwipeOffset(0);
      isAnimating.current = false;
      setExerciseIdx((i) => i - 1);
      setCardKey((k) => k + 1);
    }, 280);
  }, [exerciseIdx]);

  // ─── Calcul du comparateur quand on arrive sur l'écran allDone ───
  useEffect(() => {
    if (allDone && !comparison) {
      setComparison(compareWithPreviousSession(sessionId, exerciseLogs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  // ─── Not found ───
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

  const currentExercise = orderedExercises[exerciseIdx];
  const currentSection = findSection(session, currentExercise?.id);
  const currentSets = exerciseLogs[currentExercise?.id]?.sets;

  // ─── Touch handlers ───
  const handleTouchStart = (e) => {
    if (isAnimating.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    if (isAnimating.current || touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (!isSwiping.current) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        isSwiping.current = true;
      } else if (Math.abs(dy) > 10) {
        touchStartX.current = null;
        return;
      }
    }

    if (isSwiping.current) {
      e.preventDefault();
      setSwipeOffset(dx);
    }
  };

  const handleTouchEnd = () => {
    if (isSwiping.current && Math.abs(swipeOffset) > 80) {
      if (swipeOffset > 0) {
        goNext();
        return;
      } else {
        goPrev();
        return;
      }
    }
    setSwipeOffset(0);
    touchStartX.current = null;
  };

  // ─── Save ───
  const handleSave = () => {
    const today = new Date().toLocaleDateString("fr-CA");
    const meta = {};
    if (mood) meta.mood = mood;
    if (note.trim()) meta.note = note.trim();
    const bw = parseFloat(bwInput.replace(",", "."));
    if (isFinite(bw) && bw > 0 && bw < 400) {
      meta.bodyweight = bw;
      saveBodyweight(today, bw);
    }
    const durationMin = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    if (durationMin > 0 && durationMin < 600) meta.durationMin = durationMin;

    saveSessionLog(today, sessionId, exerciseLogs, meta);
    clearProgress();
    setSaved(true);
  };

  // ─── Cancel session ───
  const handleCancelRequest = () => setShowCancelModal(true);

  const handleCancelSave = () => {
    // Keep autosave progress so the session can be resumed from Home
    navigate("/");
  };

  const handleCancelDiscard = () => {
    clearProgress();
    navigate("/");
  };

  // ─── Skip / defer exercise ───
  const handleSkip = () => {
    if (isAnimating.current || isLast) return;
    const skippedName = orderedExercises[exerciseIdx]?.name;
    isAnimating.current = true;
    setExitDir("right");
    setTimeout(() => {
      setExerciseOrder((prev) => {
        const updated = [...prev];
        const temp = updated[exerciseIdx];
        updated[exerciseIdx] = updated[exerciseIdx + 1];
        updated[exerciseIdx + 1] = temp;
        return updated;
      });
      setExitDir(null);
      setSwipeOffset(0);
      isAnimating.current = false;
      setCardKey((k) => k + 1);
      setSkipToast(skippedName);
      setTimeout(() => setSkipToast(null), 2000);
    }, 280);
  };

  // ─── Progress stats ───
  const completedSets = Object.values(exerciseLogs).reduce(
    (acc, ex) => acc + (ex.sets?.filter((s) => s.done).length ?? 0),
    0
  );
  const totalSets = allExercises.reduce((acc, ex) => acc + ex.sets, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const swipeProgress = Math.min(Math.abs(swipeOffset) / 100, 1);
  const isSwipingRight = swipeOffset > 15;
  const isSwipingLeft = swipeOffset < -15;

  // ─── Completion screen ───
  if (saved) {
    return (
      <div className="page workout-complete">
        <div className="complete-content">
          <div className="complete-check">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2>Bien joué !</h2>
          <p className="complete-stats">{completedSets}/{totalSets} séries validées</p>
          <button className="complete-btn" onClick={() => navigate("/")}>Retour</button>
        </div>
      </div>
    );
  }

  // ─── All done → save screen ───
  if (allDone) {
    return (
      <div className="page workout-page">
        <header className="workout-header">
          <button className="back-btn" onClick={() => setAllDone(false)} aria-label="Retour">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="workout-header-info">
            <h1 className="workout-title">{session.name.replace(/Séance \d+ — /, "")}</h1>
          </div>
        </header>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="finish-card">
          <div className="finish-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h2 className="finish-title">Séance terminée</h2>
          <p className="finish-stats">
            {completedSets} / {totalSets} séries validées
            <span className="finish-duration"> · {fmtDuration(nowTick - startedAt)}</span>
          </p>

          {/* Comparateur vs séance précédente */}
          {comparison && comparison.rows.length > 0 && (
            <div className="finish-block compare-block">
              <label className="finish-label">vs séance précédente</label>
              <div className="compare-list">
                {comparison.rows.slice(0, 6).map((row) => {
                  const dir = row.isFirstTime
                    ? "new"
                    : row.deltaMax > 0
                    ? "up"
                    : row.deltaMax < 0
                    ? "down"
                    : "same";
                  return (
                    <div key={row.exerciseId} className={`compare-row compare-${dir}`}>
                      <span className="compare-name">{row.name}</span>
                      <span className="compare-delta">
                        {dir === "new" && "Nouveau"}
                        {dir === "up" && `+${row.deltaMax} kg`}
                        {dir === "down" && `${row.deltaMax} kg`}
                        {dir === "same" && "Stable"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ajouter un exo en plus (cardio, autre exo, etc.) */}
          <div className="finish-block">
            <label className="finish-label">Tu as fait autre chose ?</label>
            <button className="extra-add-btn" onClick={() => setShowCatalog(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>Ajouter un exo en plus</span>
            </button>
            {extraExercises.length > 0 && (
              <p className="extras-summary">
                {extraExercises.length} exo{extraExercises.length > 1 ? "s" : ""} ajouté{extraExercises.length > 1 ? "s" : ""} à la séance
              </p>
            )}
          </div>

          {/* Énergie / mood */}
          <div className="finish-block">
            <label className="finish-label">Comment tu te sens ?</label>
            <div className="mood-row">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  className={`mood-btn ${mood === v ? "active" : ""}`}
                  onClick={() => setMood(mood === v ? null : v)}
                  aria-label={`Énergie ${v}/5`}
                >
                  {["😴", "😐", "🙂", "💪", "🔥"][v - 1]}
                </button>
              ))}
            </div>
          </div>

          {/* Bodyweight (seulement si pas mesuré récemment) */}
          {askBw && (
            <div className="finish-block">
              <label className="finish-label">Poids du jour (optionnel)</label>
              <div className="finish-bw-wrap">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  className="finish-input"
                  value={bwInput}
                  onChange={(e) => setBwInput(e.target.value)}
                  placeholder="75.5"
                />
                <span className="finish-bw-unit">kg</span>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="finish-block">
            <label className="finish-label">Note (optionnel)</label>
            <input
              type="text"
              className="finish-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex : Bon ressenti, à reprendre…"
              maxLength={200}
            />
          </div>

          <button className="finish-save-btn" onClick={handleSave}>Enregistrer</button>
        </div>

        {/* Catalogue d'exos pour ajouter en plus */}
        {showCatalog && (
          <ExerciseCatalogPicker
            onPick={handlePickExtra}
            onClose={() => setShowCatalog(false)}
            excludeIds={Object.keys(exerciseLogs)}
            title="Ajouter un exo à ta séance"
          />
        )}
      </div>
    );
  }

  // ─── Loading ───
  if (!currentExercise || !currentSets) {
    return <div className="page"><p style={{ color: "var(--text-muted)", padding: 40, textAlign: "center" }}>Chargement…</p></div>;
  }

  const [c1, c2] = getGradient(currentSection?.title);
  const iconD = getIconPath(currentExercise.name);

  return (
    <div className="page workout-page">
      {/* Header */}
      <header className="workout-header">
        <button className="back-btn" onClick={handleCancelRequest} aria-label="Quitter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="workout-header-info">
          <h1 className="workout-title">{session.name.replace(/Séance \d+ — /, "")}</h1>
          <div className="workout-meta">
            <span className="workout-chrono" aria-label="Durée de la séance">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 15 14" />
              </svg>
              {fmtDuration(nowTick - startedAt)}
            </span>
            <span className="workout-counter">{completedSets}/{totalSets}</span>
          </div>
        </div>
      </header>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Exercise dots */}
      <div className="exercise-dots">
        {orderedExercises.map((ex, i) => {
          const done = exerciseLogs[ex.id]?.sets?.every((s) => s.done);
          return (
            <button
              key={ex.id}
              className={`exercise-dot ${i === exerciseIdx ? "active" : ""} ${done ? "done" : ""}`}
              onClick={() => {
                if (!isAnimating.current) {
                  setExerciseIdx(i);
                  setCardKey((k) => k + 1);
                }
              }}
              aria-label={`Exercice ${i + 1}`}
            />
          );
        })}
      </div>

      {/* Swipe card */}
      <div className="swipe-area">
        <div
          key={cardKey}
          className={`swipe-card ${exitDir === "right" ? "exit-right" : ""} ${exitDir === "left" ? "exit-left" : ""} ${!exitDir ? "card-enter" : ""}`}
          style={!exitDir ? { transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.03}deg)` } : undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe indicators */}
          {isSwipingRight && (
            <div className="swipe-indicator swipe-right" style={{ opacity: swipeProgress }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" /></svg>
              <span>SUIVANT</span>
            </div>
          )}
          {isSwipingLeft && exerciseIdx > 0 && (
            <div className="swipe-indicator swipe-left" style={{ opacity: swipeProgress }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
              <span>PRÉCÉDENT</span>
            </div>
          )}

          {/* Gradient header — tap to fullscreen */}
          <div
            className="card-visual"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
            onClick={() => currentExercise.image && setShowImage(true)}
          >
            <ExerciseImage name={currentExercise.image} alt={currentExercise.name} className="card-visual-img" />
            <svg viewBox="0 0 24 24" className="card-visual-icon" fill="white" opacity="0.2">
              <path d={iconD} />
            </svg>
            <div className="card-visual-overlay">
              <span className="card-visual-section">{currentSection?.title}</span>
              <span className="card-visual-set">{exerciseIdx + 1}/{orderedExercises.length}</span>
            </div>
            {currentExercise.image && (
              <div className="card-visual-zoom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                </svg>
              </div>
            )}
          </div>

          {/* Exercise name + meta */}
          <h2 className="card-exercise-name">{currentExercise.name}</h2>
          <div className="card-meta-row">
            <span className="card-meta-badge">{currentExercise.sets} × {currentExercise.reps}</span>
            <span className="card-meta-rest">Repos {currentExercise.rest}</span>
          </div>

          {/* Suggestion de charge */}
          {suggestions[currentExercise.id]?.progress && (
            <div className="suggestion-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" />
              </svg>
              <span>
                +{suggestions[currentExercise.id].increment} kg suggéré
                {" "}<small>(dernière fois : {suggestions[currentExercise.id].baseWeight} kg)</small>
              </span>
            </div>
          )}

          {/* All sets */}
          <div className="card-sets">
            <div className="card-sets-header">
              <span>#</span>
              <span>Poids</span>
              <span>Reps</span>
              <span></span>
            </div>
            {currentSets.map((set, i) => {
              const rpeKey = `${currentExercise.id}-${i}`;
              const showRpePicker = openRpeFor === rpeKey;

              // Mode compact pour les sets validés
              if (set.done) {
                return (
                  <div key={i} className="card-set-row done compact">
                    <span className="card-set-num">{i + 1}</span>
                    <button
                      className="card-set-summary"
                      onClick={() => toggleDone(currentExercise.id, i, currentExercise.rest)}
                      aria-label="Rouvrir ce set"
                    >
                      <span className="card-set-summary-main">
                        {set.weight ? `${set.weight} kg` : (isBodyweightExercise(currentExercise.name) ? "PC" : "—")} <span className="dot">·</span> {set.reps || "—"}
                      </span>
                      {set.rpe && <span className="card-set-summary-rpe">RPE {set.rpe}</span>}
                    </button>
                    <button
                      className="card-check checked"
                      onClick={() => toggleDone(currentExercise.id, i, currentExercise.rest)}
                      aria-label="Décocher"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </button>
                    {!set.rpe && (
                      <div className="card-set-rpe-row">
                        {showRpePicker ? (
                          <div className="rpe-picker">
                            <span className="rpe-picker-label">RPE</span>
                            {RPE_VALUES.map((v) => (
                              <button
                                key={v}
                                className="rpe-picker-btn"
                                onClick={() => setRpe(currentExercise.id, i, v)}
                              >
                                {v}
                              </button>
                            ))}
                            <button className="rpe-picker-close" onClick={() => setOpenRpeFor(null)} aria-label="Fermer">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button className="rpe-trigger" onClick={() => setOpenRpeFor(rpeKey)}>
                            Noter l'effort
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={i} className="card-set-row">
                  <span className="card-set-num">{i + 1}</span>

                  <input
                    type="number"
                    inputMode="decimal"
                    className="card-set-input"
                    placeholder={isBodyweightExercise(currentExercise.name) ? "PC ou kg" : "kg"}
                    value={set.weight}
                    onChange={(e) => updateField(currentExercise.id, i, "weight", e.target.value)}
                  />

                  <div className="card-reps-stepper">
                    <button className="reps-btn" onClick={() => adjustReps(currentExercise.id, i, -1)}>−</button>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="card-reps-input"
                      value={set.reps}
                      onChange={(e) => updateField(currentExercise.id, i, "reps", e.target.value)}
                    />
                    <button className="reps-btn" onClick={() => adjustReps(currentExercise.id, i, 1)}>+</button>
                  </div>

                  <button
                    className="card-check"
                    onClick={() => toggleDone(currentExercise.id, i, currentExercise.rest)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Note perso (Phase C) */}
          {(() => {
            const personalNote = (notesVersion, getExerciseNote(currentExercise.id));
            const startEditing = () => {
              setNoteDraft(personalNote || "");
              setEditingNote(true);
            };
            if (editingNote) {
              return (
                <div className="card-personal-note editing">
                  <textarea
                    className="card-personal-note-input"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Ressenti, technique, charge cible…"
                    maxLength={500}
                    rows={2}
                    autoFocus
                  />
                  <div className="card-personal-note-actions">
                    <button
                      className="card-personal-note-btn"
                      onClick={() => { setEditingNote(false); setNoteDraft(""); }}
                    >
                      Annuler
                    </button>
                    <button
                      className="card-personal-note-btn primary"
                      onClick={() => {
                        saveExerciseNote(currentExercise.id, noteDraft);
                        setEditingNote(false);
                        setNoteDraft("");
                        setNotesVersion((v) => v + 1);
                      }}
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              );
            }
            if (personalNote) {
              return (
                <button className="card-personal-note" onClick={startEditing}>
                  <span className="card-personal-note-label">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Note perso
                  </span>
                  <span className="card-personal-note-text">{personalNote}</span>
                </button>
              );
            }
            return (
              <button className="card-add-note" onClick={startEditing}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Ajouter une note perso
              </button>
            );
          })()}

          {/* Notes du programme */}
          {currentExercise.notes && (
            <p className="card-notes">{currentExercise.notes}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="exercise-nav-bar">
        <button className="nav-btn-prev" onClick={goPrev} disabled={exerciseIdx === 0}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        {!isLast && (
          <button className="nav-btn-skip" onClick={handleSkip} title="Reporter après le suivant">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            <span>Reporter</span>
          </button>
        )}
        <span className="nav-position">{exerciseIdx + 1} / {orderedExercises.length}</span>
        {isLast ? (
          <button className="nav-btn-finish" onClick={() => { setAllDone(true); setCardKey((k) => k + 1); }}>
            Terminer
          </button>
        ) : (
          <button className="nav-btn-next" onClick={goNext}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </div>

      {/* Rest timer */}
      {restTimerSec > 0 && (
        <RestTimer
          key={restTimerKey}
          initialSec={restTimerSec}
          onClose={() => setRestTimerSec(0)}
        />
      )}

      {/* Skip toast */}
      {skipToast && (
        <div className="skip-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
          {skipToast} reporté
        </div>
      )}

      {/* Fullscreen image viewer */}
      {showImage && currentExercise.image && (
        <div className="image-viewer" onClick={() => setShowImage(false)}>
          <ExerciseImage name={currentExercise.image} alt={currentExercise.name} className="image-viewer-img" />
          <p className="image-viewer-name">{currentExercise.name}</p>
        </div>
      )}

      {/* Catalogue d'exos (ajout en plus pendant la séance) */}
      {showCatalog && (
        <ExerciseCatalogPicker
          onPick={handlePickExtra}
          onClose={() => setShowCatalog(false)}
          excludeIds={Object.keys(exerciseLogs)}
          title="Ajouter un exo à ta séance"
        />
      )}

      {/* Cancel session modal */}
      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="cancel-modal-title">Quitter la séance ?</h3>
            <p className="cancel-modal-text">
              Tu as validé {completedSets} / {totalSets} séries. Veux-tu pouvoir reprendre plus tard ?
            </p>
            <div className="cancel-modal-actions">
              <button className="cancel-modal-btn save" onClick={handleCancelSave}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Quitter et reprendre plus tard
              </button>
              <button className="cancel-modal-btn discard" onClick={handleCancelDiscard}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Abandonner la séance
              </button>
              <button className="cancel-modal-btn continue" onClick={() => setShowCancelModal(false)}>
                Continuer la séance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
