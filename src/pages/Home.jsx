import { useNavigate } from "react-router-dom";
import { program } from "../data/program";

const sessionColors = {
  push: "#FF6A13",
  pull: "#FF8C42",
  legs: "#FF6A13",
  bonus: "#FF8C42",
};

const sessionIcons = {
  push: "M6 12h12M12 6v12",
  pull: "M12 6v12M6 12l6-6 6 6",
  legs: "M12 2v10m0 0l-4 10m4-10l4 10",
  bonus: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z",
};

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);
  const todaySchedule = program.schedule.find((s) => s.day === todayCapitalized);

  return (
    <div className="page home-page">
      <header className="home-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
        <p className="home-subtitle">{program.name}</p>
      </header>

      {todaySchedule && (
        <div className="today-banner">
          <span className="today-label">Aujourd'hui</span>
          <span className="today-session">
            {todaySchedule.session ? todaySchedule.label : "Repos"}
          </span>
        </div>
      )}

      <div className="schedule-section">
        <h2 className="section-title">Planning semaine</h2>
        <div className="schedule-grid">
          {program.schedule.map((item) => (
            <div
              key={item.day}
              className={`schedule-item ${item.session ? "active" : "rest"} ${item.day === todayCapitalized ? "today" : ""}`}
              onClick={() => item.session && navigate(`/session/${item.session}`)}
            >
              <span className="schedule-day">{item.day.substring(0, 3)}</span>
              <span
                className="schedule-label"
                style={item.session ? { color: sessionColors[item.session] } : {}}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="sessions-section">
        <h2 className="section-title">Séances</h2>
        <div className="sessions-list">
          {program.sessions.map((session) => (
            <div
              key={session.id}
              className="session-card"
              onClick={() => navigate(`/session/${session.id}`)}
              style={{ borderLeftColor: sessionColors[session.id] }}
            >
              <div className="session-card-header">
                <svg
                  className="session-icon"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={sessionColors[session.id]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={sessionIcons[session.id]} />
                </svg>
                <div>
                  <h3 className="session-card-title">{session.name}</h3>
                  <p className="session-card-muscles">{session.muscleGroups}</p>
                </div>
              </div>
              <div className="session-card-footer">
                <span className="session-day-badge">{session.day}</span>
                <span className="session-duration">{session.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
