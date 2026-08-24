import { programUlf } from "../data/program-ulf";

export const PROGRAMS = [
  { id: "ulf", name: programUlf.name, sessions: programUlf.sessions, schedule: programUlf.schedule },
];

export const VISIBLE_PROGRAMS = PROGRAMS.filter((p) => !p.hidden);
export const ACTIVE_PROGRAM = VISIBLE_PROGRAMS[0] || PROGRAMS[0];

const AUTOSAVE_PREFIX = "sportlab_workout_progress";
const CUSTOM_SESSIONS_KEY = "sportlab_custom_sessions";
const EXERCISE_NOTES_KEY = "sportlab_exercise_notes";

// Clés d'anciennes versions (historique, records, poids du corps) — l'app n'enregistre
// plus les séances, on libère le quota au premier chargement.
const LEGACY_KEYS = ["sportlab_logs", "sportlab_bodyweight", "sportlab_session_notes"];

// ─── Accès localStorage protégés ───
// Les écritures échouent en navigation privée Safari ou sur quota dépassé : sans
// try/catch, l'exception remonte et démonte l'app en pleine séance.

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* stockage indisponible */
  }
}

export function purgeLegacyData() {
  for (const key of LEGACY_KEYS) safeRemoveItem(key);
}

// ─── Helpers de parsing du programme ───

// Parse "8-10" → 10, "12-15" → 15, "12/côté" → 12, "30-45s" → 45
// Retourne le nombre haut de la fourchette (utilisé pour pré-remplir l'input numérique)
export function parseMaxReps(repsStr) {
  if (!repsStr) return null;
  const cleaned = repsStr.replace(/\/côté/i, "");
  const match = cleaned.match(/(\d+)(?:\s*[-–]\s*(\d+))?/);
  if (!match) return null;
  return parseInt(match[2] || match[1]);
}

// Un exercice dont les reps sont exprimées en secondes ("30-60s") est tenu, pas répété.
export function isTimedExercise(repsStr) {
  return typeof repsStr === "string" && /\d\s*s\b/i.test(repsStr);
}

// Détecte si un exo se fait typiquement au poids du corps (peut être lesté)
// Utilisé pour afficher "PC" plutôt que "kg" quand le poids est vide.
export function isBodyweightExercise(exerciseName) {
  if (!exerciseName) return false;
  return /planche|traction|hanging|crunch|relev[ée]|gainage|pompe|side plank|dips lest/i.test(exerciseName);
}

// Parse "2 min 30" → 150, "1 min" → 60, "45s" → 45
export function parseRestSeconds(restStr) {
  if (!restStr) return 90;
  const minMatch = restStr.match(/(\d+)\s*min(?:\s*(\d+))?/);
  if (minMatch) {
    return parseInt(minMatch[1]) * 60 + (minMatch[2] ? parseInt(minMatch[2]) : 0);
  }
  const secMatch = restStr.match(/(\d+)\s*s/);
  if (secMatch) return parseInt(secMatch[1]);
  return 90;
}

// ─── Séance en cours (sauvegarde temporaire) ───
// Une clé PAR séance : avec une clé unique, ouvrir une autre séance écrasait
// silencieusement la progression de celle en cours.

function autosaveKey(sessionId) {
  return `${AUTOSAVE_PREFIX}_${sessionId}`;
}

export function saveWorkoutProgress(sessionId, data) {
  return safeSetItem(autosaveKey(sessionId), JSON.stringify({ sessionId, ...data }));
}

export function loadWorkoutProgress(sessionId) {
  const raw = safeGetItem(autosaveKey(sessionId));
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return data && data.sessionId === sessionId ? data : null;
  } catch {
    return null;
  }
}

export function clearWorkoutProgress(sessionId) {
  safeRemoveItem(autosaveKey(sessionId));
}

// La séance en cours la plus récente, pour le bandeau de reprise sur l'accueil.
export function getWorkoutInProgress() {
  let latest = null;
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith(`${AUTOSAVE_PREFIX}_`)) continue;
      const raw = safeGetItem(key);
      if (!raw) continue;
      try {
        const data = JSON.parse(raw);
        if (!data?.sessionId) continue;
        if (!latest || (data.startedAt || 0) > (latest.startedAt || 0)) latest = data;
      } catch {
        /* entrée corrompue : ignorée */
      }
    }
  } catch {
    return null;
  }
  return latest;
}

// ─── Sessions custom (créées par l'utilisateur) ───

