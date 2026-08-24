---
paths:
  - "src/index.css"
  - "src/**/*.jsx"
---

# Règles CSS — SportLab

## Thème
- Utiliser UNIQUEMENT les CSS variables existantes dans `:root`
- Couleurs principales : `--accent` (vert forêt #2F5D3F), `--bg` (crème #FBF9F4), `--text-1` (vert sombre #1B2E22)
- Ne jamais hardcoder de couleurs — toujours `var(--nom-variable)`
- Thème clair inspiré de Center Parcs : fonds crème/blanc, accents vert forêt et vert feuille, caramel en secondaire
- Palette par groupe musculaire : `muscleColors` dans `utils/exerciseVisuals.js` — source unique, ne pas la redupliquer
- Texte blanc uniquement sur un fond coloré (dégradé, voile) — jamais sur crème ou blanc

## Layout
- Mobile-first : max-width 480px
- Padding de base : 16px
- Support safe-area : `env(safe-area-inset-*)`
- Bottom nav : 80px de padding-bottom sur le conteneur principal

## Classes
- Nommage kebab-case : `.exercise-card`, `.workout-page`
- Pas d'inline styles sauf gradients dynamiques depuis les données
- Animations : utiliser les easings existants (`--ease-out`, `--ease-spring`)

## Responsive
- Tester sur viewport 375px (iPhone SE) et 428px (iPhone 14 Pro Max)
- Pas de media queries desktop — l'app est mobile-only
