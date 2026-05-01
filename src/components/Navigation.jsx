import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  {
    id: "home",
    path: "/",
    label: "Accueil",
    matches: (p) => p === "/" || p.startsWith("/session") || p.startsWith("/builder"),
    icon: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    id: "stats",
    path: "/stats",
    label: "Stats",
    matches: (p) => p === "/stats" || p === "/logs" || p.startsWith("/history"),
    icon: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
  },
  {
    id: "records",
    path: "/records",
    label: "Records",
    matches: (p) => p === "/records",
    icon: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
        <path d="M7 4H4v3a3 3 0 003 3M17 4h3v3a3 3 0 01-3 3" />
      </>
    ),
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
        return (
          <button
            key={tab.id}
            className={`nav-btn ${active ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {tab.icon}
            </svg>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
