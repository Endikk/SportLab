import { useParams, useNavigate } from "react-router-dom";
import { program } from "../data/program";
import { getExerciseHistory } from "../utils/storage";

function findExercise(id) {
  for (const session of program.sessions) {
    for (const section of session.sections) {
      const ex = section.exercises.find((e) => e.id === id);
      if (ex) return ex;
    }
  }
  return null;
}

function MiniChart({ data, color, label, unit, formatVal }) {
  if (data.length === 0) return null;

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const W = 300;
  const H = 100;
  const padX = 0;
  const padY = 8;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW);
    const y = padY + chartH - ((d.value - min) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${H} L${points[0].x},${H} Z`;

  const last = points[points.length - 1];
  const prev = points.length > 1 ? points[points.length - 2] : null;
  const trend = prev ? last.value - prev.value : 0;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-label">{label}</span>
        <div className="chart-value-row">
          <span className="chart-current" style={{ color }}>{formatVal(last.value)}{unit}</span>
          {trend !== 0 && (
            <span className={`chart-trend ${trend > 0 ? "up" : "down"}`}>
              {trend > 0 ? "+" : ""}{formatVal(trend)}
            </span>
          )}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${label})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4 : 2.5} fill={color} />
        ))}
      </svg>
      <div className="chart-dates">
        {data.length > 1 && (
          <>
            <span>{data[0].label}</span>
            <span>{data[data.length - 1].label}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = findExercise(exerciseId);
  const history = getExerciseHistory(exerciseId);

  if (!exercise) {
    return (
      <div className="page">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate("/")} aria-label="Retour">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="page-title">Exercice introuvable</h1>
        </header>
      </div>
    );
  }

  const maxWeight = history.reduce((max, h) => {
    const w = Math.max(...h.sets.map((s) => Number(s.weight) || 0));
    return w > max ? w : max;
  }, 0);

  // Chart data
  const fmtDate = (d) =>
    new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  const weightData = history.map((h) => ({
    value: Math.max(...h.sets.map((s) => Number(s.weight) || 0)),
    label: fmtDate(h.date),
  }));

  const volumeData = history.map((h) => ({
    value: h.sets.reduce((sum, s) => sum + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
    label: fmtDate(h.date),
  }));

  return (
    <div className="page history-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Retour">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">{exercise.name}</h1>
          <p className="page-subtitle">Historique</p>
        </div>
      </header>

      <div className="exercise-detail-card">
        <div className="detail-row">
          <span>Séries × Reps</span>
          <strong>{exercise.sets} × {exercise.reps}</strong>
        </div>
        <div className="detail-row">
          <span>Repos</span>
          <strong>{exercise.rest}</strong>
        </div>
        {maxWeight > 0 && (
          <div className="detail-row highlight">
            <span>Record</span>
            <strong>{maxWeight} kg</strong>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" aria-hidden="true">
            <path d="M6.5 6.5h-3v11h3v-11zM17.5 6.5h3v11h-3v-11zM6.5 10.5h11v3h-11z" />
          </svg>
          <p>Aucun historique pour cet exercice.</p>
          <p className="empty-hint">Lance une séance pour commencer le suivi !</p>
        </div>
      ) : (
        <div className="charts-section">
          <MiniChart
            data={weightData}
            color="#FF6B2C"
            label="Poids max"
            unit=" kg"
            formatVal={(v) => Math.round(v * 10) / 10}
          />
          <MiniChart
            data={volumeData}
            color="#34D399"
            label="Volume total"
            unit=" kg"
            formatVal={(v) => Math.round(v)}
          />
        </div>
      )}
    </div>
  );
}
