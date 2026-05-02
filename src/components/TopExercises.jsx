import { useNavigate } from "react-router-dom";
import { getTopExercises } from "../utils/storage";

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

export default function TopExercises({ period = "28d", limit = 5 }) {
  const navigate = useNavigate();
  const rows = getTopExercises(period, limit);

  if (!rows.length) return null;

  return (
    <div className="top-exos-card">
      <div className="muscle-vol-header">
        <span className="barchart-label">Top exercices</span>
        <span className="muscle-vol-total">{rows.length} les plus faits</span>
      </div>
      <div className="top-exos-list">
        {rows.map((row, i) => {
          const color = GROUP_COLORS[row.muscleGroup] || GROUP_COLORS.Autre;
          return (
            <button
              key={row.exerciseId}
              className="top-exo-row"
              onClick={() => navigate(`/history/${row.exerciseId}`)}
            >
              <span className="top-exo-rank">{i + 1}</span>
              <div className="top-exo-body">
                <span className="top-exo-name">{row.name}</span>
                <span className="top-exo-meta">
                  <span style={{ color }}>{row.muscleGroup}</span>
                  {" · "}
                  {row.count}× sur la période
                </span>
              </div>
              <div className="top-exo-stats">
                <span className="top-exo-stat">
                  <span className="top-exo-stat-label">Max</span>
                  <span className="top-exo-stat-value">{row.maxWeight || "—"} kg</span>
                </span>
                <span className="top-exo-stat">
                  <span className="top-exo-stat-label">Moy.</span>
                  <span className="top-exo-stat-value">{row.avgWeight || "—"} kg</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
