import { useNavigate } from "react-router-dom";
import { program } from "../data/program";
import { getRecentSessions } from "../utils/storage";

const sessionLabels = {};
for (const s of program.sessions) {
  sessionLabels[s.id] = s.name;
}

export default function Logs() {
  const navigate = useNavigate();
  const sessions = getRecentSessions();

  return (
    <div className="page logs-page">
      <header className="home-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
        <p className="home-subtitle">Historique des séances</p>
      </header>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p>Aucune séance enregistrée.</p>
          <p className="empty-hint">Démarre ton premier workout !</p>
        </div>
      ) : (
        <div className="logs-list">
          {sessions.map((log, i) => {
            const exerciseCount = log.exercises
              ? Object.keys(log.exercises).length
              : 0;
            const completedSets = log.exercises
              ? Object.values(log.exercises).reduce(
                  (acc, ex) => acc + (ex.sets?.filter((s) => s.done).length ?? 0),
                  0
                )
              : 0;
            const totalSets = log.exercises
              ? Object.values(log.exercises).reduce(
                  (acc, ex) => acc + (ex.sets?.length ?? 0),
                  0
                )
              : 0;

            return (
              <div key={i} className="log-card">
                <div className="log-card-header">
                  <div className="log-date">
                    {new Date(log.date + "T12:00:00").toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                  <div className="log-badge">
                    {completedSets}/{totalSets}
                  </div>
                </div>
                <div className="log-session-name">
                  {sessionLabels[log.sessionId] || log.sessionId}
                </div>
                <div className="log-meta">
                  <span>{exerciseCount} exercices</span>
                  <span>•</span>
                  <span>{completedSets} séries validées</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
