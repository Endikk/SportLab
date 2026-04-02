import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { program } from "../data/program";
import { getWorkoutInProgress, getRecentSessions, exportData, importData } from "../utils/storage";
import { getSessionVisual } from "../utils/exerciseVisuals";

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);
  const todaySchedule = program.schedule.find((s) => s.day === todayCapitalized);

  const inProgress = getWorkoutInProgress();
  const recentSessions = getRecentSessions();
  const lastSession = recentSessions[0];

  const [now] = useState(() => Date.now());
  const daysSince = lastSession
    ? Math.floor((now - lastSession.timestamp) / 86400000)
    : null;

  const todaySession = todaySchedule?.session
    ? program.sessions.find((s) => s.id === todaySchedule.session)
    : null;
  const todayVisual = todaySchedule?.session
    ? getSessionVisual(todaySchedule.session)
    : null;

  // Settings panel
  const [showSettings, setShowSettings] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const msg = await importData(file);
      setMsg(msg);
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg(err.message);
      setTimeout(() => setMsg(null), 3000);
    }
    e.target.value = "";
  };

  return (
    <div className="page home-page">
      <header className="home-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(!showSettings)} aria-label="Paramètres">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="settings-panel">
          <h3 className="settings-title">Mes données</h3>
          <div className="settings-actions">
            <button className="settings-action-btn" onClick={exportData}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <div>
                <span className="settings-action-label">Sauvegarder</span>
                <span className="settings-action-desc">Télécharger un fichier de backup</span>
              </div>
            </button>
            <button className="settings-action-btn" onClick={() => fileRef.current?.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <div>
                <span className="settings-action-label">Restaurer</span>
                <span className="settings-action-desc">Importer depuis un fichier</span>
              </div>
            </button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleImport} />
          </div>
          {msg && <p className="settings-msg">{msg}</p>}
        </div>
      )}

      {/* Resume in-progress workout */}
      {inProgress && (
        <button
          className="resume-banner"
          onClick={() => navigate(`/workout/${inProgress.sessionId}`)}
        >
          <div className="resume-pulse" />
          <div className="resume-info">
            <span className="resume-label">Séance en cours</span>
            <span className="resume-session">
              {program.sessions.find((s) => s.id === inProgress.sessionId)?.name || inProgress.sessionId}
            </span>
          </div>
          <span className="resume-arrow">&rarr;</span>
        </button>
      )}

      {/* Today's session - hero card */}
      {todaySession ? (
        <div className="today-hero">
          <div
            className="today-hero-visual"
            style={{ background: `linear-gradient(135deg, ${todayVisual.gradient[0]}, ${todayVisual.gradient[1]})` }}
          >
            <svg viewBox="0 0 24 24" className="today-hero-icon" fill="white" opacity="0.15">
              <path d={todayVisual.icon} />
            </svg>
            <div className="today-hero-overlay">
              <span className="today-tag">Aujourd'hui</span>
              <h2 className="today-hero-title">{todayVisual.emoji}</h2>
            </div>
          </div>
          <div className="today-hero-body">
            <div className="today-hero-text">
              <p className="today-hero-muscles">{todaySession.muscleGroups}</p>
              <p className="today-hero-duration">
                {todaySession.duration}
                {daysSince !== null && daysSince >= 1 && (
                  <span className="streak-dot"> · Dernière séance {daysSince === 1 ? "hier" : `il y a ${daysSince}j`}</span>
                )}
              </p>
            </div>
            <div className="today-hero-actions">
              <button
                className="hero-start-btn"
                onClick={() => navigate(`/workout/${todaySchedule.session}`)}
              >
                C'est parti
              </button>
              <button
                className="hero-detail-btn"
                onClick={() => navigate(`/session/${todaySchedule.session}`)}
              >
                Voir les exos
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="today-rest">
          <span className="today-tag">Aujourd'hui</span>
          <h2 className="rest-title">Repos</h2>
          <p className="rest-subtitle">Récupération et mobilité</p>
        </div>
      )}

      {/* Quick access to all sessions */}
      <div className="quick-sessions">
        <h2 className="home-section-title">Séances</h2>
        <div className="session-grid">
          {program.sessions.map((session) => {
            const vis = getSessionVisual(session.id);
            const isToday = todaySchedule?.session === session.id;
            return (
              <div
                key={session.id}
                className={`quick-session-card ${isToday ? "today" : ""}`}
                onClick={() => navigate(`/workout/${session.id}`)}
              >
                <div
                  className="quick-session-visual"
                  style={{ background: `linear-gradient(135deg, ${vis.gradient[0]}, ${vis.gradient[1]})` }}
                >
                  <svg viewBox="0 0 24 24" fill="white" opacity="0.2" className="quick-session-icon">
                    <path d={vis.icon} />
                  </svg>
                  <span className="quick-session-label">{vis.emoji}</span>
                </div>
                <div className="quick-session-body">
                  <div className="quick-session-top">
                    <span className="quick-session-muscles">{session.muscleGroups}</span>
                    <span className="quick-session-day">{session.day.substring(0, 3)}</span>
                  </div>
                  <span className="quick-session-duration">{session.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly overview */}
      <div className="week-overview">
        <h2 className="home-section-title">Cette semaine</h2>
        <div className="week-row">
          {program.schedule.map((item) => {
            const vis = item.session ? getSessionVisual(item.session) : null;
            return (
              <div
                key={item.day}
                className={`week-day ${item.session ? "active" : "rest"} ${item.day === todayCapitalized ? "today" : ""}`}
                onClick={() => item.session && navigate(`/workout/${item.session}`)}
              >
                <span className="week-day-label">{item.day.substring(0, 2)}</span>
                <div
                  className={`week-day-dot ${item.session ? "filled" : ""}`}
                  style={vis ? { background: vis.gradient[0] } : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
