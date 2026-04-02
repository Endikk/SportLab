const STORAGE_KEY = "sportlab_logs";
const AUTOSAVE_KEY = "sportlab_workout_progress";

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

export function saveSessionLog(date, sessionId, exerciseLogs) {
  const logs = getAllLogs();
  const key = `${date}_${sessionId}`;
  logs[key] = {
    date,
    sessionId,
    exercises: exerciseLogs,
    timestamp: Date.now(),
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

// ─── Export / Import ───

const EXPORT_VERSION = 2;
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

export function exportData() {
  const logs = getAllLogs();
  const data = {
    app: APP_ID,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    sessionCount: Object.keys(logs).length,
    logs,
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
      if (parsed.app === APP_ID && parsed.logs && typeof parsed.logs === "object") {
        logs = parsed.logs;
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
      if (validCount === 0) {
        return reject(new Error("Aucune séance valide trouvée dans le fichier"));
      }

      // Merge with existing (imported wins on same key)
      const existing = getAllLogs();
      const merged = { ...existing, ...validLogs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

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
