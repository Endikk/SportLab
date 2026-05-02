import { useState, useMemo } from "react";
import {
  getRecentSessions,
  getAllSessions,
  findSessionById,
  getStatsForPeriod,
  getWeeklyStreak,
  getInsights,
  PERIOD_DAYS,
} from "../utils/storage";
import { getSessionVisual } from "../utils/exerciseVisuals";
import BarChart from "../components/BarChart";
import BodyweightCard from "../components/BodyweightCard";
import MuscleVolumeBars from "../components/MuscleVolumeBars";
import TopExercises from "../components/TopExercises";
import RecentPRs from "../components/RecentPRs";
import TrainingHeatmap from "../components/TrainingHeatmap";
import HeroStat from "../components/HeroStat";

const PERIODS = [
  { id: "7d", label: "7 jours" },
  { id: "28d", label: "28 jours" },
  { id: "3m", label: "3 mois" },
  { id: "all", label: "Tout" },
];

function buildSessionLabels() {
  const labels = {};
  for (const s of getAllSessions()) labels[s.id] = s.name;
  return labels;
}

function filterSessionsByPeriod(sessions, period) {
  const days = PERIOD_DAYS[period];
  if (!days) return sessions;
  const cutoff = Date.now() - days * 86400000;
  return sessions.filter((l) => (l.timestamp ?? new Date(l.date + "T12:00:00").getTime()) >= cutoff);
}

function buildChartData(sessions) {
  const reversed = sessions.slice().reverse();
  const fmtShort = (d) =>
    new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  const volumeData = reversed.slice(-12).map((log) => {
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

function formatBigNumber(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return Math.round(v);
}

const INSIGHT_ICONS = {
  up: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" />
    </svg>
  ),
  down: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M3 7l6 6 4-4 8 8" /><path d="M14 17h7v-7" />
    </svg>
  ),
  pr: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
    </svg>
  ),
  warn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
};

