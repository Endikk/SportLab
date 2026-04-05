---
name: deploy
description: >
  Workflow de déploiement et build pour SportLab. Utiliser quand l'utilisateur
  mentionne deploy, déployer, build production, mise en ligne, Vercel, Netlify,
  GitHub Pages, "mettre en prod", "préparer le build", ou ship.
allowed-tools: Read Grep Glob Bash
---

# Deploy — SportLab

## Pre-deploy checklist

### 1. Vérifications
```bash
npm run lint          # Zéro erreur ESLint
npm run build         # Build sans erreur
npm run preview       # Vérification visuelle du build
```

### 2. PWA
- [ ] `public/manifest.json` à jour (name, icons, start_url)
- [ ] `public/sw.js` — CACHE_NAME incrémenté si changements de structure
- [ ] Service Worker fonctionne (test en mode incognito)

### 3. Assets
- [ ] Images d'exercices dans `public/images/exercises/`
- [ ] Favicon présent
- [ ] Fonts chargées correctement offline

### 4. Build de production
```bash
npm run build
```
Le dossier `dist/` contient les fichiers déployables.

## Plateformes supportées

### Vercel
```bash
# Déploiement automatique depuis git, ou :
npx vercel --prod
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### GitHub Pages
- Build avec base configurée dans `vite.config.js`
- Ajouter `base: '/nom-du-repo/'` si nécessaire

## Post-deploy
- Vérifier le chargement sur mobile (Safari iOS + Chrome Android)
- Tester l'installation PWA
- Vérifier le fonctionnement offline
