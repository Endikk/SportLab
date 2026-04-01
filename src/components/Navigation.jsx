import { useLocation, useNavigate } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isHistory = location.pathname === "/logs";

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      <button
        className={`nav-btn ${isHome ? "active" : ""}`}
        onClick={() => navigate("/")}
        aria-label="Programme"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Programme</span>
      </button>
      <button
        className={`nav-btn ${isHistory ? "active" : ""}`}
        onClick={() => navigate("/logs")}
        aria-label="Historique"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>Historique</span>
      </button>
    </nav>
  );
}
