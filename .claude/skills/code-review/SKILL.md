---
name: code-review
description: >
  Review de code systématique pour SportLab. Utiliser quand l'utilisateur demande
  une review, un audit de qualité, "review ce code", "vérifie ce fichier",
  "est-ce que c'est bon ?", "check ce PR", ou mentionne qualité/review/audit.
allowed-tools: Read Grep Glob Bash
---

# Code Review — SportLab

## Checklist de review

### 1. Qualité React
- [ ] Pas de state inutile (dérivable d'un autre state)
- [ ] useCallback/useMemo utilisés quand nécessaire
- [ ] Pas de side effects dans le render
- [ ] Keys stables sur les listes (pas d'index si la liste change)
- [ ] Cleanup des useEffect (timers, listeners)

### 2. Storage & Data
- [ ] Mutations localStorage via `utils/storage.js` uniquement
- [ ] JSON.parse enveloppé dans try-catch
- [ ] Données validées avant écriture
- [ ] Pas de clés localStorage hardcodées en dehors de storage.js

### 3. CSS & UX
- [ ] CSS variables utilisées (pas de couleurs hardcodées)
- [ ] Rendu correct sur mobile (375px - 428px)
- [ ] Accessibilité : aria-labels sur boutons icônes
- [ ] Animations fluides (pas de jank)

### 4. Performance
- [ ] Pas de re-renders inutiles
- [ ] Images en lazy loading
- [ ] Pas d'appels synchrones bloquants dans les handlers

### 5. Sécurité
- [ ] Pas d'innerHTML ou dangerouslySetInnerHTML
- [ ] Données utilisateur sanitisées avant affichage
- [ ] Import/export de données validé

## Format de sortie
Produis un rapport structuré :
```
## Review — [fichier ou scope]

### Problèmes critiques
- ...

### Suggestions d'amélioration
- ...

### Points positifs
- ...
```
