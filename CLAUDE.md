# SportLab — Context

## What
PWA offline de suivi musculation (Push/Pull/Legs).
React 19 + Vite 8 + React Router 7 (HashRouter) + localStorage.
Pas de backend, pas de state library, 100% client-side.

## Stack & Commands
```bash
npm run dev      # Dev server → localhost:5173
npm run build    # Production → dist/
npm run lint     # ESLint (React hooks + refresh)
npm run preview  # Preview du build
```

## Architecture
```
src/
├── data/program.js          # Source unique du programme (4 séances, 50+ exercices)
├── pages/                   # Pages = routes (Home, Session, Workout, History, Logs)
├── components/              # Composants réutilisables (Navigation, ExerciseCard, BarChart, ExerciseImage)
├── utils/storage.js         # API localStorage (logs, autosave, export/import)
├── utils/exerciseVisuals.js # Gradients, emojis, couleurs par section/séance
├── index.css                # Styles globaux — thème noir/orange via CSS variables
├── App.jsx                  # Définition des routes
└── main.jsx                 # Entry point + enregistrement Service Worker
```

## Conventions
- Composants : PascalCase, `export default function`
- Utilitaires : camelCase, named exports
- CSS : variables globales dans `:root`, classes en kebab-case
- Données : toute mutation localStorage passe par `utils/storage.js`
- Langue : UI en français, code et commentaires en français acceptés
- PWA : Service Worker dans `public/sw.js`, manifest dans `public/manifest.json`

## Règles critiques
- Ne JAMAIS modifier `data/program.js` sans confirmer — c'est la source unique du programme
- Toujours envelopper `JSON.parse()` dans un try-catch
- Utiliser les CSS variables existantes (`--accent`, `--bg-card`, `--text-1`, etc.)
- Mobile-first : max-width 480px, tester le rendu mobile
- Pas de dépendances externes inutiles — l'app doit rester légère et offline

## Vérification
Après toute modification : `npm run lint` puis vérifier visuellement sur mobile.
