---
paths:
  - "src/index.css"
  - "src/**/*.jsx"
---

# Règles CSS — SportLab

## Thème
- Utiliser UNIQUEMENT les CSS variables existantes dans `:root`
- Couleurs principales : `--accent` (orange), `--bg` (noir), `--text-1` (blanc)
- Ne jamais hardcoder de couleurs — toujours `var(--nom-variable)`
- Thème OLED-friendly : pas de blanc pur, pas de gris clair

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
