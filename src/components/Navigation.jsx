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
    id: "exos",
    path: "/exos",
    label: "Exos",
    matches: (p) => p === "/exos" || p === "/quick",
    icon: (
      <>
        <path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6" />
        <path d="M6.5 12h11" />
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
