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

export function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    logs: getAllLogs(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sportlab-backup-${new Date().toLocaleDateString("fr-CA")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const logs = data.logs ?? data;
        if (typeof logs !== "object" || logs === null) {
          reject(new Error("Format invalide"));
          return;
        }
        // Merge with existing logs (imported data wins on conflicts)
        const existing = getAllLogs();
        const merged = { ...existing, ...logs };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        resolve(Object.keys(logs).length);
      } catch {
        reject(new Error("Fichier invalide"));
      }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture"));
    reader.readAsText(file);
  });
}
