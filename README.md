# SPORTLAB.

> Application mobile offline de suivi musculation — Programme Push / Pull / Legs

<!-- Ajoute tes screenshots ici (place les images dans le dossier docs/) -->
<p align="center">
  <img src="docs/screenshot-home.png" alt="Accueil" width="250" />
  <img src="docs/screenshot-session.png" alt="Séance" width="250" />
  <img src="docs/screenshot-workout.png" alt="Workout" width="250" />
</p>

---

## Fonctionnalités

- **Programme complet** — 4 séances (Push, Pull, Legs, Bonus) avec tous les exercices, séries, reps et temps de repos
- **Suivi des poids** — Saisis tes charges et reps, valide chaque série, tout est sauvegardé localement
- **Pré-remplissage intelligent** — Les poids de ta dernière séance sont automatiquement pré-remplis
- **Autosave** — Si tu fermes l'app par erreur, ta séance en cours est récupérée
- **Historique** — Consulte tes performances passées par exercice et par séance
- **Record personnel** — Ton max est affiché automatiquement sur chaque exercice
- **100% Offline** — Aucun serveur, aucun compte, tout tourne en local sur ton téléphone
- **Images d'exercices** — Emplacement prévu pour ajouter tes propres photos

---

## Installation sur ton téléphone (PWA)

### iPhone (Safari)

1. Ouvre l'app dans **Safari** (pas Chrome, pas Firefox — Safari uniquement)
2. Appuie sur le bouton **Partager** (icône carré avec flèche vers le haut)
3. Fais défiler et appuie sur **« Sur l'écran d'accueil »**
4. Confirme en appuyant sur **« Ajouter »**
5. L'app SportLab apparaît sur ton écran d'accueil comme une app native

### Android (Chrome)

1. Ouvre l'app dans **Chrome**
2. Appuie sur les **3 points** en haut à droite
3. Appuie sur **« Installer l'application »** ou **« Ajouter à l'écran d'accueil »**
4. Confirme l'installation
5. L'app SportLab apparaît dans ton tiroir d'applications

> Une fois installée, l'app fonctionne **sans connexion internet**.

---

## Lancer en local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

L'app est accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

Les fichiers sont générés dans le dossier `dist/`, prêts à être déployés sur Vercel, Netlify, GitHub Pages ou tout hébergement statique.

---

## Ajouter tes images d'exercices

Place tes images dans `public/images/exercises/` avec les noms suivants :

<details>
<summary>Liste des fichiers images attendus</summary>

| Séance | Fichier |
|--------|---------|
| Push | `developpe-couche.jpg` |
| Push | `developpe-incline.jpg` |
| Push | `ecarte-poulie.jpg` |
| Push | `developpe-militaire.jpg` |
| Push | `elevations-laterales.jpg` |
| Push | `oiseau.jpg` |
| Push | `dips.jpg` |
| Push | `extension-poulie.jpg` |
| Push | `crunch-machine.jpg` |
| Push | `releves-jambes.jpg` |
| Pull | `rowing-barre.jpg` |
| Pull | `rowing-haltere.jpg` |
| Pull | `tractions.jpg` |
| Pull | `tirage-vertical.jpg` |
| Pull | `shrugs.jpg` |
| Pull | `hyperextensions.jpg` |
| Pull | `curl-barre-ez.jpg` |
| Pull | `curl-incline.jpg` |
| Pull | `curl-marteau.jpg` |
| Pull | `gainage-planche.jpg` |
| Legs | `squat.jpg` |
| Legs | `presse-cuisses.jpg` |
| Legs | `leg-extension.jpg` |
| Legs | `souleve-terre-roumain.jpg` |
| Legs | `leg-curl.jpg` |
| Legs | `mollets-debout.jpg` |
| Legs | `mollets-assis.jpg` |
| Legs | `woodchop.jpg` |
| Bonus | `developpe-arnold.jpg` |
| Bonus | `elevations-poulie.jpg` |
| Bonus | `face-pull.jpg` |
| Bonus | `curl-pupitre.jpg` |
| Bonus | `curl-concentre.jpg` |

</details>

Les formats acceptés : `.jpg`, `.png`, `.webp`. Un placeholder s'affiche tant que l'image n'est pas ajoutée.

---

## Stack technique

- **React** + **Vite** — Build rapide, HMR
- **React Router** — Navigation SPA
- **localStorage** — Persistance des données offline
- **Service Worker** — Cache offline (PWA)
- **Montserrat** — Police Google Fonts
- **CSS custom** — Thème noir/orange, mobile-first

---

## Structure du projet

```
src/
├── data/
│   └── program.js          # Programme complet (4 séances, tous les exercices)
├── pages/
│   ├── Home.jsx             # Accueil avec planning semaine
│   ├── Session.jsx          # Détail d'une séance
│   ├── Workout.jsx          # Mode séance active (saisie poids/reps)
│   ├── History.jsx          # Historique par exercice
│   └── Logs.jsx             # Journal des séances passées
├── components/
│   ├── ExerciseCard.jsx     # Carte exercice réutilisable
│   └── Navigation.jsx       # Barre de navigation bottom
├── utils/
│   └── storage.js           # Lecture/écriture localStorage
├── index.css                # Styles globaux (thème noir/orange)
├── App.jsx                  # Routes
└── main.jsx                 # Point d'entrée + SW registration
```
