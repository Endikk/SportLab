import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWorkoutInProgress,
  getRecentSessions,
  exportData,
  importData,
  hasRecentPR,
  findExerciseById,
  findSessionById,
  VISIBLE_PROGRAMS,
  ACTIVE_PROGRAM,
  getActiveSchedule,
  getCurrentWeekVariant,
} from "../utils/storage";
import { getSessionVisual } from "../utils/exerciseVisuals";

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);
  const activeSchedule = getActiveSchedule(ACTIVE_PROGRAM.id);
  const todaySchedule = activeSchedule.find((s) => s.day === todayCapitalized);
  const variant = getCurrentWeekVariant();

  const inProgress = getWorkoutInProgress();
  const recentSessions = getRecentSessions();
  const lastSession = recentSessions[0];
  const recentPR = hasRecentPR(7);
  const prExerciseName = recentPR ? findExerciseById(recentPR.exerciseId)?.exercise?.name : null;

  const [now] = useState(() => Date.now());
  const daysSince = lastSession
    ? Math.floor((now - lastSession.timestamp) / 86400000)
    : null;

  const todaySession = todaySchedule?.session
    ? ACTIVE_PROGRAM.sessions.find((s) => s.id === todaySchedule?.session)
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
      const out = await importData(file);
      setMsg(out);
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg(err.message);
      setTimeout(() => setMsg(null), 3000);
    }
    e.target.value = "";
  };

  const renderSessionCard = (session) => {
    const vis = getSessionVisual(session.id);
    const isToday = todaySchedule?.session === session.id;

    return (
      <div
        key={session.id}
        className={`session-tile ${isToday ? "today" : ""}`}
        onClick={() => navigate(`/workout/${session.id}`)}
      >
        <div
          className="session-tile-visual"
          style={{ background: `linear-gradient(135deg, ${vis.gradient[0]}, ${vis.gradient[1]})` }}
        >
          <svg viewBox="0 0 24 24" fill="white" opacity="0.2" className="session-tile-icon" aria-hidden="true">
            <path d={vis.icon} />
          </svg>
          <span className="session-tile-emoji">{vis.emoji}</span>
          {session.bonus && <span className="session-tile-badge">Bonus</span>}
        </div>
        <div className="session-tile-body">
          <span className="session-tile-name">{session.muscleGroups}</span>
          <span className="session-tile-meta">{session.day.substring(0, 3)} · {session.duration}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="page home-page">
      <header className="home-header sticky-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(!showSettings)} aria-label="Paramètres">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <div>
                <span className="settings-action-label">Sauvegarder</span>
                <span className="settings-action-desc">Télécharger un fichier de backup</span>
              </div>
            </button>
            <button className="settings-action-btn" onClick={() => fileRef.current?.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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

      {/* Recent PR badge */}
      {recentPR && prExerciseName && (
        <button
          className="pr-banner"
          onClick={() => navigate(`/history/${recentPR.exerciseId}`)}
        >
          <span className="pr-trophy" aria-hidden="true">🏆</span>
          <div className="pr-info">
            <span className="pr-label">Nouveau record</span>
            <span className="pr-text">
              {prExerciseName} — {recentPR.weight} kg
            </span>
          </div>
          <span className="pr-arrow" aria-hidden="true">&rarr;</span>
        </button>
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
              {findSessionById(inProgress.sessionId)?.name || inProgress.sessionId}
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
            <svg viewBox="0 0 24 24" className="today-hero-icon" fill="white" opacity="0.15" aria-hidden="true">
              <path d={todayVisual.icon} />
            </svg>
            <div className="today-hero-overlay">
              <span className="today-tag">Aujourd'hui · Sem {variant.toUpperCase()}</span>
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

      {/* Quick CTA — séance libre */}
      <button className="freestyle-cta" onClick={() => navigate("/quick")}>
        <div className="freestyle-cta-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="freestyle-cta-text">
          <span className="freestyle-cta-title">Séance libre</span>
          <span className="freestyle-cta-sub">Coche tes exos du jour et c'est parti</span>
        </div>
        <span className="freestyle-cta-arrow" aria-hidden="true">&rarr;</span>
      </button>

      {/* Week strip — compact */}
      <div className="week-strip">
        {activeSchedule.map((item) => {
          const vis = item.session ? getSessionVisual(item.session) : null;
          const isToday = item.day === todayCapitalized;
          return (
            <button
              key={item.day}
              className={`week-pill ${item.session ? "active" : "rest"} ${isToday ? "today" : ""}`}
              onClick={() => item.session && navigate(`/workout/${item.session}`)}
              disabled={!item.session}
              aria-label={`${item.day} — ${item.label}`}
            >
              <span className="week-pill-day">{item.day.substring(0, 1)}</span>
              <span
                className={`week-pill-dot ${item.session ? "filled" : ""}`}
                style={vis ? { background: vis.gradient[0] } : undefined}
              />
            </button>
          );
        })}
      </div>

      {/* Sessions — programmes uniquement (séances libres via le CTA en haut) */}
      <div className="sessions-block">
        <h2 className="big-title" style={{ marginBottom: 14 }}>Tes séances</h2>

        {VISIBLE_PROGRAMS.map((prog, idx) => (
          <div key={prog.id}>
            {idx > 0 && <div className="sessions-divider" role="presentation" />}
            <div className="sessions-sublabel-row">
              <span className="sessions-sublabel">{prog.name}</span>
              <button
                className="sessions-info-btn"
                onClick={() => navigate(`/programme/${prog.id}`)}
                aria-label={`Infos ${prog.name}`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Infos</span>
              </button>
            </div>
            <div className="session-grid">
              {prog.sessions.map((s) => renderSessionCard(s))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
