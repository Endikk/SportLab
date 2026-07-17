---
paths:
  - "src/index.css"
  - "src/styles/*.css"
  - "src/**/*.jsx"
---

# Règles CSS — SportLab

## Thème (Redesign 2026 — clair + liquid glass)
- Deux feuilles : `src/index.css` (base historique) puis `src/styles/redesign.css` (skin actuel, importé après → gagne la cascade)
- Thème **clair** : fonds lavande/gris très clairs, jamais de blanc pur pour la page
- Accent **indigo/violet** : `--accent` (#6C4CF1), dégradé signature `--accent-grad`
- Utiliser UNIQUEMENT les CSS variables (`--accent`, `--bg`, `--text-1`, `--green`, etc.) — ne jamais hardcoder une couleur
- Texte : `--text-1` (presque noir), `--text-2`, `--text-3` (jamais de noir pur)

## Liquid glass (iOS 26)
- Uniquement en CSS natif `backdrop-filter` (seule technique fiable sur iOS Safari, cible PWA)
- Réutiliser les tokens : `--glass-bg-strong`, `--glass-blur`, `--glass-highlight`, `--glass-shadow` (ou la classe `.glass`)
- Surfaces glass : barres flottantes (nav, timer, nav exercices), headers sticky, pills sur visuels, modales
- Ne PAS ajouter de lib liquid-glass externe (SVG displacement = Chrome-only, cassé sur Safari)

## Pas de bordures
- Aucune bordure dure visible (`1px solid`) : hiérarchie via ombres douces (`--shadow*`), espacement et glass
- `--border` / `--border-light` restent définies pour l'héritage mais s'utilisent avec parcimonie (hairlines quasi invisibles)

## Icônes
- `@phosphor-icons/react` — importer les icônes nommées (tree-shaking)
- `weight="fill"` pour les états actifs, `weight="bold"` sinon ; `size` en px ; couleur via `currentColor`
- `aria-hidden="true"` sur les icônes décoratives, `aria-label` sur les boutons icônes
- Emojis conservés uniquement quand ils sont expressifs (ex : rangée d'humeur 😴😐🙂💪🔥)

## Layout
- Mobile-first : max-width 480px
- Padding de base : 16px
- Support safe-area : `env(safe-area-inset-*)`
- Barres flottantes glass au lieu d'une bottom-nav pleine largeur ; rayons fluides (`--radius-lg`/`--radius`/`--radius-sm`/`--radius-pill`)

## Classes
- Nommage kebab-case : `.exercise-card`, `.workout-page`
- Pas d'inline styles sauf gradients/couleurs dynamiques depuis les données (ex : `--muscle`)
- Animations : easings existants (`--ease-out`, `--ease-spring`)

## Responsive
- Tester sur viewport 375px (iPhone SE) et 428px (iPhone 14 Pro Max)
- Pas de media queries desktop — l'app est mobile-only
