# Architecture — SportLab

## Vue d'ensemble

SportLab est une PWA offline-first de suivi musculation.
Pas de backend, pas de base de données — tout tourne en localStorage côté client.

```
┌──────────────────────────────────────────────────┐
│                   Browser (PWA)                   │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Pages   │→ │Components│→ │   index.css       │ │
│  │ (Routes) │  │(Réusable)│  │ (Thème global)    │ │
│  └────┬─────┘  └──────────┘  └──────────────────┘ │
│       │                                            │
│  ┌────▼─────────────────────────────────────────┐  │
│  │          utils/storage.js                     │  │
│  │    (API unique vers localStorage)             │  │
│  └────┬─────────────────────────────────────────┘  │
│       │                                            │
│  ┌────▼─────┐  ┌──────────────┐                    │
│  │localStorage│ │data/program.js│                   │
│  │(Données)  │ │(Programme)    │                   │
│  └──────────┘  └──────────────┘                    │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │        Service Worker (public/sw.js)          │  │
│  │   Cache-first assets / Network-first pages    │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## Flux de données

### Séance active (Workout)
```
program.js → Workout.jsx → useState (exerciseLogs)
                  │
                  ├→ Autosave (useEffect → localStorage)
                  ├→ Affichage (ExerciseCard rendus dynamiquement)
                  └→ Complétion → saveSessionLog() → sportlab_logs
```

### Pré-remplissage des poids
```
Workout mount → getLastLogForExercise(id) → poids de la dernière séance
                                           → pré-rempli dans les inputs
```

### Historique
```
sportlab_logs → getExerciseHistory(id) → History.jsx (graphiques)
             → getRecentSessions()    → Logs.jsx (liste des séances)
```

## Clés localStorage

| Clé | Contenu | Format |
|-----|---------|--------|
| `sportlab_logs` | Toutes les séances complétées | `{ "date_sessionId": { date, sessionId, timestamp, exercises } }` |
| `sportlab_workout_progress` | Séance en cours (autosave) | `{ sessionId, exerciseIdx, exerciseLogs }` |

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Planning semaine, accès rapide, reprise séance |
| `/session/:sessionId` | Session | Liste des exercices d'une séance |
| `/workout/:sessionId` | Workout | Mode saisie active (swipe entre exercices) |
| `/history/:exerciseId` | History | Historique d'un exercice (graphique + détails) |
| `/logs` | Logs | Journal de toutes les séances passées |

## PWA & Offline

- **Service Worker** : `public/sw.js` avec cache versionné (`sportlab-v2`)
- **Stratégie** : Cache-first pour `/assets/*`, Network-first pour le reste
- **Manifest** : `public/manifest.json` — standalone, portrait, thème orange
- **Installation** : Safari (iOS) via "Sur l'écran d'accueil", Chrome (Android) via "Installer"
