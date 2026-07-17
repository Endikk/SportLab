import { useLocation, useNavigate } from "react-router-dom";
import { House, ChartBar, Trophy } from "@phosphor-icons/react";

const TABS = [
  {
    id: "home",
    path: "/",
    label: "Accueil",
    matches: (p) => p === "/" || p.startsWith("/session") || p.startsWith("/builder"),
    Icon: House,
  },
  {
    id: "stats",
    path: "/stats",
    label: "Stats",
    matches: (p) => p === "/stats" || p === "/logs" || p.startsWith("/history"),
    Icon: ChartBar,
  },
  {
    id: "records",
    path: "/records",
    label: "Records",
    matches: (p) => p === "/records",
    Icon: Trophy,
  },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const isWorkout = path.startsWith("/workout");

  if (isWorkout) return null;

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {TABS.map((tab) => {
        const active = tab.matches(path);
        const { Icon } = tab;
        return (
          <button
            key={tab.id}
            className={`nav-btn ${active ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={23} weight={active ? "fill" : "regular"} aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
