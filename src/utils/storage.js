const STORAGE_KEY = "sportlab_logs";

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
