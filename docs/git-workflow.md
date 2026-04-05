# Git Workflow — SportLab

## Branches

| Branche | Usage |
|---------|-------|
| `main` | Production — toujours déployable |
| `feature/*` | Nouvelles fonctionnalités |
| `fix/*` | Corrections de bugs |
| `claude/*` | Branches créées par Claude Code |

## Commits

### Format
```
type : description courte

[corps optionnel — contexte, motivation]
```

### Types
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `add` : ajout de fichier/ressource
- `refactor` : restructuration sans changement fonctionnel
- `style` : changements CSS / visuels
- `docs` : documentation
- `chore` : maintenance, config, dépendances

### Exemples
```
feat : ajout historique par exercice
fix : correction autosave séance en cours
add : images exercices Push
style : amélioration responsive workout cards
chore : mise à jour Vite 8
```

## Workflow quotidien

```bash
# 1. Créer une branche
git checkout -b feature/nom-feature

# 2. Développer + commiter
git add src/pages/NewPage.jsx
git commit -m "feat : ajout page NewPage"

# 3. Vérifier
npm run lint
npm run build

# 4. Merger dans main
git checkout main
git merge feature/nom-feature

# 5. Nettoyer
git branch -d feature/nom-feature
```

## Règles
- Ne jamais push --force sur `main`
- Toujours lint avant de commiter
- Un commit = un changement logique
- Messages en français, types en anglais
