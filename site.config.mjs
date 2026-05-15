/**
 * ════════════════════════════════════════════════════════════════════
 *  SITE CONFIG — Source de vérité pour chaque site dérivé du template
 * ════════════════════════════════════════════════════════════════════
 *
 *  CE FICHIER EST LE SEUL POINT D'ENTRÉE pour configurer un nouveau site.
 *  Si tu changes ces valeurs, le site entier reflète les changements
 *  (titre, SEO, légal, branding, contenu d'accueil, etc.).
 *
 *  Pour créer un nouveau site, suis la checklist AGENTS.md à la racine.
 *
 *  CONVENTION : tout ce qui est entre ⚠ et ⚠ est SITE-SPÉCIFIQUE.
 *  Le reste (logique i18n, structure i18n.locale, etc.) est générique.
 */
const config = {
  // ⚠ ─── Identité ──────────────────────────────────────────────────── ⚠
  name: 'BuddyPad',
  url: 'https://buddypad.com',
  description: "BuddyPad – Tapis de souris gaming et bureautique : guides, tests et équipement pour optimiser votre setup.",
  // Logo affiché dans le Header : <logoPrefix><logoSuffix in accent color>
  logoPrefix: 'Buddy',
  logoSuffix: 'Pad',

  // ⚠ ─── Réseaux sociaux (laisser vide '' si pas de compte) ─────────── ⚠
  socials: {
    instagram: '',
    tiktok: '',
    youtube: '',
  },

  // ─── Internationalisation (logique générique, à ne pas modifier sauf pour
  //     activer/désactiver une locale ou changer les devises par marché) ────
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'de'],
    plannedLocales: [],
    locale: {
      fr: { label: 'Français', short: 'FR', htmlLang: 'fr-FR', ogLocale: 'fr_FR', currency: 'EUR' },
      en: { label: 'English',  short: 'EN', htmlLang: 'en',    ogLocale: 'en_US', currency: 'USD' },
      de: { label: 'Deutsch',  short: 'DE', htmlLang: 'de-DE', ogLocale: 'de_DE', currency: 'EUR' },
    },
    fxRates: { EUR: 1, USD: 1.1765 },
    fxUpdatedAt: '2026-05-12T13:04:59.002Z',
  },

  // ⚠ ─── Boutique (Atelier via Cloudflare Worker + Stripe) ─────────── ⚠
  shop: {
    enabled: true,
    provider: 'atelier',
    currency: 'EUR',
    // Slug URL de la page boutique : /<path>/ et /<lang>/<path>/.
    // Adapte selon ton site (ex: 'shop', 'produits-bebe', 'tapis-de-souris',
    // 'kitchen', etc.). Affecte automatiquement tous les liens internes.
    path: 'tapis-de-souris',
    // ID unique du shop dans Supabase seamless-cart. Le worker l'utilise
    // pour récupérer ta clé Stripe, ton mode test/live, ta TVA, etc.
    // Crée le shop via l'admin du worker AVANT de déployer le site.
    atelierShopId: '50e9f184-21e0-43bc-940e-52768855c84f',
    // Slug du produit "personnalisable" (CTA "Personnaliser mon X") — laisse
    // null si pas de produit personnalisé sur ce site.
    customProductSlug: 'tapis-de-souris-personnalise',
    // Préfixe stripé des labels de catégorie dans Header/breadcrumbs.
    // Ex: catégorie "Tapis de souris Gaming" → affichée "Gaming".
    // Laisse '' (chaîne vide) pour désactiver le stripping.
    categoryLabelPrefix: 'Tapis de souris',
    // Slugs de catégories utilisés comme "tailles" sur la fiche produit
    // (le 1er match dans products.categories définit la taille affichée).
    sizeCategorySlugs: ['tapis-de-souris-xxl', 'tapis-de-souris-large', 'tapis-de-souris-standard'],
    // Catégories "features" transversales (RGB, sans-fil, etc.) — utilisées
    // pour dépriorityser le slider "Vous aimerez aussi" (préférer thématique).
    featureCategorySlugs: ['tapis-souris-led-rgb', 'tapis-souris-led-rgb-charge-sans-fil'],
  },

  // ⚠ ─── Formulaires (Web3Forms — gratuit, illimité) ─────────────────── ⚠
  // 1. Crée un compte sur https://web3forms.com avec ton email
  // 2. Colle ton "Access Key" dans web3formsKey
  // 3. Les soumissions contact + newsletter arrivent par email
  forms: {
    web3formsKey: 'cb2f0db3-85e5-4006-b2d9-bdeacf271b9f',
    contactEmail: 'contact@buddypad.com',
    // Préfixe des sujets envoyés à Web3Forms (= nom du site dans les emails).
    subjectPrefix: 'BuddyPad',
  },

  // ⚠ ─── Catégories du BLOG (3 entrées max, conserver les keys utilisées
  //       par tes content/blog/*.md frontmatter `category`) ─────────────── ⚠
  categories: ['Tapis de souris Gaming', "Guide d’achat & conseils", 'Bureau & Setup'],
  // Mapping explicite name → slug URL (utilisé pour /category/<slug>/).
  // Les keys ici DOIVENT correspondre exactement à `categories` ci-dessus.
  categorySlugs: {
    'Tapis de souris Gaming': 'tapis-de-souris-gaming',
    "Guide d’achat & conseils": 'guide-achat-conseils',
    'Bureau & Setup': 'bureau-setup',
  },

  // ⚠ ─── Catégories PRODUITS WooCommerce (URLs /product-category/<slug>/) ⚠
  productCategories: [
    { slug: 'tapis-de-souris-buddypad-adventure', label: 'Tapis de souris Buddypad Adventure' },
    { slug: 'tapis-de-souris-fantasy',            label: 'Tapis de souris Fantasy' },
    { slug: 'tapis-de-souris-gaming',             label: 'Tapis de souris Gamer' },
    { slug: 'girl-boss',                          label: 'Tapis de souris Girl Boss' },
    { slug: 'tapis-de-souris-girly',              label: 'Tapis de souris Girly rose' },
    { slug: 'tapis-de-souris-kawaii',             label: 'Tapis de souris kawaii' },
    { slug: 'tapis-souris-led-rgb',               label: 'Tapis de souris LED / RGB' },
    { slug: 'tapis-souris-led-rgb-charge-sans-fil', label: 'Tapis de souris LED / RGB & Charge sans fil' },
    { slug: 'tapis-de-souris-manga-anime',        label: 'Tapis de souris Manga / Anime' },
    { slug: 'tapis-de-souris-minimaliste',        label: 'Tapis de souris Minimaliste' },
    { slug: 'tapis-de-souris-xxl',                label: 'Tapis de souris XXL' },
  ],

  // ⚠ ─── Génération d'articles IA (workflow Mon/Wed/Fri 8h UTC) ─────── ⚠
  article: {
    // Contexte court du site, injecté dans le prompt Claude
    context: "un site français spécialisé dans les tapis de souris gaming et bureautique, l'équipement de bureau et l'optimisation du setup PC",
    // Thématique principale (sert à proposer de nouveaux sujets)
    theme: "les tapis de souris (gaming, bureautique, XXL, RGB), l'ergonomie du poste de travail, les setups PC, les périphériques gaming et les conseils pour optimiser son bureau",
    // CTA de fin d'article
    cta: "Découvrir la sélection BuddyPad et trouver le tapis idéal pour votre setup",
    // Auteur affiché dans le frontmatter
    author: "Équipe BuddyPad",
    // Mot-clé Unsplash ajouté à chaque recherche image (cadrage visuel)
    unsplashContext: "gaming setup desk mousepad",
    // Mot-clé générique de repli si la recherche cover renvoie rien
    coverFallbackKeyword: "tapis de souris",
  },

  // ⚠ ─── Mentions légales (coordonnées de l'éditeur du site) ─────────── ⚠
  // Pour BuddyPad et tous les futurs sites de Quentin Amat (EI), ces
  // données restent identiques. Si un nouveau site est édité par une
  // autre entité (SAS, SARL, etc.), c'est ici qu'il faut adapter.
  legal: {
    // Format affiché dans les CGV / mentions / politique de confidentialité
    editor: {
      name: 'Quentin Amat',
      status: 'entrepreneur individuel',
      address: '123 rue d’Isly, 59100 Roubaix',
      phone: '06 27 29 34 43',
      email: 'contact@buddypad.com',
      vatStatus: 'Franchise en base de TVA - TVA non applicable, art. 293 B du CGI',
    },
    hosting: {
      name: 'Hostinger International Ltd',
      address: '61 Lordou Vironos Street, 6023 Larnaca, Chypre',
      contactUrl: 'https://www.hostinger.fr/contact',
    },
    // Domaine affiché dans les pages légales (sans http://). Auto-dérivé de
    // `url` ci-dessus si laissé vide.
    domain: '',
  },

  // ⚠ ─── Contenu de la HOMEPAGE (testimonials + FAQs + sections) ─────── ⚠
  // Pour chaque nouveau site, regénérer ces 3 blocs (4 témoignages, 5
  // questions FAQ, 5 sliders de catégories produits).
  home: {
    // Alt text de l'image hero (visible aux lecteurs d'écran + Google Images)
    heroImageAlt: 'Tapis de souris BuddyPad dans un setup gaming élégant',

    // Liens internes injectés dans les paragraphes guides via placeholders
    // LINK_GAMING / LINK_XXL des i18n strings home.guide1P1 / guide2P1.
    // Mets le slug de la catégorie cible (sans /product-category/). Null
    // pour désactiver (fallback /blog).
    guideLinks: {
      gaming: 'tapis-de-souris-gaming',
      xxl: 'tapis-de-souris-xxl',
    },


    // 5 sliders catégories sur la home (max). Chaque entrée pointe sur une
    // productCategory.slug existante. Glow couleurs adaptables à la palette.
    categoryRows: [
      {
        slug: 'tapis-de-souris-manga-anime', label: 'Manga / Anime',
        glow1: 'rgba(255, 92, 122, 0.18)', glow2: 'rgba(255, 140, 80, 0.12)',
      },
      {
        slug: 'tapis-de-souris-gaming', label: 'Gaming',
        glow1: 'rgba(0, 200, 255, 0.16)', glow2: 'rgba(59, 91, 255, 0.14)',
      },
      {
        slug: 'tapis-de-souris-fantasy', label: 'Fantasy',
        glow1: 'rgba(155, 92, 255, 0.20)', glow2: 'rgba(196, 120, 255, 0.14)',
      },
      {
        slug: 'tapis-de-souris-girly', label: 'Girly',
        glow1: 'rgba(255, 120, 180, 0.22)', glow2: 'rgba(255, 180, 210, 0.15)',
      },
      {
        slug: 'tapis-de-souris-minimaliste', label: 'Minimaliste',
        glow1: 'rgba(200, 200, 220, 0.10)', glow2: 'rgba(140, 140, 160, 0.06)',
      },
    ],

    // 4 témoignages clients, par locale. Adapter par niche (texte + nom).
    testimonials: {
      fr: [
        { name: 'Tom Duclk',    text: "Je joue plusieurs heures d'affilée et je ressentais souvent de l'inconfort avec mes anciens tapis. Celui-ci est doux, stable et très agréable, même sur de longues sessions." },
        { name: 'Niamh Oxley',  text: "Très facile à nettoyer, aucune trace même après plusieurs semaines d'utilisation. Un simple coup de chiffon suffit pour qu'il reste comme neuf." },
        { name: 'Mary Green',   text: "Le tapis personnalisé est exactement fidèle à l'image que j'ai fournie. Les couleurs sont nettes, le rendu parfait et la qualité vraiment au top. Très satisfait du résultat." },
        { name: 'Pierre L.',    text: "Designs uniques et magnifiques, le rendu est superbe. Très belle qualité visuelle." },
      ],
      en: [
        { name: 'Tom Duclk',   text: "I play for hours on end and used to feel discomfort with my old pads. This one is soft, stable and very pleasant, even during long sessions." },
        { name: 'Niamh Oxley', text: "Very easy to clean, no marks even after several weeks of use. A simple wipe is enough to keep it like new." },
        { name: 'Mary Green',  text: "The custom pad matches the image I provided exactly. Colors are sharp, the rendering is perfect and the quality is truly top-notch. Very satisfied." },
        { name: 'Pierre L.',   text: "Unique and beautiful designs, the result is stunning. Excellent visual quality." },
      ],
      de: [
        { name: 'Tom Duclk',   text: "Ich spiele stundenlang am Stück und hatte mit meinen alten Pads oft Unbehagen. Dieses ist weich, stabil und sehr angenehm, auch bei langen Sessions." },
        { name: 'Niamh Oxley', text: "Sehr einfach zu reinigen, keine Spuren auch nach mehreren Wochen Nutzung. Ein einfaches Wischen reicht, damit es wie neu bleibt." },
        { name: 'Mary Green',  text: "Das personalisierte Pad entspricht genau dem Bild, das ich geliefert habe. Die Farben sind scharf, das Ergebnis perfekt und die Qualität wirklich top. Sehr zufrieden." },
        { name: 'Pierre L.',   text: "Einzigartige und wunderschöne Designs, das Ergebnis ist großartig. Exzellente visuelle Qualität." },
      ],
    },

    // 5 questions FAQ, par locale. Les q/a sont parsées en JSON-LD FAQPage.
    faqs: {
      fr: [
        { q: 'Comment choisir le meilleur tapis de souris pour votre setup ?',
          a: "Le choix de votre tapis de souris dépend essentiellement de votre usage. Pour les joueurs compétitifs (FPS, MOBA), nous recommandons nos tapis de souris gamer avec une surface « Speed » ou « Control », optimisée pour la précision des capteurs optiques et laser. Pour le télétravail ou le bureau, privilégiez le confort et l'esthétique. Nos modèles offrent une glisse douce qui réduit la fatigue du poignet, tout en habillant votre espace de travail avec des designs uniques." },
        { q: 'Pourquoi opter pour un tapis de souris XXL (Deskmat) ?',
          a: "Le tapis de souris XXL, aussi appelé Deskmat, est devenu la nouvelle norme. Contrairement au format standard carré, le grand format (900×400 mm ou plus) couvre l'intégralité de votre bureau. Il accueille à la fois votre clavier et votre souris pour une stabilité totale, protège la surface de votre bureau contre les rayures, et unifie visuellement votre setup gaming ou bureautique. Plus besoin de repositionner votre souris en plein jeu !" },
        { q: 'Matériaux durables, base antidérapante et bords cousus : que faut-il vérifier ?',
          a: "La qualité d'un tapis se juge sur la durée. Tous nos produits sont conçus avec une base en caoutchouc antidérapante qui assure une adhérence parfaite sur le bureau, même lors de mouvements brusques. La surface en tissu micro-tissé assure une glisse fluide, tandis que les bords cousus renforcés empêchent l'effilochage sur le long terme. La majorité de nos tapis sont résistants à l'eau et lavables, garantissant une hygiène parfaite pour votre espace." },
        { q: 'Les tapis RGB améliorent-ils les performances ?',
          a: "Non, techniquement le RGB n'améliore pas la précision ni la vitesse. Mais c'est un vrai plus esthétique pour un setup gaming, et certains modèles intègrent un hub USB ou une recharge sans fil pour la souris - là, ça devient pratique." },
        { q: 'Comment nettoyer un tapis de souris ?',
          a: "À la main avec de l'eau tiède et un peu de savon doux, en frottant délicatement avec une éponge. Rincez abondamment et laissez sécher à plat, à l'air libre (jamais au sèche-cheveux ni au soleil direct). Évitez la machine à laver sur les modèles avec base caoutchouc cousue." },
      ],
      en: [
        { q: 'How to choose the best mouse pad for your setup?',
          a: "Your mouse pad choice depends mainly on your use. For competitive players (FPS, MOBA), we recommend our gaming mouse pads with a Speed or Control surface, optimized for the precision of optical and laser sensors. For remote work or office use, prioritize comfort and aesthetics. Our models offer a smooth glide that reduces wrist fatigue, while dressing up your workspace with unique designs." },
        { q: 'Why opt for an XXL mouse pad (Deskmat)?',
          a: "The XXL mouse pad, also called Deskmat, has become the new standard. Unlike the small square format, the large format (900×400 mm / 35×16 in or more) covers your entire desk. It fits both your keyboard and mouse for total stability, protects the desk surface from scratches, and visually unifies your gaming or office setup. No more repositioning your mouse mid-game!" },
        { q: 'Durable materials, non-slip base and stitched edges: what to check?',
          a: "Pad quality is judged over time. All our products are designed with a non-slip natural rubber base that grips the desk perfectly, even during sudden movements. The micro-woven cloth surface ensures smooth glide, while reinforced stitched edges prevent fraying long-term. Most of our pads are water-resistant and machine-washable, guaranteeing perfect hygiene." },
        { q: 'Do RGB pads improve performance?',
          a: "No, technically RGB doesn't improve precision or speed. But it's a real aesthetic plus for a gaming setup, and some models integrate a USB hub or wireless charging for the mouse — that's where it becomes practical." },
        { q: 'How to clean a mouse pad?',
          a: "By hand with lukewarm water and a bit of mild soap, gently scrubbing with a sponge. Rinse thoroughly and let it air-dry flat (never with a hairdryer or in direct sunlight). Avoid the washing machine on models with a stitched rubber base." },
      ],
      de: [
        { q: 'Wie wählst du das beste Mauspad für dein Setup?',
          a: "Die Wahl deines Mauspads hängt vor allem von deiner Nutzung ab. Für kompetitive Spieler (FPS, MOBA) empfehlen wir unsere Gaming-Mauspads mit Speed- oder Control-Oberfläche, optimiert für die Präzision optischer und Laser-Sensoren. Fürs Homeoffice oder Büro bevorzug Komfort und Ästhetik. Unsere Modelle bieten ein sanftes Gleiten, das die Handgelenkermüdung reduziert, und schmücken deinen Arbeitsplatz mit einzigartigen Designs." },
        { q: 'Warum ein XXL-Mauspad (Deskmat) wählen?',
          a: "Das XXL-Mauspad, auch Deskmat genannt, ist die neue Norm geworden. Im Gegensatz zum quadratischen Standardformat bedeckt das große Format (900×400 mm oder mehr) deinen gesamten Schreibtisch. Es nimmt sowohl deine Tastatur als auch deine Maus für totale Stabilität auf, schützt die Schreibtischoberfläche vor Kratzern und vereint visuell dein Gaming- oder Büro-Setup. Kein Repositionieren der Maus mehr mitten im Spiel!" },
        { q: 'Langlebige Materialien, rutschfeste Basis und vernähte Ränder: was prüfen?',
          a: "Die Qualität eines Pads beurteilt sich über die Zeit. Alle unsere Produkte sind mit einer rutschfesten Naturkautschuk-Basis konzipiert, die perfekt am Schreibtisch haftet, auch bei abrupten Bewegungen. Die mikro-gewebte Stoffoberfläche sichert ein sanftes Gleiten, während verstärkte vernähte Ränder das Ausfransen langfristig verhindern. Die meisten unserer Pads sind wasserbeständig und maschinenwaschbar." },
        { q: 'Verbessern RGB-Pads die Performance?',
          a: "Nein, technisch verbessert RGB weder Präzision noch Geschwindigkeit. Aber es ist ein echter ästhetischer Plus für ein Gaming-Setup, und einige Modelle integrieren einen USB-Hub oder kabelloses Laden für die Maus — da wird es praktisch." },
        { q: 'Wie reinigt man ein Mauspad?',
          a: "Per Hand mit lauwarmem Wasser und etwas milder Seife, sanft mit einem Schwamm reiben. Gründlich spülen und flach an der Luft trocknen lassen (niemals mit Föhn oder in direkter Sonne). Vermeide die Waschmaschine bei Modellen mit vernähter Gummibasis." },
      ],
    },
  },
};

// Auto-derive legal.domain from `url` if left empty (avoid double-source-of-truth)
if (!config.legal.domain) {
  config.legal.domain = config.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default config;
