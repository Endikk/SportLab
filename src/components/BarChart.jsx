import { useState, useRef } from "react";

const MAX_VISIBLE = 12;

export default function BarChart({ data, color, label, unit, formatVal }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const scrollRef = useRef(null);

  if (!data || data.length === 0) return null;

  // Show last MAX_VISIBLE entries, scrollable if more
  const showScroll = data.length > MAX_VISIBLE;
  const displayData = showScroll ? data : data;

  const values = displayData.map((d) => d.value);
  const max = Math.max(...values) || 1;

  const last = displayData[displayData.length - 1];
  const prev = displayData.length > 1 ? displayData[displayData.length - 2] : null;
  const trend = prev ? last.value - prev.value : 0;
  const active = activeIdx !== null ? displayData[activeIdx] : last;

  // Show label every N bars to avoid overlap
  const labelStep = displayData.length > 16 ? 4 : displayData.length > 8 ? 2 : 1;

  return (
    <div className="barchart-card">
      <div className="barchart-header">
        <span className="barchart-label">{label}</span>
        <div className="barchart-value-row">
          <span className="barchart-current" style={{ color }}>
            {formatVal(active.value)}{unit}
          </span>
          {activeIdx === null && trend !== 0 && (
            <span className={`barchart-trend ${trend > 0 ? "up" : "down"}`}>
              {trend > 0 ? "+" : ""}{formatVal(trend)}
            </span>
          )}
        </div>
        {activeIdx !== null && (
          <span className="barchart-active-date">{active.label}</span>
        )}
      </div>

      <div
        ref={scrollRef}
        className={`barchart-scroll ${showScroll ? "scrollable" : ""}`}
        onTouchEnd={() => setActiveIdx(null)}
        onMouseLeave={() => setActiveIdx(null)}
      >
        <div
          className="barchart-bars"
          style={showScroll ? { width: `${displayData.length * 32}px` } : undefined}
        >
          {displayData.map((d, i) => {
            const h = Math.max((d.value / max) * 100, 3);
            const isLast = i === displayData.length - 1;
            const isActive = activeIdx === i;
            const showLabel = i % labelStep === 0 || isLast;
            return (
              <div
                key={i}
                className={`barchart-col ${isActive ? "active" : ""}`}
                onTouchStart={() => setActiveIdx(i)}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <div className="barchart-bar-track">
                  <div
                    className="barchart-bar"
                    style={{
                      height: `${h}%`,
                      background: isLast || isActive ? color : `${color}44`,
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                </div>
                {showLabel && (
                  <span className="barchart-bar-label">{d.short || ""}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
