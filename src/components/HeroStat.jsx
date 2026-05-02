import { useState } from "react";

export default function HeroStat({ label, value, sub, hint, info, color }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="hero-stat">
      <div className="hero-stat-top">
        <span className="hero-stat-label">{label}</span>
        {info && (
          <button
            className={`hero-stat-info-btn ${showInfo ? "active" : ""}`}
            onClick={() => setShowInfo((s) => !s)}
            aria-label={`Info ${label}`}
            type="button"
          >
            i
          </button>
        )}
      </div>
      <span className="hero-stat-value" style={color ? { color } : undefined}>
        {value}
        {sub && <span className="hero-stat-sub">{sub}</span>}
      </span>
      <span className="hero-stat-hint">{hint}</span>

      {showInfo && info && (
        <button
          type="button"
          className="hero-stat-tooltip"
          onClick={() => setShowInfo(false)}
        >
          {info}
        </button>
      )}
    </div>
  );
}
