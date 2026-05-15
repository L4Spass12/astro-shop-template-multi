# AGENTS.md — Template e-commerce Astro multi-locale

> **Pour les agents IA :** ce fichier est la *source de vérité* pour cloner ce
> template vers un nouveau site (autre niche, autre design). Suis ce checklist
> dans l'ordre — chaque étape est testée. Ne saute rien.

## Architecture en 30 secondes

- **Astro 4** statique multi-locale (FR par défaut, EN/DE optionnels via préfixe `/en/`, `/de/`).
- **Paiement** : widget Atelier (Cloudflare Worker `seamless-cart`) → Stripe. Le widget est injecté dans `BaseLayout.astro` via `data-shop-id`.
- **Contenu** : collections Astro dans `src/content/{blog,products,productCategories}/` (FR à la racine, `en/` et `de/` en sous-dossier).
- **i18n** : `src/lib/i18n.ts` (`t()`, `localePrefix()`, `parseEntrySlug()`).
- **Config centrale** : `site.config.mjs` — **TOUT** ce qui change d'un site à l'autre vit ici.
- **Déploiement** : GitHub Actions → FTP Hostinger.

## ⚡ Checklist de création d'un nouveau site

### 1. Cloner & repo

```bash
git clone https://github.com/L4Spass12/astro-shop-template-multi.git mon-nouveau-site
cd mon-nouveau-site
rm -rf .git && git init
# Créer le repo GitHub correspondant puis :
git remote add origin git@github.com:L4Spass12/mon-nouveau-site.git
npm install
```

### 2. Éditer `site.config.mjs` (⚠ section unique à toucher)

Tout est commenté. Les blocs marqués `⚠` sont **obligatoires** :

- `name`, `url`, `description` — identité du site
- `logoPrefix` / `logoSuffix` — split visuel du logo (ex: `Mon` + `Shop`)
- `shop.path` — slug de la boutique (ex: `boutique`, `produits`, `tapis-de-souris`)
- `shop.atelierShopId` — UUID du shop côté Atelier (créé via dashboard `seamless-cart`)
- `forms.web3formsKey` + `forms.subjectPrefix`
- `legal.editor.*` — éditeur (laisser EI Quentin Amat si même propriétaire)
- `categories` + `categorySlugs` — taxonomie produit
- `home.categoryRows` — sliders thématiques de la homepage (slug + labels par locale + glows)
- `home.testimonials.{fr,en,de}` — 4 avis client par locale
- `home.faqs.{fr,en,de}` — 5 Q/A par locale
- `home.heroImageAlt` — alt de l'image hero

### 3. Renommer le fichier de la boutique (le filename = URL en Astro)

Si tu changes `shop.path` (ex: `boutique` au lieu de `tapis-de-souris`) :

```bash
mv src/pages/tapis-de-souris.astro src/pages/<shop.path>.astro
mv "src/pages/[lang]/tapis-de-souris.astro" "src/pages/[lang]/<shop.path>.astro"
```

Le contenu de ces fichiers utilise déjà `siteConfig.shop.path` pour les liens
internes — pas besoin d'éditer le code, juste le nom de fichier.

### 4. Vider les collections de contenu et les ré-emplir

```bash
rm -rf src/content/blog/*.md src/content/blog/en/*.md src/content/blog/de/*.md
rm -rf src/content/products/*.md src/content/products/en/*.md src/content/products/de/*.md
rm -rf src/content/productCategories/*.md src/content/productCategories/en/*.md src/content/productCategories/de/*.md
```

Le schéma de chaque collection est dans `src/content/config.ts` — respecte-le.

Pattern de slug : `mon-produit.md` à la racine = locale FR. La version EN est `en/mon-produit.md` (**même slug**, c'est ce qui permet `parseEntrySlug` de relier les deux). Idem `de/`.

### 5. Vider `public/images/`

```bash
rm -rf public/images/blog/* public/images/products/* public/images/produits/* public/images/about/*
# Garde public/images/home/ (hero), public/images/inline/ (assets génériques)
# Remets tes propres images, mêmes noms si possible (sinon update les MD).
```

### 6. Traductions i18n

`src/i18n/{fr,en,de}.json` — vérifie chaque clé. Les chaînes qui mentionnent
le produit/secteur (ex: "mouse pad" → "baby blanket") sont à adapter.

### 7. Pages légales

Les 4 pages `mentions-legales`, `conditions-generales-de-vente-cgv`,
`politique-de-confidentialite`, `livraisons-et-retours` sont déjà
templatisées : elles lisent `siteConfig.legal.*`. Rien à toucher si l'éditeur
ne change pas.

### 8. Build + dry-run

```bash
npm run build  # doit passer sans erreur, ~285 pages générées
npm run preview  # vérif visuelle
```

### 9. Déploiement GitHub Actions

`.github/workflows/deploy.yml` push vers Hostinger via FTP. Configure les
**secrets repo** :
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR`

## 🚫 À ne JAMAIS toucher (ces fichiers sont génériques, validés)

- `src/lib/i18n.ts` — moteur i18n
- `src/lib/inline-md.ts`, `src/lib/image.ts`
- `src/layouts/BaseLayout.astro` (sauf si on ajoute Analytics)
- `src/components/CookieBanner.astro`
- `src/components/Header.astro`, `Footer.astro` (lisent déjà config)
- `astro.config.mjs`
- `.github/workflows/`

## 🔍 Comment vérifier qu'il ne reste plus de hardcode "buddypad"

```bash
grep -rn -iE "buddypad|tapis.de.souris" src/ --include="*.astro" \
  | grep -v "siteConfig" \
  | grep -v "// "
```

Tout résultat = à corriger (sauf les commentaires explicatifs).

## ⚠ Paiement Stripe — règles d'or

Le widget Atelier est injecté **une seule fois** dans `BaseLayout.astro`. Il
lit `data-shop-id`, `data-locale`, `data-currency`. Si tu touches à ce
script, teste un paiement end-to-end avant de pusher. Le `shop-id` doit
matcher un shop existant côté Cloudflare Worker `seamless-cart`.

## Structure des données

```
site.config.mjs              → 1 fichier, tout le site-specific
src/i18n/{fr,en,de}.json     → strings UI
src/content/blog/            → articles FR à la racine, en/* et de/* en sous-dossier
src/content/products/        → idem
src/content/productCategories/ → idem
src/pages/                   → routes (le nom de fichier = URL)
src/pages/[lang]/            → miroirs EN/DE des routes FR
```

## Anti-pattern fréquent

❌ **Ne** copie **pas** une valeur de `site.config.mjs` dans un composant :
réimporte le config (`import siteConfig from '../../site.config.mjs'`) et
lis dynamiquement. C'est ce qui garantit qu'éditer un seul fichier suffit.
