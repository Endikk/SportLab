import { getTrainingHeatmap } from "../utils/storage";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

export default function TrainingHeatmap({ weeks = 12 }) {
  const matrix = getTrainingHeatmap(weeks);

  // Compte total séances visibles
  const total = matrix.reduce(
    (acc, week) => acc + week.filter((d) => d.trained).length,
    0
  );

  // Mois affichés (label en haut au changement de mois)
  const monthLabels = matrix.map((week, wIdx) => {
    const firstDay = new Date(week[0].date + "T12:00:00");
    if (wIdx === 0) return firstDay.toLocaleDateString("fr-FR", { month: "short" });
    const prevFirstDay = new Date(matrix[wIdx - 1][0].date + "T12:00:00");
    if (firstDay.getMonth() !== prevFirstDay.getMonth()) {
      return firstDay.toLocaleDateString("fr-FR", { month: "short" });
    }
    return "";
  });

  return (
    <div className="heatmap-card">
      <div className="muscle-vol-header">
        <span className="barchart-label">Calendrier ({weeks} sem)</span>
        <span className="muscle-vol-total">{total} séance{total > 1 ? "s" : ""}</span>
      </div>

      <div className="heatmap-wrap">
        <div className="heatmap-day-col">
          {DAY_LABELS.map((d, i) => (
            <span key={i} className="heatmap-day-label">{d}</span>
          ))}
        </div>

        <div className="heatmap-grid-wrap">
          <div className="heatmap-months">
            {monthLabels.map((m, i) => (
              <span key={i} className="heatmap-month-label">{m}</span>
            ))}
          </div>
          <div className="heatmap-grid">
            {matrix.map((week, wIdx) => (
              <div key={wIdx} className="heatmap-col">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    className={`heatmap-cell ${cell.trained ? "trained" : ""} ${cell.isToday ? "today" : ""} ${cell.isFuture ? "future" : ""}`}
                    title={`${cell.date}${cell.trained ? " · Séance" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
