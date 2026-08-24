import { useCallback, useEffect, useRef, useState } from "react";

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RestTimer({ initialSec, onClose }) {
  // Le décompte est dérivé d'une échéance absolue, pas d'un compteur décrémenté :
  // un setInterval est throttlé en arrière-plan et dérive à chaque tick recréé.
  const deadlineRef = useRef(null);
  const remainingWhilePausedRef = useRef(initialSec * 1000);
  const finishedRef = useRef(false);

  const [sec, setSec] = useState(initialSec);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    if (deadlineRef.current === null) deadlineRef.current = Date.now() + initialSec * 1000;

    const tick = () => {
      const msLeft = deadlineRef.current - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));
      setSec(next);
      if (next === 0 && !finishedRef.current) {
        finishedRef.current = true;
        try {
          navigator.vibrate?.([180, 80, 180]);
        } catch {
          /* vibration indisponible (iOS Safari) */
        }
      }
    };

    tick();
    const id = setInterval(tick, 500);
    // Au retour d'arrière-plan, on recale immédiatement plutôt que d'attendre un tick.
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [paused, initialSec]);

  // Wake Lock : sans lui, l'écran s'éteint pendant le repos et le décompte décroche.
  useEffect(() => {
    let lock = null;
    let cancelled = false;

    const request = async () => {
      try {
        if (!("wakeLock" in navigator)) return;
        const next = await navigator.wakeLock.request("screen");
        if (cancelled) {
          next.release().catch(() => {});
          return;
        }
        lock = next;
      } catch {
        /* refusé ou non supporté */
      }
    };

    request();
    const onVisible = () => {
      if (document.visibilityState === "visible" && !lock) request();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release?.().catch(() => {});
    };
  }, []);

  const togglePause = useCallback(() => {
    setPaused((wasPaused) => {
      if (wasPaused) {
        deadlineRef.current = Date.now() + remainingWhilePausedRef.current;
      } else {
        remainingWhilePausedRef.current = Math.max(0, deadlineRef.current - Date.now());
      }
      return !wasPaused;
    });
  }, []);

  const adjust = useCallback((deltaSec) => {
    const deltaMs = deltaSec * 1000;
    if (paused) {
      remainingWhilePausedRef.current = Math.max(0, Math.min(900_000, remainingWhilePausedRef.current + deltaMs));
      setSec(Math.ceil(remainingWhilePausedRef.current / 1000));
      return;
    }
    const msLeft = Math.max(0, Math.min(900_000, deadlineRef.current - Date.now() + deltaMs));
    deadlineRef.current = Date.now() + msLeft;
    if (msLeft > 0) finishedRef.current = false;
    setSec(Math.ceil(msLeft / 1000));
  }, [paused]);

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
        {/* aria-live : la vibration est ignorée sur iOS, il faut une annonce */}
        <span className="rest-timer-value" role="timer" aria-live={isDone ? "assertive" : "off"}>
          {fmt(sec)}
        </span>
      </div>

      <div className="rest-timer-actions">
        <button className="rest-timer-btn" onClick={() => adjust(-15)} aria-label="Retirer 15 secondes">−15</button>
        <button
          className="rest-timer-btn primary"
          onClick={togglePause}
          aria-label={paused ? "Reprendre le repos" : "Mettre le repos en pause"}
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
        <button className="rest-timer-btn" onClick={() => adjust(15)} aria-label="Ajouter 15 secondes">+15</button>
      </div>
    </div>
  );
}
