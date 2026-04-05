---
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/App.jsx"
---

# Règles React — SportLab

## Composants
- `export default function NomComposant()` — pas de arrow functions pour les composants
- Utiliser `useCallback` pour les handlers passés en props
- Utiliser `useRef` pour le state qui ne déclenche pas de re-render (touch tracking, timers)
- Destructurer les props dans les paramètres de la fonction

## JSX
- Ajouter `aria-label` sur tous les boutons icônes
- `aria-hidden="true"` sur les SVG décoratifs
- Images : toujours `loading="lazy"` et `alt` descriptif

## État
- State éphémère (UI) → `useState`
- Données persistantes → `utils/storage.js` (jamais `localStorage` directement)
- Pas de Context API sauf si nécessaire pour éviter du prop drilling excessif

## Navigation
- HashRouter — ne pas changer en BrowserRouter (compatibilité hébergement statique)
- Utiliser `useNavigate()` pour la navigation programmatique
- Utiliser `useParams()` pour récupérer les IDs de route
