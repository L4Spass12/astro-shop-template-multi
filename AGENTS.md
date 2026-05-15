# AGENTS.md — Template e-commerce Astro multi-locale

> **Pour les agents IA :** ce fichier est la **seule** source de vérité pour
> cloner ce template vers un nouveau site (autre niche, autre marque). Suis
> le checklist dans l'ordre. À la fin, `node scripts/init.mjs` doit afficher
> "✅ Init terminé sans bloquant" — **c'est le seul critère "site prêt"**.

---

## 🎯 Architecture en 60 secondes

- **Astro 4** statique multi-locale (FR par défaut, EN/DE optionnels via `/en/`, `/de/`).
- **Paiement** : widget Atelier (Cloudflare Worker `seamless-cart`) → Stripe. Injecté dans `BaseLayout.astro` via `data-shop-id`.
- **Contenu** : collections Astro dans `src/content/{blog,products,productCategories}/` (FR à la racine, `en/` et `de/` en sous-dossier).
- **i18n UI** : `src/i18n/{fr,en,de}.json` lu via `t()` dans `src/lib/i18n.ts`.
- **Config centrale** : `site.config.mjs` — **TOUT** ce qui change d'un site à l'autre vit ici.
- **Déploiement** : GitHub Actions → FTP Hostinger.
- **Articles auto** : cron Lun/Mer/Ven via Claude API + Unsplash.

---

## ⚡ Checklist de création (ordre strict)

### 1. Cloner & repo

```bash
git clone https://github.com/L4Spass12/astro-shop-template-multi.git mon-nouveau-site
cd mon-nouveau-site
rm -rf .git && git init
git remote add origin git@github.com:L4Spass12/mon-nouveau-site.git
npm install
```

### 2. Éditer `site.config.mjs` — ⚠ source de vérité

Édite **toutes** les valeurs marquées `⚠`. Voici la liste exhaustive :

**Identité :**
- `name` — nom du site (ex. `'BébéNest'`)
- `url` — URL prod sans slash final (ex. `'https://bebenest.com'`)
- `description` — meta description (1-2 phrases)
- `logoPrefix` / `logoSuffix` — split visuel du logo header

**Shop :**
- `shop.path` — slug URL de la boutique (ex. `'boutique'`, `'produits-bebe'`)
- `shop.currency` — code ISO (`'EUR'`, `'USD'`, `'GBP'`)
- `shop.atelierShopId` — **OBLIGATOIRE** : créer un nouveau shop sur le dashboard `seamless-cart` Cloudflare Worker, copier l'UUID. **NE PAS LAISSER celui de BuddyPad** sinon les paiements partent ailleurs.
- `shop.customProductSlug` — slug du produit personnalisable (CTA "Personnaliser"). `null` si pas de personnalisation.
- `shop.categoryLabelPrefix` — préfixe stripé des labels catégorie (`''` pour désactiver).
- `shop.sizeCategorySlugs` / `featureCategorySlugs` — slugs de catégories transversales (tailles, options) à dépriorityser dans "Vous aimerez aussi".

**Forms & contact :**
- `forms.web3formsKey` — **OBLIGATOIRE** : créer un compte sur https://web3forms.com, copier la clé (sinon les leads partent chez BuddyPad).
- `forms.contactEmail` — email recevant les formulaires.
- `forms.subjectPrefix` — préfixe des sujets emails.

**Legal (peut rester EI Quentin Amat si même propriétaire) :**
- `legal.editor.*` — nom, statut, adresse, téléphone, email, statut TVA
- `legal.hosting.*` — hébergeur (Hostinger par défaut)
- `legal.domain` — auto-dérivé de `url` (laisser `''`)

**Categories blog (3 max) :**
- `categories` — array de strings — **DOIT matcher** les `category:` dans les frontmatter des `.md` de `src/content/blog/`, sinon build crash sur `z.enum`.

