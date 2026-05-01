import { useEffect, useRef, useState } from "react";

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RestTimer({ initialSec, onClose }) {
  const [sec, setSec] = useState(initialSec);
  const [paused, setPaused] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (paused) return undefined;
    if (sec <= 0) return undefined;
    const id = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            try { navigator.vibrate?.([180, 80, 180]); } catch { /* noop */ }
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, sec]);

  const adjust = (delta) => setSec((s) => Math.max(0, Math.min(900, s + delta)));

  const isLow = sec > 0 && sec <= 10;
  const isDone = sec === 0;

  return (
    <div className={`rest-timer ${isLow ? "low" : ""} ${isDone ? "done" : ""}`}>
      <button className="rest-timer-close" onClick={onClose} aria-label="Fermer le timer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="rest-timer-info">
        <span className="rest-timer-label">{isDone ? "Repos terminé" : "Repos"}</span>
        <span className="rest-timer-value">{fmt(sec)}</span>
      </div>

      <div className="rest-timer-actions">
        <button className="rest-timer-btn" onClick={() => adjust(-15)} aria-label="-15s">−15</button>
        <button
          className="rest-timer-btn primary"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Reprendre" : "Pause"}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          )}
        </button>
        <button className="rest-timer-btn" onClick={() => adjust(15)} aria-label="+15s">+15</button>
      </div>
    </div>
  );
}
