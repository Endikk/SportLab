import { program } from "../data/program";
import { programHypertrophie } from "../data/program-hypertrophie";

export const PROGRAMS = [
  // PPL conservé pour la rétro-compatibilité des logs anciens (caché de l'UI principale).
  { id: "ppl", name: "Push / Pull / Legs", sessions: program.sessions, schedule: program.schedule, hidden: true },
  { id: "hypertrophie", name: programHypertrophie.name, sessions: programHypertrophie.sessions, schedule: programHypertrophie.schedule },
];

export const VISIBLE_PROGRAMS = PROGRAMS.filter((p) => !p.hidden);
export const ACTIVE_PROGRAM = VISIBLE_PROGRAMS[0] || PROGRAMS[0];

const STORAGE_KEY = "sportlab_logs";
const AUTOSAVE_KEY = "sportlab_workout_progress";
const CUSTOM_SESSIONS_KEY = "sportlab_custom_sessions";
const BODYWEIGHT_KEY = "sportlab_bodyweight";
const SESSION_NOTES_KEY = "sportlab_session_notes";
const EXERCISE_NOTES_KEY = "sportlab_exercise_notes";

// ─── Logs (séances complétées) ───

export function getAllLogs() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    const parsed = JSON.parse(data);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveSessionLog(date, sessionId, exerciseLogs, meta = {}) {
  const logs = getAllLogs();
  const key = `${date}_${sessionId}`;
  logs[key] = {
    date,
    sessionId,
    exercises: exerciseLogs,
    timestamp: Date.now(),
    ...(meta.bodyweight ? { bodyweight: Number(meta.bodyweight) } : {}),
    ...(meta.mood ? { mood: Number(meta.mood) } : {}),
    ...(meta.note ? { note: String(meta.note).slice(0, 500) } : {}),
    ...(meta.durationMin ? { durationMin: Number(meta.durationMin) } : {}),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getLastLogForExercise(exerciseId) {
  const logs = getAllLogs();
  let latest = null;

  for (const key of Object.keys(logs)) {
    const log = logs[key];
    if (!log?.exercises?.[exerciseId]) continue;
    if (!latest || log.timestamp > latest.timestamp) {
      latest = { ...log.exercises[exerciseId], timestamp: log.timestamp };
    }
  }

  return latest;
}

export function getExerciseHistory(exerciseId) {
  const logs = getAllLogs();
  const history = [];

  for (const key of Object.keys(logs)) {
    const log = logs[key];
    if (!log?.exercises?.[exerciseId]?.sets) continue;
    history.push({
      date: log.date,
      sets: log.exercises[exerciseId].sets,
    });
  }

  return history.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getRecentSessions() {
  const logs = getAllLogs();
  return Object.values(logs)
    .filter((log) => log?.date && log?.sessionId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

// Parse "8-10" → 10, "12-15" → 15, "6-10" → 10, "12/côté" → 12
// Returns null for time-based reps like "45-60s"
export function parseMaxReps(repsStr) {
  if (!repsStr || repsStr.includes("s")) return null;
  const cleaned = repsStr.replace(/\/côté/i, "");
  const match = cleaned.match(/(\d+)(?:\s*[-–]\s*(\d+))?/);
  if (!match) return null;
  return parseInt(match[2] || match[1]);
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

// Check if there's an in-progress workout
export function getWorkoutInProgress() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Sessions custom (créées par l'utilisateur) ───
// Schéma minimal compatible avec le programme : { id, name, day?, muscleGroups, duration, type?, kind?, sections: [{ title, exercises: [...] }], custom: true, emoji?, gradient? }

function readCustomSessions() {
  try {
    const raw = localStorage.getItem(CUSTOM_SESSIONS_KEY);
    if (!raw) return [];
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
    sections: session.sections.map((sec) => ({
      title: String(sec.title || "GROUPE"),
      exercises: (sec.exercises || []).map((ex) => ({
        id: String(ex.id),
        name: String(ex.name || "Exercice"),
        sets: Number(ex.sets) || 3,
        reps: String(ex.reps || "10"),
        rest: String(ex.rest || "1 min"),
        notes: ex.notes || "",
        kind: ex.kind || "sets-reps", // 'sets-reps' | 'duration' | 'distance'
        ...(ex.image ? { image: ex.image } : {}),
      })),
    })),
    updatedAt: Date.now(),
  };
  if (idx >= 0) list[idx] = cleaned;
  else list.push(cleaned);
  localStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify(list));
  return cleaned;
}

export function deleteCustomSession(id) {
  const list = readCustomSessions();
  const next = list.filter((s) => s.id !== id);
  localStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify(next));
}

export function isCustomSession(id) {
  return readCustomSessions().some((s) => s.id === id);
}

// Génère un id de séance custom unique
export function generateCustomSessionId() {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateCustomExerciseId(sessionId) {
  return `${sessionId}-ex-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

// Résolution unifiée : tous les programmes + custom
export function getAllSessions() {
  const programSessions = PROGRAMS.flatMap((p) => p.sessions);
  return [...programSessions, ...getCustomSessions()];
}

// Quel programme contient cette session ?
export function findProgramOf(sessionId) {
  for (const p of PROGRAMS) {
    if (p.sessions.some((s) => s.id === sessionId)) return p;
  }
  return null;
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

// ─── Bodyweight ───

export function getBodyweightHistory() {
  try {
    const raw = localStorage.getItem(BODYWEIGHT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBodyweight(date, kg) {
  const value = Number(kg);
  if (!isFinite(value) || value <= 0) return;
  const list = getBodyweightHistory();
  const idx = list.findIndex((e) => e.date === date);
  if (idx >= 0) list[idx] = { date, kg: value };
  else list.push({ date, kg: value });
  list.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem(BODYWEIGHT_KEY, JSON.stringify(list));
}

export function getLatestBodyweight() {
  const list = getBodyweightHistory();
  return list.length ? list[list.length - 1] : null;
}

// ─── Helpers monitoring ───

// Estimation 1RM (formule Epley) : poids × (1 + reps/30)
export function estimate1RM(weight, reps) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return w;
  return Math.round(w * (1 + r / 30) * 10) / 10;
}

// Meilleur 1RM estimé d'une session pour un exo
function bestSet1RM(sets) {
  let best = 0;
  for (const s of sets || []) {
    if (!s?.done) continue;
    const e = estimate1RM(s.weight, s.reps);
    if (e > best) best = e;
  }
  return best;
}

export function getEstimated1RMHistory(exerciseId) {
  const history = getExerciseHistory(exerciseId);
  return history
    .map((h) => ({ date: h.date, value: bestSet1RM(h.sets) }))
    .filter((p) => p.value > 0);
}

// PR : meilleur poids absolu et meilleur 1RM estimé
export function getPRForExercise(exerciseId) {
  const history = getExerciseHistory(exerciseId);
  let maxWeight = 0;
  let max1RM = 0;
  let prDate = null;
  for (const h of history) {
    for (const s of h.sets || []) {
      const w = Number(s.weight) || 0;
      if (w > maxWeight) {
        maxWeight = w;
        prDate = h.date;
      }
      const e = estimate1RM(s.weight, s.reps);
      if (e > max1RM) max1RM = e;
    }
  }
  return { maxWeight, max1RM, date: prDate };
}

// Vérifie si la session passée a battu un PR sur au moins un exo (utile pour badge Home)
export function hasRecentPR(daysWindow = 7) {
  const cutoff = Date.now() - daysWindow * 86400000;
  const logs = Object.values(getAllLogs()).filter((l) => l.timestamp >= cutoff);
  if (!logs.length) return false;

  // Pour chaque exo de chaque log récent, on regarde si c'est le max all-time
  const all = getAllLogs();
  const allEntries = Object.values(all);
  for (const log of logs) {
    for (const [exId, exLog] of Object.entries(log.exercises || {})) {
      const sessionMax = Math.max(0, ...(exLog.sets || []).map((s) => Number(s.weight) || 0));
      if (sessionMax === 0) continue;
      let allTime = 0;
      for (const other of allEntries) {
        if (other.timestamp > log.timestamp) continue;
        const otherSets = other.exercises?.[exId]?.sets || [];
        for (const s of otherSets) {
          const w = Number(s.weight) || 0;
          if (w > allTime) allTime = w;
        }
      }
      if (sessionMax >= allTime && sessionMax > 0) return { exerciseId: exId, weight: sessionMax, date: log.date };
    }
  }
  return false;
}

// Association exerciceId → groupe musculaire (via la section qui le contient)
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

// Volume par groupe musculaire sur N derniers jours
export function getVolumeByMuscleGroup(days = 28) {
  const cutoff = Date.now() - days * 86400000;
  const logs = Object.values(getAllLogs()).filter((l) => l.timestamp >= cutoff);
  const totals = {};
  for (const log of logs) {
    for (const [exId, exLog] of Object.entries(log.exercises || {})) {
      const group = getMuscleGroupForExerciseId(exId);
      let vol = 0;
      for (const s of exLog.sets || []) {
        if (!s.done) continue;
        vol += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
      if (vol > 0) totals[group] = (totals[group] || 0) + vol;
    }
  }
  return Object.entries(totals)
    .map(([group, value]) => ({ group, value }))
    .sort((a, b) => b.value - a.value);
}

// Stats hebdo (cette semaine ISO ou dernière fenêtre 7j)
export function getWeeklyStats() {
  const now = new Date();
  const sevenAgo = new Date(now.getTime() - 7 * 86400000);
  const logs = Object.values(getAllLogs()).filter((l) => new Date(l.date + "T12:00:00") >= sevenAgo);

  let totalVolume = 0;
  let totalSetsDone = 0;
  for (const log of logs) {
    for (const ex of Object.values(log.exercises || {})) {
      for (const s of ex.sets || []) {
        if (!s.done) continue;
        totalSetsDone++;
        totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
    }
  }

  // Séances prévues sur la semaine selon le programme
  const planned = program.schedule.filter((d) => d.session).length;
  return {
    sessionsDone: logs.length,
    sessionsPlanned: planned,
    totalVolume: Math.round(totalVolume),
    totalSetsDone,
    adherence: planned > 0 ? Math.min(100, Math.round((logs.length / planned) * 100)) : 0,
  };
}

// Streak : nb de semaines consécutives avec au moins 1 séance (jusqu'à aujourd'hui)
export function getWeeklyStreak() {
  const logs = getRecentSessions();
  if (!logs.length) return 0;

  const weekKey = (d) => {
    const date = new Date(d + "T12:00:00");
    const onejan = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    return `${date.getFullYear()}-${week}`;
  };

  const weeks = new Set(logs.map((l) => weekKey(l.date)));
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 52; i++) {
    const ref = new Date(now.getTime() - i * 7 * 86400000);
    const onejan = new Date(ref.getFullYear(), 0, 1);
    const week = Math.ceil(((ref - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    const key = `${ref.getFullYear()}-${week}`;
    if (weeks.has(key)) streak++;
    else if (i > 0) break;
    else break;
  }
  return streak;
}

// Tendance simple sur un exo : delta entre les 3 dernières et les 3 précédentes (sur 1RM estimé)
export function getExerciseTrend(exerciseId) {
  const series = getEstimated1RMHistory(exerciseId);
  if (series.length < 4) return { direction: "neutral", delta: 0, label: "Pas assez de données" };
  const recent = series.slice(-3).map((p) => p.value);
  const prev = series.slice(-6, -3).map((p) => p.value);
  if (!prev.length) return { direction: "neutral", delta: 0, label: "Pas assez de données" };
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const delta = Math.round((avg(recent) - avg(prev)) * 10) / 10;
  if (Math.abs(delta) < 0.5) return { direction: "stable", delta, label: "Plateau" };
  if (delta > 0) return { direction: "up", delta, label: `+${delta} kg` };
  return { direction: "down", delta, label: `${delta} kg` };
}

// ─── Export / Import ───

const EXPORT_VERSION = 3;
const APP_ID = "sportlab";

function validateLog(key, log) {
  if (!log || typeof log !== "object") return false;
  if (typeof log.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(log.date)) return false;
  if (typeof log.sessionId !== "string" || !log.sessionId) return false;
  if (typeof log.timestamp !== "number") return false;
  if (!log.exercises || typeof log.exercises !== "object") return false;
  for (const ex of Object.values(log.exercises)) {
    if (!Array.isArray(ex.sets)) return false;
    for (const s of ex.sets) {
      if (typeof s !== "object" || s === null) return false;
      if (!("weight" in s) || !("reps" in s) || !("done" in s)) return false;
    }
  }
  return true;
}

function validateCustomSession(s) {
  return (
    s && typeof s === "object" &&
    typeof s.id === "string" && s.id &&
    typeof s.name === "string" && s.name &&
    Array.isArray(s.sections)
  );
}

export function exportData() {
  const logs = getAllLogs();
  const customSessions = readCustomSessions();
  const bodyweight = getBodyweightHistory();
  const data = {
    app: APP_ID,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    sessionCount: Object.keys(logs).length,
    logs,
    customSessions,
    bodyweight,
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sportlab-backup-${new Date().toLocaleDateString("fr-CA")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return Object.keys(logs).length;
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("Aucun fichier"));
    if (!file.name.endsWith(".json")) return reject(new Error("Le fichier doit être un .json"));
    if (file.size > 10 * 1024 * 1024) return reject(new Error("Fichier trop volumineux (max 10 Mo)"));

    const reader = new FileReader();
    reader.onload = (e) => {
      let parsed;
      try {
        parsed = JSON.parse(e.target.result);
      } catch {
        return reject(new Error("JSON invalide — fichier corrompu"));
      }

      // Accept both formats: { app, version, logs: {...} } and raw logs {...}
      let logs;
      let customSessions = null;
      let bodyweight = null;
      if (parsed.app === APP_ID && parsed.logs && typeof parsed.logs === "object") {
        logs = parsed.logs;
        if (Array.isArray(parsed.customSessions)) customSessions = parsed.customSessions;
        if (Array.isArray(parsed.bodyweight)) bodyweight = parsed.bodyweight;
      } else if (parsed.logs && typeof parsed.logs === "object") {
        logs = parsed.logs;
      } else if (typeof parsed === "object" && !Array.isArray(parsed) && !parsed.app) {
        // Raw logs format (v1 export or manual)
        logs = parsed;
      } else {
        return reject(new Error("Format non reconnu — ce n'est pas un backup SportLab"));
      }

      // Validate each log entry
      const validLogs = {};
      let skipped = 0;
      for (const [key, log] of Object.entries(logs)) {
        if (validateLog(key, log)) {
          validLogs[key] = log;
        } else {
          skipped++;
        }
      }

      const validCount = Object.keys(validLogs).length;
      if (validCount === 0 && !customSessions?.length && !bodyweight?.length) {
        return reject(new Error("Aucune donnée valide trouvée dans le fichier"));
      }

      // Merge logs (imported wins on same key)
      const existing = getAllLogs();
      const merged = { ...existing, ...validLogs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

      // Merge custom sessions
      if (customSessions) {
        const existingCustom = readCustomSessions();
        const valid = customSessions.filter(validateCustomSession);
        const byId = new Map(existingCustom.map((s) => [s.id, s]));
        for (const s of valid) byId.set(s.id, s);
        localStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify([...byId.values()]));
      }

      // Merge bodyweight
      if (bodyweight) {
        const existingBw = getBodyweightHistory();
        const byDate = new Map(existingBw.map((e) => [e.date, e]));
        for (const e of bodyweight) {
          if (e?.date && Number(e?.kg) > 0) byDate.set(e.date, { date: e.date, kg: Number(e.kg) });
        }
        const finalBw = [...byDate.values()].sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem(BODYWEIGHT_KEY, JSON.stringify(finalBw));
      }

      const newCount = Object.keys(merged).length - Object.keys(existing).length;
      const msg = newCount > 0
        ? `${validCount} séance(s) importée(s), ${newCount} nouvelle(s)`
        : `${validCount} séance(s) importée(s)`;
      resolve(skipped > 0 ? `${msg} (${skipped} ignorée(s))` : msg);
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsText(file);
  });
}

// ─── Notes pro session (utilisable plus tard) ───
export function getSessionNote(date, sessionId) {
  try {
    const raw = localStorage.getItem(SESSION_NOTES_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data[`${date}_${sessionId}`] || null;
  } catch {
    return null;
  }
}

// ─── Helpers période (Phase A) ───

export const PERIOD_DAYS = {
  "7d": 7,
  "28d": 28,
  "3m": 90,
  "all": null,
};

function logsInPeriod(period) {
  const all = Object.values(getAllLogs()).filter((l) => l?.date && l?.sessionId);
  const days = PERIOD_DAYS[period] ?? null;
  if (!days) return all;
  const cutoff = Date.now() - days * 86400000;
  return all.filter((l) => (l.timestamp ?? new Date(l.date + "T12:00:00").getTime()) >= cutoff);
}

// Stats généralisées sur une période
export function getStatsForPeriod(period) {
  const logs = logsInPeriod(period);
  let totalVolume = 0;
  let totalSetsDone = 0;
  for (const log of logs) {
    for (const ex of Object.values(log.exercises || {})) {
      for (const s of ex.sets || []) {
        if (!s.done) continue;
        totalSetsDone++;
        totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
    }
  }
  const days = PERIOD_DAYS[period];
  const planned = days ? Math.max(1, Math.round((days / 7) * program.schedule.filter((d) => d.session).length)) : null;
  return {
    sessionsDone: logs.length,
    sessionsPlanned: planned,
    totalVolume: Math.round(totalVolume),
    totalSetsDone,
    adherence: planned ? Math.min(100, Math.round((logs.length / planned) * 100)) : null,
  };
}

// Volume par groupe musculaire sur une période string
export function getVolumeByMuscleForPeriod(period) {
  const logs = logsInPeriod(period);
  const totals = {};
  for (const log of logs) {
    for (const [exId, exLog] of Object.entries(log.exercises || {})) {
      const group = getMuscleGroupForExerciseId(exId);
      let vol = 0;
      for (const s of exLog.sets || []) {
        if (!s.done) continue;
        vol += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
      if (vol > 0) totals[group] = (totals[group] || 0) + vol;
    }
  }
  return Object.entries(totals)
    .map(([group, value]) => ({ group, value }))
    .sort((a, b) => b.value - a.value);
}

// Liste de tous les exercices avec un PR (pour la page /records)
export function getAllExercisePRs() {
  const all = getAllLogs();
  // Map exerciseId → { sets[], lastDate, count }
  const byEx = {};
  for (const log of Object.values(all)) {
    for (const [exId, exLog] of Object.entries(log.exercises || {})) {
      if (!byEx[exId]) byEx[exId] = { sessions: 0, sets: [], lastDate: log.date };
      byEx[exId].sessions++;
      if (new Date(log.date) > new Date(byEx[exId].lastDate)) byEx[exId].lastDate = log.date;
      for (const s of exLog.sets || []) {
        if (Number(s.weight) > 0) byEx[exId].sets.push({ ...s, date: log.date });
      }
    }
  }

  const rows = [];
  for (const [exId, data] of Object.entries(byEx)) {
    if (!data.sets.length) continue;
    let bestWeight = 0;
    let best1RM = 0;
    let prDate = null;
    for (const s of data.sets) {
      const w = Number(s.weight) || 0;
      if (w > bestWeight) { bestWeight = w; prDate = s.date; }
      const e = estimate1RM(s.weight, s.reps);
      if (e > best1RM) best1RM = e;
    }
    const found = findExerciseById(exId);
    rows.push({
      exerciseId: exId,
      name: found?.exercise?.name || exId,
      muscleGroup: getMuscleGroupForExerciseId(exId),
      bestWeight,
      best1RM,
      prDate,
      sessions: data.sessions,
      lastDate: data.lastDate,
    });
  }
  return rows.sort((a, b) => b.best1RM - a.best1RM);
}

// Depuis combien de jours un groupe musculaire n'a pas été travaillé ?
export function getDaysSinceLastTrainedMuscle(group) {
  const all = Object.values(getAllLogs());
  let latest = null;
  for (const log of all) {
    for (const exId of Object.keys(log.exercises || {})) {
      if (getMuscleGroupForExerciseId(exId) === group) {
        const ts = log.timestamp ?? new Date(log.date + "T12:00:00").getTime();
        if (!latest || ts > latest) latest = ts;
        break;
      }
    }
  }
  if (!latest) return null;
  return Math.floor((Date.now() - latest) / 86400000);
}

// Compte les PR battus dans la période
export function countPRsInPeriod(period) {
  const days = PERIOD_DAYS[period] ?? null;
  const cutoff = days ? Date.now() - days * 86400000 : 0;
  const allLogs = Object.values(getAllLogs()).sort((a, b) => a.timestamp - b.timestamp);
  const recordsByEx = {};
  let count = 0;
  for (const log of allLogs) {
    const ts = log.timestamp ?? new Date(log.date + "T12:00:00").getTime();
    for (const [exId, exLog] of Object.entries(log.exercises || {})) {
      let sessionMax = 0;
      for (const s of exLog.sets || []) {
        const w = Number(s.weight) || 0;
        if (w > sessionMax) sessionMax = w;
      }
      if (sessionMax === 0) continue;
      const prev = recordsByEx[exId] || 0;
      if (sessionMax > prev) {
        recordsByEx[exId] = sessionMax;
        if (ts >= cutoff) count++;
      }
    }
  }
  return count;
}

// Insights texte automatiques (max 3, ordonnés par pertinence)
export function getInsights(period = "28d") {
  const insights = [];
  const stats = getStatsForPeriod(period);
  const prevPeriodLogs = (() => {
    const days = PERIOD_DAYS[period] ?? 28;
    const start = Date.now() - days * 2 * 86400000;
    const end = Date.now() - days * 86400000;
    const all = Object.values(getAllLogs());
    return all.filter((l) => {
      const ts = l.timestamp ?? new Date(l.date + "T12:00:00").getTime();
      return ts >= start && ts < end;
    });
  })();

  // Volume vs période précédente
  let prevVolume = 0;
  for (const log of prevPeriodLogs) {
    for (const ex of Object.values(log.exercises || {})) {
      for (const s of ex.sets || []) {
        if (!s.done) continue;
        prevVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
    }
  }
  if (prevVolume > 0) {
    const delta = Math.round(((stats.totalVolume - prevVolume) / prevVolume) * 100);
    if (delta >= 5) insights.push({ icon: "up", text: `Volume +${delta}% vs période précédente` });
    else if (delta <= -10) insights.push({ icon: "down", text: `Volume ${delta}% vs période précédente` });
  }

  // PR battus
  const prCount = countPRsInPeriod(period);
  if (prCount > 0) {
    insights.push({ icon: "pr", text: `${prCount} record${prCount > 1 ? "s" : ""} battu${prCount > 1 ? "s" : ""} sur la période` });
  }

  // Groupe musculaire négligé
  const muscles = ["Pectoraux", "Dos", "Quadriceps", "Épaules", "Biceps", "Triceps", "Abdos"];
  const stale = muscles
    .map((m) => ({ m, days: getDaysSinceLastTrainedMuscle(m) }))
    .filter((e) => e.days !== null && e.days >= 10)
    .sort((a, b) => b.days - a.days);
  if (stale.length) {
    const worst = stale[0];
    insights.push({ icon: "warn", text: `${worst.m} pas travaillés depuis ${worst.days} jours` });
  }

  return insights.slice(0, 3);
}

// ─── Phase B : suggestion de charge + comparaison ───

// Pour un exercice donné, suggère le poids pour la prochaine séance
// Critère : tous les sets de la dernière séance validés + reps cible atteinte + RPE moyen ≤ 8 → +2.5 kg
// Sinon : conserver le même poids.
// Retourne { baseWeight, suggestedWeight, progress: boolean, increment } ou null si pas d'historique.
export function suggestNextWeight(exerciseId, targetReps) {
  const last = getLastLogForExercise(exerciseId);
  if (!last?.sets?.length) return null;

  const weights = last.sets
    .map((s) => Number(s.weight) || 0)
    .filter((w) => w > 0);
  if (!weights.length) return null;

  const baseWeight = Math.max(...weights);
  const allDone = last.sets.every((s) => s.done);
  const repsHit = targetReps
    ? last.sets.every((s) => (Number(s.reps) || 0) >= targetReps)
    : true;
  const rpes = last.sets.map((s) => s.rpe).filter((r) => Number.isFinite(r));
  const avgRpe = rpes.length ? rpes.reduce((a, b) => a + b, 0) / rpes.length : null;

  const shouldProgress = allDone && repsHit && (avgRpe === null || avgRpe <= 8);
  const increment = baseWeight >= 50 ? 2.5 : baseWeight >= 20 ? 1.25 : 0.5;

  return {
    baseWeight,
    suggestedWeight: shouldProgress ? Math.round((baseWeight + increment) * 100) / 100 : baseWeight,
    progress: shouldProgress,
    increment,
    avgRpe,
  };
}

// ─── Notes par exercice (persistantes entre séances) ───

function readExerciseNotes() {
  try {
    const raw = localStorage.getItem(EXERCISE_NOTES_KEY);
    if (!raw) return {};
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
  localStorage.setItem(EXERCISE_NOTES_KEY, JSON.stringify(notes));
}

// Compare la séance en cours à la dernière séance enregistrée du même type
// currentLogs : { exerciseId: { sets: [...] } } (tel qu'utilisé pendant Workout)
// Retourne une liste d'objets { exerciseId, name, currentMax, prevMax, deltaMax, deltaVol } pour les exos faits.
export function compareWithPreviousSession(sessionId, currentLogs) {
  const previous = Object.values(getAllLogs())
    .filter((l) => l.sessionId === sessionId)
    .sort((a, b) => b.timestamp - a.timestamp)[0];
  if (!previous) return null;

  const rows = [];
  for (const [exId, current] of Object.entries(currentLogs || {})) {
    const cSets = (current.sets || []).filter((s) => s.done);
    if (!cSets.length) continue;

    const pSets = previous.exercises?.[exId]?.sets?.filter((s) => s.done) || [];
    const cMax = Math.max(0, ...cSets.map((s) => Number(s.weight) || 0));
    const pMax = Math.max(0, ...pSets.map((s) => Number(s.weight) || 0));
    const cVol = cSets.reduce((a, s) => a + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
    const pVol = pSets.reduce((a, s) => a + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);

    const found = findExerciseById(exId);
    rows.push({
      exerciseId: exId,
      name: found?.exercise?.name || exId,
      currentMax: cMax,
      prevMax: pMax,
      deltaMax: pMax > 0 ? Math.round((cMax - pMax) * 10) / 10 : null,
      deltaVol: pVol > 0 ? Math.round(cVol - pVol) : null,
      isFirstTime: pSets.length === 0,
    });
  }
  return { previousDate: previous.date, rows };
}
