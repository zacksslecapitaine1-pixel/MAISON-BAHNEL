# Maison Bahnel — Spa · Beauté · Bien-être

Site web premium pour **Maison Bahnel**, sanctuaire de beauté à Lomé, Togo.

## Stack
- React 18 + Vite 5 + Three.js (particules dorées hero)
- CSS pur injecté — zéro dépendance UI
- WhatsApp API — réservation multi-étapes intégrée
- GitHub Actions — déploiement automatique sur GitHub Pages

## Build vérifié
Ce projet a été testé avec `npm install && npm run build` — compilation réussie, zéro erreur.

## Déploiement GitHub Pages

### Étape 1 — Activer GitHub Pages (Source = GitHub Actions)
Dans le repo GitHub : **Settings → Pages → Build and deployment → Source** → choisir **GitHub Actions** (PAS "Deploy from a branch"). Sauvegarder.

### Étape 2 — Remplacer le contenu du repo
```bash
git rm -rf . 
git clean -fxd
# Dézipper le nouveau projet ici, puis :
git add .
git commit -m "fix: build corrigé - site fonctionnel"
git push origin master
```

### Étape 3 — Vérifier
Aller dans l'onglet **Actions** du repo → le workflow "Deploy Maison Bahnel — GitHub Pages" doit passer au vert en 1-2 minutes. Le site sera visible sur :
`https://TON-USERNAME.github.io/NOM-DU-REPO/`

## Développement local
```bash
npm install
npm run dev
```

## Contact client
**WhatsApp :** +228 98 36 19 19 | **Localisation :** Lomé, Togo

---
*Développé par [Dev.zak](https://dev-zak.netlify.app)*
