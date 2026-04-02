import { useState, useRef } from "react";
import { program } from "../data/program";
import { getRecentSessions, exportData, importData } from "../utils/storage";
import { getSessionVisual } from "../utils/exerciseVisuals";

const sessionLabels = {};
for (const s of program.sessions) {
  sessionLabels[s.id] = s.name;
}

export default function Logs() {
  const sessions = getRecentSessions();
  const fileRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importData(file);
      setImportMsg(`${count} séance(s) importée(s)`);
      setTimeout(() => setImportMsg(null), 3000);
    } catch (err) {
      setImportMsg(err.message);
      setTimeout(() => setImportMsg(null), 3000);
    }
    e.target.value = "";
  };

  return (
    <div className="page logs-page">
      <header className="home-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
        <p className="home-subtitle">Historique des séances</p>
      </header>

      {/* Backup buttons */}
      <div className="backup-section">
        <button className="backup-btn" onClick={exportData}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Sauvegarder
        </button>
        <button className="backup-btn" onClick={() => fileRef.current?.click()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          Restaurer
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleImport}
        />
      </div>
      {importMsg && <p className="import-msg">{importMsg}</p>}

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
            const vis = getSessionVisual(log.sessionId);

            return (
              <div key={i} className="log-card">
                <div
                  className="log-card-stripe"
                  style={{ background: `linear-gradient(180deg, ${vis.gradient[0]}, ${vis.gradient[1]})` }}
                />
                <div className="log-card-content">
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
                    <span>·</span>
                    <span>{completedSets} séries validées</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
