// Marque SportLab — « la plaque » : un disque de fonte vu de face dont le trou
// central est un hexagone (le clin d'œil « Lab »).
// Géométrie pure (un cercle, un polygone) : reste nette de 16 à 512 px.

const HEX_POINTS = [0, 60, 120, 180, 240, 300]
  .map((a) => {
    const t = ((a + 30) * Math.PI) / 180;
    return `${(32 + 10 * Math.cos(t)).toFixed(2)},${(32 + 10 * Math.sin(t)).toFixed(2)}`;
  })
  .join(" ");

export function LogoMark({ size = 30, ring = "var(--accent)", core = "var(--caramel)" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className="logo-mark"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="23.5" fill="none" stroke={ring} strokeWidth="9.5" />
      <polygon points={HEX_POINTS} fill={core} />
    </svg>
  );
}

export default function Logo({ size = 30 }) {
  return (
    <div className="logo">
      <LogoMark size={size} />
      <span className="logo-word">
        <span className="logo-sport">SPORT</span>
        <span className="logo-lab">LAB</span>
      </span>
    </div>
  );
}
