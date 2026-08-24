import { useNavigate } from "react-router-dom";
import {
  getWorkoutInProgress,
  findSessionById,
  VISIBLE_PROGRAMS,
  ACTIVE_PROGRAM,
  getActiveSchedule,
} from "../utils/storage";
import { getSessionVisual } from "../utils/exerciseVisuals";

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);
  const activeSchedule = getActiveSchedule(ACTIVE_PROGRAM.id);
  const todaySchedule = activeSchedule.find((s) => s.day === todayCapitalized);

  const inProgress = getWorkoutInProgress();

  const todaySession = todaySchedule?.session
    ? ACTIVE_PROGRAM.sessions.find((s) => s.id === todaySchedule?.session)
    : null;
  const todayVisual = todaySchedule?.session
    ? getSessionVisual(todaySchedule.session)
    : null;


  const renderSessionCard = (session) => {
    const vis = getSessionVisual(session.id);
    const isToday = todaySchedule?.session === session.id;

    return (
      <button
        key={session.id}
        className={`session-tile ${isToday ? "today" : ""}`}
        onClick={() => navigate(`/workout/${session.id}`)}
        aria-label={`Démarrer ${session.name}`}
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
      </button>
    );
  };

  return (
    <div className="page home-page">
      <header className="home-header sticky-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
      </header>



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
              <span className="today-tag">Aujourd'hui</span>
              <h2 className="today-hero-title">{todayVisual.emoji}</h2>
            </div>
          </div>
          <div className="today-hero-body">
            <div className="today-hero-text">
              <p className="today-hero-muscles">{todaySession.muscleGroups}</p>
              <p className="today-hero-duration">{todaySession.duration}</p>
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
