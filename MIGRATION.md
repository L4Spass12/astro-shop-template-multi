# Migration WordPress → Astro

État de la migration du site buddypad.com (WordPress + WooCommerce)
vers la stack Astro + Atelier checkout.

## ✅ Fait

- **Routing Astro** : URLs identiques à WP pour préserver le SEO
  - `/<slug>/` = articles blog (racine, comme WP)
  - `/product/<slug>/` = produits
  - `/category/<slug>/` = catégories blog
  - `/product-category/<slug>/` = catégories produits
- **Contenu importé depuis l'API WP** :
  - 27 articles (HTML → Markdown, FAQ extraites)
  - 40 produits avec **142 variations** (prix/image/stock par combinaison)
  - 9 catégories produits
  - 3 catégories blog (Tapis de souris Gaming, Guide d'achat, Bureau & Setup)
  - 5 pages légales (contact, CGV, livraisons, confidentialité, mentions)
- **Images** : 184 téléchargées localement (44 Mo dans `public/images/`)
- **UI fiche produit** avec sélecteur de variantes en JS (update prix/image/bouton live)

## ⚠️ À traiter AVANT le go-live

### 1. Fulfillment DSers (🔴 critique)

Aujourd'hui, DSers synchronise WooCommerce → AliExpress. Quand tu vas
**déconnecter buddypad.com de WordPress**, DSers perdra son orchestration.

**Options** à évaluer :
- **A** — Webhook depuis Atelier vers Zapier/Make → création auto de commande DSers
- **B** — Garder WooCommerce en backend invisible (headless) avec l'Astro en front
- **C** — Traitement manuel des commandes (reçues par email Atelier → placement manuel DSers)
- **D** — Migration vers Shopify + DSers (intégration native, rupture plus importante)

👉 **Décision à prendre avant de bouger le DNS.**

### 2. Widget Atelier — variantes

Atelier n'accepte qu'un seul prix par produit pour l'instant. Sur les
fiches produit, on update le `data-item-id` et `data-item-price` en JS
à chaque clic sur une variante, mais il faut vérifier que ton widget :

- Lit les data-item-* **au moment du clic** (et pas au chargement de la page)
- Associe l'ID unique au bon produit dans ton backoffice

À tester sur une variation XXL avant go-live.

### 3. Domaine + DNS

- Le site preview tourne actuellement sur `buddypadpreview.hostingersite.com` (Hostinger FTP)
- **Pour go-live** : déconnecter le domaine `buddypad.com` de WordPress,
  le pointer sur l'IP Hostinger du site Astro
- Google ré-indexera en 24-72 h, les rankings sont préservés car les URLs matchent

### 4. Vérifications finales

- [ ] Tester une commande de bout en bout avec le widget Atelier
- [ ] Vérifier que toutes les variations d'un produit peuvent être ajoutées au panier
- [ ] Screenshot des 9 catégories produits pour vérifier leur design
- [ ] Valider le formulaire contact (actuellement il n'envoie rien, à connecter à Atelier ou un service type Formspree)
- [ ] Mettre à jour les liens externes dans les articles (ceux qui pointaient vers `buddypad.com/produit/` sont déjà remappés vers `/product/`)

## 🛠️ Scripts de migration

Les scripts dans `scripts/wp-*` sont gardés pour pouvoir re-sync si tu
ajoutes/modifies du contenu sur WordPress avant le switch final.

```bash
# Re-sync complet
node scripts/wp-scrape.mjs           # Posts, pages, categories
node scripts/wp-scrape-wc.mjs         # Produits (prix, images)
node scripts/wp-scrape-variations.mjs # Détail des variations
node scripts/download-images.mjs      # Images vers public/
node scripts/convert-posts.mjs        # Posts → Markdown
node scripts/convert-products.mjs     # Produits → Markdown
node scripts/convert-pages.mjs        # Pages légales → .astro
npm run build
```
