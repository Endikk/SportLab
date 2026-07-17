// Filtre SVG de réfraction pour le "vrai" liquid glass (déformation du fond).
// Appliqué via `backdrop-filter: url(#lg-distortion)` sur les surfaces .lg.
// Ne fonctionne que sur Chromium ; ailleurs (iOS Safari, Firefox) la surface
// se dégrade proprement en flou CSS classique (voir redesign.css + main.jsx).
export default function GlassFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="lg-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.011"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.4" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
