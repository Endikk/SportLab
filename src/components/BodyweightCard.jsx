import { useState } from "react";
import { saveBodyweight, getBodyweightHistory, getLatestBodyweight } from "../utils/storage";

function Sparkline({ data, color }) {
  if (data.length < 2) return null;

  const W = 200;
  const H = 50;
  const values = data.map((d) => d.kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.kg - min) / range) * (H - 6) - 3;
    return `${x},${y}`;
  });

  const last = data[data.length - 1];
  const lastX = W;
  const lastY = H - ((last.kg - min) / range) * (H - 6) - 3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bw-sparkline" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bw-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M${points.join(" L")} L${W},${H} L0,${H} Z`}
        fill="url(#bw-grad)"
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  );
}

export default function BodyweightCard() {
  const [history, setHistory] = useState(() => getBodyweightHistory());
  const [latest, setLatest] = useState(() => getLatestBodyweight());
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState("");

  const handleSave = () => {
    const kg = parseFloat(value.replace(",", "."));
    if (!isFinite(kg) || kg <= 0 || kg > 400) return;
    const today = new Date().toLocaleDateString("fr-CA");
    saveBodyweight(today, kg);
    setHistory(getBodyweightHistory());
    setLatest(getLatestBodyweight());
    setShowInput(false);
    setValue("");
  };

  const trend = (() => {
    if (history.length < 2) return null;
    const last = history[history.length - 1].kg;
    const prev = history[history.length - 2].kg;
    return Math.round((last - prev) * 10) / 10;
  })();

  return (
    <div className="bw-card">
      <div className="bw-header">
        <span className="barchart-label">Poids du corps</span>
        <button
          className="bw-add-btn"
          onClick={() => setShowInput(true)}
          aria-label="Ajouter une mesure"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {latest ? (
        <>
          <div className="bw-value-row">
            <span className="bw-value">{latest.kg}</span>
            <span className="bw-unit">kg</span>
            {trend !== null && trend !== 0 && (
              <span className={`barchart-trend ${trend > 0 ? "up" : "down"}`}>
                {trend > 0 ? "+" : ""}{trend}
              </span>
            )}
          </div>
          <Sparkline data={history} color="#34D399" />
          <span className="bw-date">
            Dernière mesure : {new Date(latest.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </span>
        </>
      ) : (
        <p className="bw-empty">Pas encore de mesure. Note ton poids pour suivre ta progression.</p>
      )}

      {showInput && (
        <div className="bw-modal-overlay" onClick={() => setShowInput(false)}>
          <div className="bw-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="bw-modal-title">Ton poids aujourd'hui</h3>
            <div className="bw-modal-input-wrap">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                className="bw-modal-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="75.5"
                autoFocus
              />
              <span className="bw-modal-unit">kg</span>
            </div>
            <div className="bw-modal-actions">
              <button className="bw-modal-btn cancel" onClick={() => setShowInput(false)}>
                Annuler
              </button>
              <button className="bw-modal-btn save" onClick={handleSave}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
