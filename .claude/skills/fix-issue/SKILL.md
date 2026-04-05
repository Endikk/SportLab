---
name: fix-issue
description: >
  Résolution structurée de bugs pour SportLab. Utiliser quand l'utilisateur
  signale un bug, un problème, une erreur, un crash, "ça marche pas",
  "j'ai un souci", "ça plante", "erreur", ou demande un fix/correction.
allowed-tools: Read Grep Glob Bash Edit Write
---

# Fix Issue — SportLab

## Workflow de résolution

### 1. Comprendre le problème
- Quel est le comportement attendu vs observé ?
- Sur quel appareil / navigateur ?
- Reproductible ? Étapes pour reproduire ?

### 2. Investiguer
```bash
# Chercher dans les logs / erreurs
npm run lint

# Chercher le code concerné
# Utiliser Grep pour localiser les fichiers pertinents
```

**Zones à vérifier en priorité :**
- `utils/storage.js` — corruption localStorage, JSON invalide
- `pages/Workout.jsx` — autosave, navigation entre exercices, swipe
- `data/program.js` — IDs manquants ou dupliqués
- `public/sw.js` — cache obsolète (incrémenter CACHE_NAME)
- `index.css` — overflow, z-index, safe-area

### 3. Corriger
- Fix minimal et ciblé — ne pas refactorer autour du bug
- Tester le fix avec `npm run lint`
- Vérifier les effets de bord sur les composants qui utilisent le même code

### 4. Vérifier
- Le bug original est résolu
- Aucune régression introduite
- ESLint passe sans erreur

## Bugs fréquents SportLab
| Symptôme | Cause probable | Solution |
|----------|---------------|----------|
| Données perdues | localStorage full ou corrompu | Vérifier quota, valider JSON |
| Séance pas restaurée | Autosave key incorrecte | Vérifier `sportlab_workout_progress` |
| Swipe ne marche pas | Touch events conflictuels | Vérifier refs et seuils (80px) |
| Cache périmé (PWA) | SW cache pas invalidé | Incrémenter `CACHE_NAME` dans sw.js |
| Image pas affichée | Mauvais chemin/extension | Vérifier `public/images/exercises/` |
