import { getVolumeByMuscleForPeriod } from "../utils/storage";
import { muscleColors } from "../utils/exerciseVisuals";

const PERIOD_LABEL = {
  "7d": "7 jours",
  "28d": "28 jours",
  "3m": "3 mois",
  "all": "tout",
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
          const color = muscleColors[group] || muscleColors.Autre;
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