**Home content (par locale) :**
- `home.heroImageAlt`
- `home.guideLinks.{gaming,xxl}` — slugs catégories pour les liens internes des guides (placeholders `LINK_GAMING`/`LINK_XXL` dans i18n)
- `home.categoryRows[]` — sliders thématiques. **Schéma exact :**
  ```js
  {
    slug: 'ma-categorie',        // doit exister dans productCategories
    labels: { fr: '...', en: '...', de: '...' },  // recommandé
    // OU : label: '...' (legacy, FR seulement)
    glow1: 'rgba(R, G, B, A)',  // couleur de glow décoratif 1
    glow2: 'rgba(R, G, B, A)',  // couleur de glow décoratif 2
  }
  ```
- `home.testimonials.{fr,en,de}` — array de `{ name, text }` (4 entrées par locale recommandé)
- `home.faqs.{fr,en,de}` — array de `{ q, a }` (5 par locale recommandé, génère un FAQPage schema.org)

**Article auto-generation :**
- `article.context`, `theme`, `cta`, `author`, `unsplashContext`, `coverFallbackKeyword` — voir section "Articles auto" plus bas

### 3. Éditer `src/i18n/{fr,en,de}.json` — chaînes UI

**OBLIGATOIRE pour changer de niche.** Toutes les chaînes visibles dans le site sont là. Édite **chaque clé** mentionnant le produit/secteur :
- `home.heroTag`, `heroTitle`, `heroSubtitle`, `ctaDiscover`, `ctaCustomize`
- `home.guide1Title` à `guide3P2` (les paragraphes contiennent `LINK_GAMING`/`LINK_XXL`)
- `home.perfTitle`, `perfText`
- `home.customTitle`, `customSubtitle`, `customCta`
- `home.ctaTitle`, `ctaSubtitle`, `ctaShop`, `ctaBlog`
- `blog.title` (avec placeholder `{site}`), `blog.subtitle`, `blog.intro`, `blog.ctaTitle`, `blog.ctaSubtitle`
- `shop.breadcrumbShop` — label boutique dans les fils d'Ariane
- `fabrication.*` — section "Fabrication haute précision"
- `nav.*` — items du menu

**Test** : `grep -rn -iE "mouse|tapis|pad|baby|<ton ancienne niche>" src/i18n/*.json` doit ne rien retourner.

### 4. Remplacer les images dans `public/`

**OBLIGATOIRE** — sinon le hero et l'OG affichent BuddyPad. Garde **exactement** les mêmes noms de fichiers :

```
public/og-image.jpg                          # 1200×630, partage social
public/favicon.svg                            # logo carré simple
public/images/home/hero-desktop.webp         # 2560×1086, hero desktop
public/images/home/hero-desktop-800w.webp    # variant 800w
public/images/home/hero-mobile.webp          # 1080×~ portrait, mobile
public/images/about/fabrication.webp         # section fabrication
public/images/about/fabrication-400w.webp    # variant
public/images/about/fabrication-800w.webp    # variant
```

Les images produits/catégories/blog vivent dans `public/images/products/`, `public/images/blog/` — référencées par les `.md`.

### 5. Synchroniser les content collections

**Stratégie : garde 1 sample par collection** comme modèle, vide le reste. Tu ré-écris à partir du sample :

```bash
# Blog : garde l'article le + récent comme modèle, supprime les autres
ls src/content/blog/*.md | tail -n +2 | xargs rm -f
ls src/content/blog/en/*.md 2>/dev/null | tail -n +2 | xargs rm -f
ls src/content/blog/de/*.md 2>/dev/null | tail -n +2 | xargs rm -f

# Idem pour products et productCategories
ls src/content/products/*.md | tail -n +2 | xargs rm -f
ls src/content/productCategories/*.md | tail -n +2 | xargs rm -f
```