function readCustomSessions() {
  const raw = safeGetItem(CUSTOM_SESSIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCustomSessions() {
  return readCustomSessions().map((s) => ({ ...s, custom: true }));
}

export function saveCustomSession(session) {
  if (!session || !session.id || !session.name || !Array.isArray(session.sections)) {
    throw new Error("Séance invalide");
  }
  const list = readCustomSessions();
  const idx = list.findIndex((s) => s.id === session.id);
  const cleaned = {
    id: String(session.id),
    name: String(session.name),
    day: session.day || "",
    muscleGroups: session.muscleGroups || "",
    duration: session.duration || "",
    type: session.type || "strength",
    emoji: (session.emoji || "").slice(0, 6),
    gradient: Array.isArray(session.gradient) ? session.gradient.slice(0, 2) : null,
    warmup: session.warmup || "",
    freestyle: Boolean(session.freestyle),
    sections: session.sections.map((sec) => ({
      title: String(sec.title || "GROUPE"),
      exercises: (sec.exercises || []).map((ex) => ({
        id: String(ex.id),
        name: String(ex.name || "Exercice"),
        sets: Number(ex.sets) || 3,
        reps: String(ex.reps || "10"),
        rest: String(ex.rest || "1 min"),
        notes: ex.notes || "",
        kind: ex.kind || "sets-reps",
        ...(ex.image ? { image: ex.image } : {}),
      })),
    })),
    updatedAt: Date.now(),
  };
  if (idx >= 0) list[idx] = cleaned;
  else list.push(cleaned);
  safeSetItem(CUSTOM_SESSIONS_KEY, JSON.stringify(list));
  return cleaned;
}

// ─── Résolution des séances et exercices ───

export function getAllSessions() {
  const programSessions = PROGRAMS.flatMap((p) => p.sessions);
  return [...programSessions, ...getCustomSessions()];
}

export function findSessionById(id) {
  return getAllSessions().find((s) => s.id === id) || null;
}

export function findExerciseById(exerciseId) {
  for (const session of getAllSessions()) {
    for (const section of session.sections || []) {
      const ex = (section.exercises || []).find((e) => e.id === exerciseId);
      if (ex) return { exercise: ex, session, section };
    }
  }
  return null;
}

// ─── Groupes musculaires ───

const MUSCLE_KEYWORDS = [
  { key: "Pectoraux", match: ["pect"] },
  { key: "Dos", match: ["dos"] },
  { key: "Épaules", match: ["épaule", "epaule"] },
  { key: "Biceps", match: ["biceps"] },
  { key: "Triceps", match: ["triceps"] },
  { key: "Bras", match: ["bras"] },
  { key: "Trapèzes", match: ["trapèze", "trapeze", "trap"] },
  { key: "Lombaires", match: ["lombaire", "lomb"] },
  { key: "Quadriceps", match: ["quadriceps", "quad"] },
  { key: "Ischios", match: ["ischio"] },
  { key: "Fessiers", match: ["fessier", "glute"] },
  { key: "Mollets", match: ["mollet"] },
  { key: "Abdos", match: ["abdo", "gainage"] },
  { key: "Cardio", match: ["cardio"] },
  { key: "Mobilité", match: ["mobil", "étirement", "etirement"] },
];

export function getMuscleGroupForSection(sectionTitle) {
  if (!sectionTitle) return "Autre";
  const t = sectionTitle.toLowerCase();
  for (const { key, match } of MUSCLE_KEYWORDS) {
    if (match.some((m) => t.includes(m))) return key;
  }
  return "Autre";
}

export function getMuscleGroupForExerciseId(exerciseId) {
  const found = findExerciseById(exerciseId);
  if (!found) return "Autre";
  return getMuscleGroupForSection(found.section?.title);
}

// ─── Planning ───

export function getActiveSchedule(programId = ACTIVE_PROGRAM.id) {
  const prog = PROGRAMS.find((p) => p.id === programId);
  if (!prog) return [];
  return prog.schedule.map((item) => ({ ...item }));
}

// ─── Notes personnelles par exercice ───

function readExerciseNotes() {
  const raw = safeGetItem(EXERCISE_NOTES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getExerciseNote(exerciseId) {
  return readExerciseNotes()[exerciseId] || "";
}

export function saveExerciseNote(exerciseId, text) {
  const notes = readExerciseNotes();
  const cleaned = String(text || "").trim().slice(0, 500);
  if (cleaned) notes[exerciseId] = cleaned;
  else delete notes[exerciseId];
  safeSetItem(EXERCISE_NOTES_KEY, JSON.stringify(notes));
}

// ─── Séance libre (freestyle) — sélection ad-hoc d'exos ───

export function createFreestyleSession(exerciseIds) {
  if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
    throw new Error("Sélectionne au moins un exercice");
  }
  const exercises = exerciseIds
    .map((id) => findExerciseById(id)?.exercise)
    .filter(Boolean);
  if (!exercises.length) throw new Error("Aucun exercice trouvé");

  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const id = `freestyle-${today.getTime().toString(36)}`;

  const session = {
    id,
    name: `Séance libre · ${dateStr}`,
    day: today.toLocaleDateString("fr-FR", { weekday: "long" }),
    muscleGroups: "",
    duration: "",
    type: "custom",
    emoji: "LIBRE",
    gradient: ["#B4527A", "#E4739B"],
    freestyle: true,
    sections: [
      {
        title: "EXERCICES",
        exercises: exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          sets: Number(ex.sets) || 3,
          reps: String(ex.reps || "10"),
          rest: String(ex.rest || "1 min"),
          notes: ex.notes || "",
          kind: ex.kind || "sets-reps",
          ...(ex.image ? { image: ex.image } : {}),
        })),
      },
    ],
  };

  return saveCustomSession(session);
}

// Catalogue d'exercices unique pour la sélection (dédupliqué par nom)
export function getExerciseCatalog() {
  const seen = new Set();
  const catalog = [];
  for (const session of getAllSessions()) {
    if (session.freestyle) continue;
    for (const sec of session.sections || []) {
      for (const ex of sec.exercises || []) {
        const key = ex.name.trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        catalog.push({
          id: ex.id,
          name: ex.name,
          image: ex.image,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          sectionTitle: sec.title,
          muscleGroup: getMuscleGroupForSection(sec.title),
        });
      }
    }
  }
  return catalog.sort((a, b) => a.muscleGroup.localeCompare(b.muscleGroup) || a.name.localeCompare(b.name));
}