export default function Logs() {
  const [period, setPeriod] = useState("28d");

  const allSessions = getRecentSessions();
  const sessionLabels = buildSessionLabels();
  const stats = useMemo(() => getStatsForPeriod(period), [period]);
  const streak = useMemo(() => getWeeklyStreak(), []);
  const insights = useMemo(() => getInsights(period), [period]);
  const filteredSessions = useMemo(() => filterSessionsByPeriod(allSessions, period), [allSessions, period]);
  const { volumeData, weekData } = useMemo(() => buildChartData(filteredSessions), [filteredSessions]);

  return (
    <div className="page stats-page">
      <header className="home-header sticky-header">
        <div className="logo">
          <span className="logo-sport">SPORT</span>
          <span className="logo-lab">LAB.</span>
        </div>
      </header>

      <div className="page-title-row">
        <h1 className="big-title">Stats</h1>
        <span className="big-title-meta">
          {filteredSessions.length} séance{filteredSessions.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Period selector */}
      <div className="period-chips" role="tablist">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={period === p.id}
            className={`period-chip ${period === p.id ? "active" : ""}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {allSessions.length === 0 ? (
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
          {/* Insights */}
          {insights.length > 0 && (
            <div className="insights-list">
              {insights.map((ins, i) => (
                <div key={i} className={`insight-row insight-${ins.icon}`}>
                  <div className="insight-icon" aria-hidden="true">{INSIGHT_ICONS[ins.icon]}</div>
                  <span className="insight-text">{ins.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Hero stats — 4 cartes compactes */}
          <div className="hero-stats">
            <HeroStat
              label="Séances"
              value={stats.sessionsDone}
              sub={stats.sessionsPlanned !== null ? `/${stats.sessionsPlanned}` : null}
              hint="sur la période"
              info="Nombre de séances enregistrées sur la période. Le second nombre est le total prévu selon le calendrier hebdomadaire (4 séances/sem)."
            />
            {stats.adherence !== null ? (
              <HeroStat
                label="Adhérence"
                value={stats.adherence}
                sub="%"
                hint="vs prévu"
                color={stats.adherence >= 75 ? "var(--green)" : stats.adherence >= 50 ? "var(--accent)" : "var(--red)"}
                info="% de séances réalisées par rapport au calendrier prévu. ≥75 % = bon, 50-75 % = correct, <50 % = à rattraper."
              />
            ) : (
              <HeroStat
                label="Streak"
                value={streak}
                hint={`${streak > 1 ? "semaines" : "semaine"} d'affilée`}
                color={streak > 0 ? "var(--accent)" : "var(--text-3)"}
                info="Nombre de semaines consécutives avec au moins une séance, jusqu'à aujourd'hui."
              />
            )}
            <HeroStat
              label="Volume"
              value={formatBigNumber(stats.totalVolume)}
              hint="kg cumulés"
              info="Tonnage total soulevé sur la période. Calcul : Σ (poids × reps) de toutes les séries validées."
            />
            <HeroStat
              label="Séries"
              value={stats.totalSetsDone}
              hint="validées"
              info="Nombre total de séries (sets) cochées comme faites sur la période."
            />
          </div>

          {/* Hero stats moyennes — 3 cartes complémentaires */}
          <div className="hero-stats hero-stats-3">
            <HeroStat
              label="Vol / séance"
              value={formatBigNumber(stats.avgVolumePerSession)}
              hint="kg en moyenne"
              info="Volume moyen soulevé par séance. Indicateur de l'intensité moyenne de tes entraînements."
            />
            <HeroStat
              label="Durée moy."
              value={stats.avgDurationMin !== null ? stats.avgDurationMin : "—"}
              sub={stats.avgDurationMin !== null ? "min" : null}
              hint="par séance"
              info="Durée moyenne d'une séance, basée sur le chrono lancé pendant chaque entraînement (les anciennes séances sans chrono ne comptent pas)."
            />
            <HeroStat
              label="Charge moy."
              value={stats.avgWeightLifted || "—"}
              hint="kg / rep"
              info="Poids moyen soulevé par rep. Calcul : volume total ÷ reps totales. Reflète la charge typique de travail."
            />
          </div>

          {/* Bodyweight */}
          <BodyweightCard />

          {/* PR récents — très motivant */}
          <RecentPRs period={period} limit={3} />

          {/* Top exercices */}
          <TopExercises period={period} limit={5} />

          {/* Volume par groupe musculaire */}
          <MuscleVolumeBars period={period} />

          {/* Heatmap calendrier */}
          <TrainingHeatmap weeks={12} />

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
          {filteredSessions.length === 0 ? (
            <p className="empty-hint" style={{ textAlign: "center", padding: "16px 0" }}>
              Aucune séance sur cette période
            </p>
          ) : (
            <div className="logs-list">
              {filteredSessions.map((log, i) => {
                const exerciseCount = log.exercises ? Object.keys(log.exercises).length : 0;
                const completedSets = log.exercises
                  ? Object.values(log.exercises).reduce((acc, ex) => acc + (ex.sets?.filter((s) => s.done).length ?? 0), 0)
                  : 0;
                const totalSets = log.exercises
                  ? Object.values(log.exercises).reduce((acc, ex) => acc + (ex.sets?.length ?? 0), 0)
                  : 0;
                const vis = getSessionVisual(log.sessionId, findSessionById(log.sessionId));
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
                        <div className="log-badge">{completedSets}/{totalSets}</div>
                      </div>
                      <div className="log-session-name">{sessionLabels[log.sessionId] || log.sessionId}</div>
                      <div className="log-meta">
                        <span>{exerciseCount} exercices</span>
                        <span>·</span>
                        <span>{completedSets} séries</span>
                        {log.durationMin && (<><span>·</span><span>{log.durationMin} min</span></>)}
                        {log.bodyweight && (<><span>·</span><span>{log.bodyweight} kg</span></>)}
                        {log.mood && (<><span>·</span><span>{["😴", "😐", "🙂", "💪", "🔥"][log.mood - 1]}</span></>)}
                      </div>
                      {log.note && <p className="log-note">{log.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
