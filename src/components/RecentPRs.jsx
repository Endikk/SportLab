import { useNavigate } from "react-router-dom";
import { getRecentPRs } from "../utils/storage";

function fmtDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function RecentPRs({ period = "28d", limit = 3 }) {
  const navigate = useNavigate();
  const rows = getRecentPRs(period, limit);

  if (!rows.length) return null;

  return (
    <div className="prs-card">
      <div className="muscle-vol-header">
        <span className="barchart-label">Records récents</span>
        <span className="muscle-vol-total">{rows.length} battu{rows.length > 1 ? "s" : ""} sur la période</span>
      </div>
      <div className="prs-list">
        {rows.map((row) => (
          <button
            key={`${row.exerciseId}-${row.timestamp}`}
            className="pr-row"
            onClick={() => navigate(`/history/${row.exerciseId}`)}
          >
            <span className="pr-row-trophy" aria-hidden="true">🏆</span>
            <div className="pr-row-body">
              <span className="pr-row-name">{row.name}</span>
              <span className="pr-row-date">{fmtDate(row.date)}</span>
            </div>
            <div className="pr-row-stats">
              <span className="pr-row-weight">{row.weight} kg</span>
              <span className="pr-row-delta">+{row.delta} kg</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
