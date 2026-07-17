import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  GearSix,
  DownloadSimple,
  UploadSimple,
  Trophy,
  ArrowRight,
  Lightning,
  CaretRight,
  Info,
} from "@phosphor-icons/react";
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
          <GearSix size={22} weight="bold" aria-hidden="true" />
        </button>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="settings-panel">
          <h3 className="settings-title">Mes données</h3>
          <div className="settings-actions">
            <button className="settings-action-btn" onClick={exportData}>
              <DownloadSimple size={22} weight="bold" aria-hidden="true" />
              <div>
                <span className="settings-action-label">Sauvegarder</span>
                <span className="settings-action-desc">Télécharger un fichier de backup</span>
              </div>
            </button>
            <button className="settings-action-btn" onClick={() => fileRef.current?.click()}>
              <UploadSimple size={22} weight="bold" aria-hidden="true" />
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
          <span className="pr-trophy" aria-hidden="true"><Trophy size={26} weight="fill" /></span>
          <div className="pr-info">
            <span className="pr-label">Nouveau record</span>
            <span className="pr-text">
              {prExerciseName} — {recentPR.weight} kg
            </span>
          </div>
          <span className="pr-arrow" aria-hidden="true"><ArrowRight size={18} weight="bold" /></span>
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
          <span className="resume-arrow" aria-hidden="true"><ArrowRight size={18} weight="bold" /></span>
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
          <Lightning size={20} weight="fill" />
        </div>
        <div className="freestyle-cta-text">
          <span className="freestyle-cta-title">Séance libre</span>
          <span className="freestyle-cta-sub">Coche tes exos du jour et c'est parti</span>
        </div>
        <span className="freestyle-cta-arrow" aria-hidden="true"><CaretRight size={18} weight="bold" /></span>
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
                <Info size={15} weight="bold" aria-hidden="true" />
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
