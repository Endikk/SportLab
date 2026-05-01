import { getVolumeByMuscleForPeriod } from "../utils/storage";

const PERIOD_LABEL = {
  "7d": "7 jours",
  "28d": "28 jours",
  "3m": "3 mois",
  "all": "tout",
};

const GROUP_COLORS = {
  Pectoraux: "#FF6A13",
  Dos: "#3B82F6",
  Épaules: "#F59E0B",
  Biceps: "#EC4899",
  Triceps: "#EF4444",
  Bras: "#EC4899",
  Trapèzes: "#6366F1",
  Lombaires: "#6366F1",
  Quadriceps: "#10B981",
  Ischios: "#059669",
  Mollets: "#14B8A6",
  Abdos: "#F97316",
  Cardio: "#22D3EE",
  Mobilité: "#A78BFA",
  Autre: "#5A5A65",
};

function formatVolume(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return Math.round(v);
}

export default function MuscleVolumeBars({ period = "28d" }) {
  const data = getVolumeByMuscleForPeriod(period);

  if (!data.length) return null;

  const max = data[0].value;

  return (
    <div className="muscle-vol-card">
      <div className="muscle-vol-header">
        <span className="barchart-label">Volume par muscle · {PERIOD_LABEL[period]}</span>
        <span className="muscle-vol-total">
          Total {formatVolume(data.reduce((a, b) => a + b.value, 0))} kg
        </span>
      </div>
      <div className="muscle-vol-list">
        {data.map(({ group, value }) => {
          const pct = (value / max) * 100;
          const color = GROUP_COLORS[group] || GROUP_COLORS.Autre;
          return (
            <div key={group} className="muscle-vol-row">
              <span className="muscle-vol-group">{group}</span>
              <div className="muscle-vol-track">
                <div
                  className="muscle-vol-bar"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="muscle-vol-value">{formatVolume(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
