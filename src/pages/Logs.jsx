import { program } from "../data/program";
import { getRecentSessions } from "../utils/storage";
import { getSessionVisual } from "../utils/exerciseVisuals";
import BarChart from "../components/BarChart";

const sessionLabels = {};
for (const s of program.sessions) {
  sessionLabels[s.id] = s.name;
}

function buildChartData(sessions) {
  const reversed = sessions.slice().reverse();

  const fmtShort = (d) =>
    new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  // Volume per session (last 10)
  const volumeData = reversed.slice(-10).map((log) => {
    let vol = 0;
    if (log.exercises) {
      for (const ex of Object.values(log.exercises)) {
        for (const s of ex.sets || []) {
          vol += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      }
    }
    return {
      value: vol,
      label: fmtShort(log.date),
      short: fmtShort(log.date).split(" ")[0],
    };
  });

  // Sessions per week (last 8 weeks)
  const weekMap = {};
  for (const log of sessions) {
    const d = new Date(log.date + "T12:00:00");
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    const key = `${d.getFullYear()}-${weekNum}`;
    if (!weekMap[key]) weekMap[key] = { count: 0, label: `Sem. ${weekNum}`, short: `S${weekNum}` };
    weekMap[key].count++;
  }
  const weekData = Object.values(weekMap).slice(-8).map((w) => ({
    value: w.count,
    label: w.label,
    short: w.short,
  }));

  return { volumeData, weekData };
}

export default function Logs() {
  const sessions = getRecentSessions();
  const { volumeData, weekData } = buildChartData(sessions);

  return (
    <div className="page logs-page">
      <header className="home-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
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
        <>
          {/* Charts */}
          <div className="charts-section">
            <BarChart
              data={volumeData}
              color="#FF6B2C"
              label="Volume par séance"
              unit=" kg"
              formatVal={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v)}
            />
            <BarChart
              data={weekData}
              color="#34D399"
              label="Séances / semaine"
              unit=""
              formatVal={(v) => Math.round(v)}
            />
          </div>

          {/* Session list */}
          <h3 className="logs-section-title">Historique</h3>
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
        </>
      )}
    </div>
  );
}