Le **schéma** de chaque collection est dans `src/content/config.ts` — respecte-le strictement. Pour un nouveau `.md`, copie le sample restant et adapte. Conventions slugs :
- `produit.md` à la racine = locale FR
- `en/produit.md` = traduction EN (**même slug** que la version FR — c'est ce qui les relie)
- `de/produit.md` = idem

⚠ **`category:` du frontmatter blog DOIT exister dans `siteConfig.categories`** (attention aux apostrophes typographiques `’` vs `'`).

### 6. Purger `scripts/topics.json`

```bash
echo '[]' > scripts/topics.json
```

Puis remplis avec 30-50 sujets de ta niche au format `[{"title": "..."}]`. Le CRON consomme le 1er sujet sans `publishedAt` à chaque run.

### 7. Lancer le script d'init automatique

```bash
node scripts/init.mjs
```

Il :
- met à jour `package.json` name depuis `siteConfig.name`
- renomme `src/pages/tapis-de-souris.astro` → `<shop.path>.astro` (et la version `[lang]/`)
- audit les hardcodes BuddyPad résiduels
- audit les clés (web3forms, atelierShopId, emails) encore au template
- audit le sync `categories` ↔ `blog.category` (évite le crash z.enum)
- audit les images requises
- audit `topics.json`

**Le seul critère "prêt"** : ce script affiche `✅ Init terminé sans bloquant`. Sinon il liste exactement ce qui manque, tu corriges, tu relances.

### 8. Build + test local

```bash
npm run build      # doit passer sans erreur
npm run preview    # vérif visuelle sur http://localhost:4321
```

### 9. Secrets GitHub + premier déploiement

Onglet `Settings → Secrets and variables → Actions` du repo, ajoute :
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` — Hostinger FTP
- `ANTHROPIC_API_KEY` — pour les articles auto (Console Anthropic)
- `UNSPLASH_ACCESS_KEY` — pour les images d'article (Unsplash Developer)

```bash
git add -A
git commit -m "feat: initial setup <site>"
git push -u origin main
```

Le workflow `deploy.yml` se déclenche automatiquement et pousse vers Hostinger.

---

## 🤖 Articles auto-générés (CRON 3×/semaine)

**Pipeline** (`.github/workflows/generate-article.yml`, cron `0 8 * * 1,3,5`) :
1. `scripts/generate-article.mjs` — pioche un sujet dans `scripts/topics.json`, génère via Claude API + télécharge images Unsplash
2. `scripts/translate-content.mjs --lang en/de --collection blog` — traduit auto EN+DE (idempotent)
3. `scripts/generate-responsive.mjs` — variants `-400w`/`-800w`
4. Auto-commit + auto-deploy FTP

**Pour activer :** secrets `ANTHROPIC_API_KEY` + `UNSPLASH_ACCESS_KEY` + FTP (étape 9). Sans ces secrets, le workflow skip proprement (guard intégré).

**Pour désactiver le cron** (génération manuelle uniquement) : commente la ligne `schedule:` dans `.github/workflows/generate-article.yml`.

---

## 🚫 À ne JAMAIS toucher (génériques, validés)

- `src/lib/i18n.ts`, `src/lib/inline-md.ts`, `src/lib/image.ts`
- `src/layouts/BaseLayout.astro`
- `src/components/CookieBanner.astro`, `Header.astro`, `Footer.astro`
- `src/content/config.ts` (modifier seulement pour ajouter des champs, pas pour changer la structure)
- `astro.config.mjs`
- `.github/workflows/deploy.yml`, `generate-article.yml` (guards intégrés)
- `scripts/generate-article.mjs`, `translate-content.mjs`, `generate-responsive.mjs`, `init.mjs`

## 🗑 Scripts legacy (peuvent être supprimés)

Ces scripts ont servi à migrer depuis WordPress vers Astro pour BuddyPad. Pour un nouveau site, supprime-les :
```bash
rm scripts/wp-scrape*.mjs scripts/convert-*.mjs scripts/download-images.mjs scripts/fill-category-content.mjs scripts/i18n-translate-products-bodies.mjs scripts/i18n-update-prices.mjs
```

## ⚠ Paiement Stripe — règles d'or

Le widget Atelier est injecté **une seule fois** dans `BaseLayout.astro`. Il lit `data-shop-id`, `data-locale`, `data-currency`. Si tu touches à ce script, teste un paiement end-to-end avant de pusher. Le `shop-id` DOIT pointer vers un shop **propre à ce site** côté Cloudflare Worker `seamless-cart`.

## 🔍 Commande de vérification finale

```bash
grep -rn -iE "buddypad|tapis.de.souris|Quentin|Roubaix" src/ --include="*.astro" --include="*.ts" \
  | grep -v "siteConfig" | grep -v "^[^:]*:[0-9]*: *//"
```

Tout résultat = à corriger (les `siteConfig.*` sont OK, les commentaires aussi).
