---
paths:
  - "src/data/**"
  - "src/utils/**"
---

# Règles Data & Storage — SportLab

## Programme (data/program.js)
- Source UNIQUE de vérité pour les exercices, séries, reps, repos
- Ne JAMAIS modifier sans confirmation explicite de l'utilisateur
- Structure : tableau de sessions, chaque session contient un tableau d'exercices
- Chaque exercice a : id, name, sets, reps, rest, (optionnel: image, notes)

## Storage (utils/storage.js)
- TOUTE interaction avec localStorage passe par ce fichier
- Clés : `sportlab_logs` (sessions complétées), `sportlab_workout_progress` (autosave)
- Toujours try-catch autour de `JSON.parse()`
- Valider les données importées avant de les stocker
- Fonctions existantes : getAllLogs, saveSessionLog, getLastLogForExercise, getExerciseHistory, getRecentSessions, exportData, importData

## Ajout de fonctions storage
- Suivre le pattern existant : fonction nommée, export nommé
- Documenter le format des données retournées
- Gérer le cas où localStorage est vide (retourner {} ou [])
