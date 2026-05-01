// ─── Gradient colors per muscle group (based on section title) ───

const sectionGradients = {
  pect:    ["#E8450E", "#FF6A13"],
  epaule:  ["#D97706", "#F59E0B"],
  triceps: ["#DC2626", "#EF4444"],
  biceps:  ["#BE185D", "#EC4899"],
  bras:    ["#BE185D", "#EC4899"],
  dos:     ["#2563EB", "#3B82F6"],
  trap:    ["#4F46E5", "#6366F1"],
  lomb:    ["#4F46E5", "#6366F1"],
  quad:    ["#059669", "#10B981"],
  ischio:  ["#047857", "#059669"],
  mollet:  ["#0D9488", "#14B8A6"],
  abdo:    ["#EA580C", "#F97316"],
  cardio:  ["#0EA5E9", "#22D3EE"],
  mobil:   ["#7C3AED", "#A78BFA"],
  etire:   ["#7C3AED", "#A78BFA"],
  custom:  ["#FF6B2C", "#FF8F52"],
};

export function getGradient(sectionTitle) {
  if (!sectionTitle) return sectionGradients.pect;
  const t = sectionTitle.toLowerCase();
  for (const [key, val] of Object.entries(sectionGradients)) {
    if (t.includes(key)) return val;
  }
  return sectionGradients.custom;
}

// ─── SVG icon paths per equipment type ───

const iconPaths = {
  barbell:
    "M1 10.5h2.5v3H1v-3zm3-2h2.5v7H4v-7zm3 2h10v3H7v-3zm10-2h2.5v7H17v-7zm3 2h2.5v3H20v-3z",
  dumbbell:
    "M3 9.5h2.5v5H3v-5zm3-1h1.5v7H6v-7zm2 2h8v3H8v-3zm8-2h1.5v7H16v-7zm2.5 1H21v5h-2.5v-5z",
  cable:
    "M10.5 2h3v2h-3V2zm0 2.5h3V5h1a1 1 0 011 1v1h-6V6a1 1 0 011-1h1V4.5zM12 8.5v4m-3 0h6m-4 0l-1 7.5h4l-1-7.5",
  machine:
    "M5 3h14a1 1 0 011 1v2H4V4a1 1 0 011-1zm0 4h14v2H4V7zm3 3h8v3a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3zm-2 7h12v2H6v-2z",
  bodyweight:
    "M12 2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM9.5 9.5h5a1 1 0 011 1l.5 5h-2l-.5 5.5h-3L10 15.5H8l.5-5a1 1 0 011-1z",
  cardio:
    "M12 4.5l-7 7 1.5 1.5L11 8.5V21h2V8.5l4.5 4.5L19 11.5l-7-7z",
  mobility:
    "M12 2.5a2 2 0 100 4 2 2 0 000-4zM6 22l3-9h6l3 9h-2.5l-2-6.5h-3l-2 6.5H6z",
};

export function getIconPath(exerciseName) {
  if (!exerciseName) return iconPaths.dumbbell;
  const n = exerciseName.toLowerCase();

  if (n.includes("barre") || n.includes("squat") || n.includes("soulevé"))
    return iconPaths.barbell;
  if (
    n.includes("poulie") || n.includes("tirage") || n.includes("câble") ||
    n.includes("cable") || n.includes("face pull") || n.includes("woodchop") ||
    n.includes("extension poulie")
  )
    return iconPaths.cable;
  if (
    n.includes("machine") || n.includes("presse") || n.includes("leg ext") ||
    n.includes("leg curl") || n.includes("mollet") || n.includes("hyper")
  )
    return iconPaths.machine;
  if (
    n.includes("dips") || n.includes("traction") || n.includes("gainage") ||
    n.includes("relevé") || n.includes("planche") || n.includes("crunch")
  )
    return iconPaths.bodyweight;
  if (
    n.includes("course") || n.includes("vélo") || n.includes("velo") ||
    n.includes("rameur") || n.includes("corde") || n.includes("hiit")
  )
    return iconPaths.cardio;
  if (
    n.includes("étire") || n.includes("etire") || n.includes("mobilité") ||
    n.includes("mobilite") || n.includes("yoga")
  )
    return iconPaths.mobility;

  return iconPaths.dumbbell;
}

// ─── Session visuals ───

const sessionVisuals = {
  push:  { emoji: "PUSH",  gradient: ["#E8450E", "#FF8C42"], icon: iconPaths.barbell },
  pull:  { emoji: "PULL",  gradient: ["#2563EB", "#60A5FA"], icon: iconPaths.barbell },
  legs:  { emoji: "LEGS",  gradient: ["#059669", "#34D399"], icon: iconPaths.machine },
  bonus: { emoji: "BONUS", gradient: ["#D97706", "#FBBF24"], icon: iconPaths.dumbbell },

  // Programme Hypertrophie 2 sem.
  "hyper-haut-a":  { emoji: "HAUT A", gradient: ["#E8450E", "#FF8C42"], icon: iconPaths.barbell },
  "hyper-full-a":  { emoji: "FULL A", gradient: ["#2563EB", "#60A5FA"], icon: iconPaths.dumbbell },
  "hyper-bas-a":   { emoji: "BAS A",  gradient: ["#059669", "#34D399"], icon: iconPaths.machine },
  "hyper-bras-a":  { emoji: "BRAS A", gradient: ["#BE185D", "#EC4899"], icon: iconPaths.dumbbell },
  "hyper-haut-b":  { emoji: "HAUT B", gradient: ["#D4500E", "#FF6A13"], icon: iconPaths.barbell },
  "hyper-full-b":  { emoji: "FULL B", gradient: ["#1D4ED8", "#3B82F6"], icon: iconPaths.dumbbell },
  "hyper-bas-b":   { emoji: "BAS B",  gradient: ["#047857", "#10B981"], icon: iconPaths.machine },
  "hyper-bras-b":  { emoji: "BRAS B", gradient: ["#9D174D", "#DB2777"], icon: iconPaths.dumbbell },
};

const TYPE_FALLBACK = {
  cardio:   { gradient: ["#0EA5E9", "#22D3EE"], icon: iconPaths.cardio,    emoji: "CARDIO" },
  mobility: { gradient: ["#7C3AED", "#A78BFA"], icon: iconPaths.mobility,  emoji: "MOBI" },
  custom:   { gradient: ["#FF6B2C", "#FF8F52"], icon: iconPaths.dumbbell,  emoji: "PERSO" },
  strength: { gradient: ["#FF6B2C", "#FF8F52"], icon: iconPaths.dumbbell,  emoji: "FORCE" },
};

// session peut être passée pour récupérer emoji/gradient personnalisés (séance custom)
export function getSessionVisual(sessionId, session = null) {
  if (sessionVisuals[sessionId]) return sessionVisuals[sessionId];
  if (session?.custom) {
    const fallback = TYPE_FALLBACK[session.type] || TYPE_FALLBACK.custom;
    const gradient = Array.isArray(session.gradient) && session.gradient.length === 2
      ? session.gradient
      : fallback.gradient;
    const emoji = (session.emoji || fallback.emoji).slice(0, 6);
    return { emoji, gradient, icon: fallback.icon };
  }
  return sessionVisuals.push;
}
