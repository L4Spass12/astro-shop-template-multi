/**
 * Remplit src/content/productCategories/*.md avec un guide d'achat +
 * une FAQ rédigés par catégorie. Écrit par-dessus les fichiers existants
 * mais préserve le frontmatter d'origine (title, intro, keywords…).
 *
 * Lancer manuellement après avoir ajusté le texte ci-dessous.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '..', 'src', 'content', 'productCategories');

// Pour chaque catégorie : { faq: [{q,a}], body: "<markdown>" }
const CONTENT = {
  'tapis-de-souris-gaming': {
    faq: [
      { q: "Un tapis gaming change-t-il vraiment la précision ?", a: "Oui, de manière mesurable. Une surface homogène réduit les micro-accrochages et permet au capteur de la souris de tracker sans décrochage. Sur une séance de 2 h en FPS, un bon tapis gaming améliore la régularité du viseur et limite la fatigue du poignet." },
      { q: "Faut-il privilégier une surface vitesse ou contrôle ?", a: "Vitesse si vous jouez à des FPS très dynamiques (Valorant, Apex) avec une sensibilité basse : la souris glisse plus loin avec moins d'effort. Contrôle si vous faites du MMO ou du MOBA où chaque clic compte : la surface freine légèrement pour un arrêt net. Les tapis hybrides offrent un compromis honnête." },
      { q: "Quelle taille choisir pour du gaming ?", a: "Un 45×40 cm suffit pour la plupart des joueurs. Si vous jouez en sensibilité très basse (400 DPI ou moins), passez au XXL 90×40 cm pour couvrir aussi le clavier et avoir toute la place nécessaire pour un grand balayage." },
      { q: "Un tapis gaming s'use-t-il vite ?", a: "Un modèle avec base caoutchouc cousue et surface tissée tient 2-3 ans en usage intensif. Les patins de la souris usent la surface progressivement — c'est normal. Évitez juste de le rouler trop serré ou de le laisser au soleil." },
      { q: "Le RGB sert-il à quelque chose pour gamer ?", a: "Pas en performance. Le RGB est purement esthétique (et pratique si le tapis intègre un hub USB ou une zone de recharge sans fil). Beaucoup de pros jouent sur tapis non éclairé." },
    ],
    body: `
## Pourquoi investir dans un tapis de souris gaming ?

Un **tapis de souris gaming** n'est pas un accessoire cosmétique : c'est la surface qui conditionne directement la précision de votre viseur, la régularité de vos flicks et la fatigue de votre poignet en fin de session. Sur un bureau brut ou un tapis inadapté, le capteur de la souris peine à tracker, les patins accrochent, et chaque micro-mouvement parasite coûte des headshots.

## Comment choisir son tapis gaming ?

### La surface : tissu, dur ou hybride

- **Tissu** (la norme) : polyvalent, silencieux, confortable. Idéal pour 90 % des joueurs.
- **Surface dure** (plastique, aluminium) : glisse ultra-rapide, mais bruyante et agressive pour les patins. Réservé aux joueurs compétitifs qui savent exactement ce qu'ils veulent.
- **Hybride** : un entre-deux moderne, rapidité d'un dur avec le confort d'un tissu.

### La taille

La taille doit correspondre à **votre sensibilité de souris**. Sensibilité basse (grands mouvements pour viser) → taille XXL obligatoire. Sensibilité haute → un tapis standard 45×40 cm suffit.

### La base antidérapante

Un tapis qui bouge en plein 1v1 vous coûte la partie. Cherchez une **base caoutchouc dense et cousue au bord** — les collages finissent toujours par se décoller après quelques mois.

## Entretien et durée de vie

Un lavage à la main tous les 2-3 mois avec de l'eau tiède et un peu de savon suffit. Rincez abondamment et **laissez sécher à plat à l'air libre**, jamais au soleil direct. Un bon tapis gaming tient facilement 3 ans avant que la surface ne commence à lisser sous les patins.
`.trim(),
  },

  'tapis-de-souris-xxl': {
    faq: [
      { q: "Un tapis XXL a-t-il un vrai intérêt ?", a: "Oui si vous jouez avec une sensibilité de souris basse ou si vous voulez unifier visuellement votre setup. Un XXL (90×40 cm minimum) couvre la souris ET le clavier, évite les micro-bords du tapis classique, et protège le bureau des rayures et de l'usure." },
      { q: "Quelle taille exacte choisir ?", a: "Le format standard XXL est 90×40 cm. Pour les très grands bureaux (160 cm+), visez 100×50 cm voire 120×60 cm. Mesurez votre bureau avant d'acheter — un tapis trop petit qui ne couvre pas le clavier perd son intérêt." },
      { q: "Est-ce que ça tient sur un bureau de 140 cm ?", a: "Un 90×40 cm laisse environ 25 cm de libre de chaque côté sur un bureau 140 cm — c'est la configuration idéale pour avoir assez de place pour les avant-bras sans avoir le tapis qui dépasse." },
      { q: "Comment nettoyer un tapis XXL ?", a: "À la main dans la baignoire, avec de l'eau tiède et un savon doux. Frottez délicatement, rincez à fond, puis laissez sécher à plat sur une serviette. Éviter la machine à laver — la base caoutchouc se déforme avec la chaleur." },
      { q: "Un XXL se roule-t-il bien pour le transporter ?", a: "Oui, mais roulez-le toujours dans le sens de la surface (tissu vers l'extérieur) pour ne pas marquer la base. Ne le pliez jamais." },
    ],
    body: `
## Pourquoi un format XXL change tout

Un **tapis de souris XXL** ne sert pas qu'à faire beau sur Instagram. Il résout trois problèmes concrets : le bord du tapis classique qui coupe le mouvement en pleine action, les rayures sur le bureau en bois, et le clavier qui glisse sur une surface différente de celle de la souris. Sur un format 90×40 cm ou plus, tout est uniformisé.

## Comment bien choisir son XXL

### La taille en détail

- **90×40 cm** : standard, idéal bureau 120-140 cm
- **100×50 cm** : confort premium, bureau 160 cm+
- **120×60 cm** : format "desk mat" complet, pour un bureau 180 cm

### La matière

Le **tissu tressé fin** reste la référence : glisse équilibrée, confort au touché, esthétique sobre ou imprimée. Les desk mats en **similicuir** sont plus élégants mais légèrement moins performants pour la souris — à privilégier pour un bureau majoritairement bureautique.

### La finition

Un bon XXL a des bords surpiqués (empêche l'effilochage) et une base caoutchouc **antidérapante sans picots** (ne marque pas le bois du bureau).

## XXL et gaming compétitif

Les pros de FPS jouent quasiment tous sur XXL parce qu'ils utilisent des sensibilités DPI très basses (400-800). Un grand balayage de bras = une rotation complète à l'écran, ce qui nécessite autant d'espace libre pour la souris. Sur un tapis standard, le tapis s'arrête au milieu d'un mouvement de flick : échec assuré.
`.trim(),
  },

  'tapis-de-souris-kawaii': {
    faq: [
      { q: "Un tapis kawaii est-il aussi performant qu'un tapis gaming classique ?", a: "Oui si le fabricant utilise les mêmes standards : tissu tressé fin, base caoutchouc cousue, impression haute définition résistante aux UV. Chez BuddyPad, toutes les références kawaii utilisent la même surface de glisse que la gamme gaming." },
      { q: "Les couleurs pastel s'abîment-elles vite ?", a: "Pas si l'impression est par sublimation thermique (technique pro) et non par sérigraphie. Un bon tapis kawaii garde ses couleurs plusieurs années, même avec un nettoyage régulier." },
      { q: "C'est trop chargé visuellement pour le travail ?", a: "Dépend de votre setup global. Un tapis kawaii pastel s'intègre très bien avec un écran dans une ambiance clear/rose/blanc cassé. Si votre bureau est tout noir gamer, privilégiez les modèles kawaii avec fond sombre et motifs plus discrets." },
      { q: "Format adapté aux grands bureaux ?", a: "Oui, la plupart de nos modèles kawaii sont disponibles en XXL 90×40 cm. C'est d'ailleurs le format qui met le plus en valeur les illustrations (paysages, scènes)." },
      { q: "Comment entretenir sans abîmer l'impression ?", a: "Éponge légèrement humide + savon doux, sans frotter fort sur l'impression. Rincer à l'eau claire, sécher à plat. Éviter l'alcool, l'eau de Javel et les nettoyants abrasifs." },
    ],
    body: `
## L'esthétique kawaii, bien plus qu'une tendance

Le **kawaii** (可愛い, "mignon" en japonais) est une culture visuelle à part entière : couleurs douces, personnages attachants, motifs rassurants. Dans un setup PC, un tapis kawaii apporte une touche de personnalité qui tranche avec l'uniformité du matériel gaming classique — tout noir, tout RGB, tout agressif.

## Les styles kawaii les plus populaires

### Pastel et pastel goth

Tons rose, lavande, menthe, bleu ciel. Ambiance douce, parfait pour un bureau dans une chambre ou un studio.

### Animaux mignons

Chats endormis, lapins, pandas, ours en peluche. Les bestsellers de cette catégorie.

### Culture japonaise stylisée

Cerisiers, sakura, géishas en version cute, motifs traditionnels avec un twist mignon.

## Choisir entre motif dense ou minimal

Un **motif dense** (paysage illustré, scène complète) est plus impactant visuellement mais peut perturber si vous utilisez aussi un logiciel de design à côté. Un **motif minimal** (petits éléments sur fond uni) est plus polyvalent et se marie avec tous les setups.

## Entretien pour préserver l'impression

Les tapis kawaii utilisent une impression par sublimation qui pénètre dans les fibres — donc beaucoup plus durable qu'une impression de surface. Un nettoyage doux à l'éponge tous les 2-3 mois suffit à garder les couleurs comme au premier jour.
`.trim(),
  },

  'tapis-de-souris-manga-anime': {
    faq: [
      { q: "Les licences sont-elles officielles ?", a: "Nos designs manga/anime sont des créations originales **inspirées** de l'univers manga/anime, pas des reproductions de scènes copyrightées. Cela permet de proposer des designs uniques tout en respectant la propriété intellectuelle des studios japonais." },
      { q: "Quel style d'anime fonctionne le mieux en XXL ?", a: "Les scènes illustrées (paysages, combats, portraits grand format) sont spectaculaires en XXL 90×40 cm. Les motifs plus graphiques (icônes, logos) fonctionnent aussi très bien en format standard 45×40 cm." },
      { q: "La surface permet-elle le gaming compétitif ?", a: "Oui, tous nos tapis manga/anime utilisent le même tissu tressé fin que les modèles gaming pros. L'impression par sublimation ne modifie pas les propriétés de glisse." },
      { q: "Les couleurs vives tiennent dans le temps ?", a: "Oui, grâce à la sublimation thermique (les pigments deviennent partie intégrante des fibres). Après 2-3 ans d'usage intensif, les couleurs restent vibrantes." },
      { q: "Un manga trop chargé nuit-il au gaming ?", a: "Les joueurs compétitifs préfèrent souvent des tons uniformes pour ne pas distraire le regard du réticule. Mais pour du jeu occasionnel ou un setup déco, un design manga détaillé n'a aucun impact sur les performances — c'est surtout une question de goût." },
    ],
    body: `
## Le manga et l'anime au cœur du setup

Un **tapis de souris manga** ou **anime** transforme un bureau standard en territoire d'expression. Que vous soyez fan de shonen classiques (combats, épopées), de seinen plus sombre, ou de l'esthétique shojo colorée, le tapis est l'endroit idéal pour afficher votre univers sans envahir toute la pièce.

## Les grandes familles de designs

### Samouraï et culture japonaise traditionnelle

Katanas, armures, cerisiers, paysages montagneux. Esthétique sombre souvent, avec des accents rouges ou dorés.

### Anime contemporain

Personnages stylisés, scènes d'action, portraits de héros. Designs très graphiques avec lignes nettes.

### Kawaii manga

Intersection avec la catégorie kawaii : personnages mignons en style manga classique (gros yeux, expressions exagérées, couleurs pastel).

## Qualité d'impression et résistance

Tous nos tapis manga utilisent une **impression par sublimation thermique** : les pigments pénètrent le tissu au lieu d'être posés à sa surface. Résultat : couleurs vibrantes, résistance aux UV, et surtout pas de dégradation au nettoyage. Un tapis anime bien entretenu garde son éclat 3-5 ans facilement.

## Format recommandé selon le design

Les **scènes complètes** (paysages, tableaux) brillent en XXL 90×40 cm. Les **portraits ou icônes** restent percutants en format standard. À vous de voir selon l'espace disponible sur votre bureau.
`.trim(),
  },

  'tapis-de-souris-girly': {
    faq: [
      { q: "Le rose reste-t-il pro sur un bureau de télétravail ?", a: "Oui, les teintes rose poudré, rose pâle ou terracotta passent parfaitement en visio. Évitez le fuchsia vif si vous voulez jouer la sobriété." },
      { q: "Peut-on avoir du girly sans être trop chargé ?", a: "Les modèles minimalistes avec fond uni rose et un petit motif discret (un seul papillon, une fleur simple) sont très polyvalents. Ils restent doux sans envahir visuellement le setup." },
      { q: "Un tapis girly abîme-t-il moins que les autres ?", a: "Non, la durabilité dépend de la qualité de fabrication (tissu, sublimation, base), pas de l'esthétique. Un bon tapis girly tient aussi longtemps qu'un tapis gaming." },
      { q: "Format XXL disponible pour les modèles girly ?", a: "Oui, la majorité de nos références girly sont disponibles en XXL 90×40 cm. L'effet est particulièrement réussi avec les designs floraux ou marbrés." },
      { q: "Entretien pour garder les couleurs roses vives ?", a: "Lavage doux à l'eau tiède + savon neutre, pas d'eau de Javel (jaunit les roses), séchage à plat à l'abri du soleil direct." },
    ],
    body: `
## Le girly, une esthétique assumée

Un **tapis de souris girly** n'est pas un compromis : c'est un choix esthétique fort, avec la même exigence de qualité technique que les autres catégories. Rose poudré, pastels doux, motifs floraux ou marbrés — un bureau girly est souvent plus harmonieux visuellement qu'un setup gaming chargé.

## Les teintes qui marchent le mieux

### Rose pastel et rose poudré

Les valeurs sûres, s'intègrent avec tout : bois clair, blanc, chrome, céladon.

### Marbré rose et or

Plus luxueux, idéal pour un bureau de travail créatif (design, contenu, photo).

### Terracotta et rose saumon

Tendance 2025-2026, plus chaud que le rose classique, très flatteur sur le bureau.

## Associer un tapis girly avec le reste du matériel

Un tapis rose s'accorde idéalement avec :

- Clavier blanc ou rose (les MX Blue ou Brown en version pastel existent maintenant)
- Souris blanche, rose ou argentée
- Support d'écran en bois clair
- Lampe LED rose tamisé (pas le RGB agressif)

## Durabilité et entretien

Le rose est une couleur qui **marque plus facilement les traces de saleté** que les tons sombres. Nettoyez plus souvent (tous les 1-2 mois) avec de l'eau tiède et un savon doux. Évitez absolument l'eau de Javel qui jaunit les fibres roses.
`.trim(),
  },

  'girl-boss': {
    faq: [
      { q: "Un tapis Girl Boss, c'est pour quel usage ?", a: "Principalement bureautique et télétravail : les citations motivantes et l'esthétique affirmée fonctionnent mieux dans un contexte pro que gaming compétitif. Mais techniquement, la surface reste adaptée à tous les usages." },
      { q: "Les citations s'abîment-elles avec le temps ?", a: "L'impression par sublimation garantit que le texte reste net et lisible même après des années d'utilisation, même dans les zones les plus sollicitées par la souris." },
      { q: "Format idéal pour le télétravail ?", a: "Un 70×30 cm ou un XXL 90×40 cm sont parfaits : le tapis couvre la zone clavier + souris et la citation reste visible sur la partie gauche/droite." },
      { q: "Peut-on avoir sa propre citation ?", a: "Certains modèles de la gamme proposent des variantes avec différentes citations inspirantes. Pour une personnalisation totale (votre citation), il faut passer par le tapis personnalisé." },
      { q: "Le style Girl Boss passe-t-il en visio professionnelle ?", a: "Absolument — c'est même souvent un excellent brise-glace en réunion. Les citations positives et l'esthétique sobre (noir + doré, ou pastel + texte) transmettent un message clair sans être agressives." },
    ],
    body: `
## Un bureau qui affirme vos valeurs

La collection **Girl Boss** n'est pas qu'une tendance marketing : c'est un concept de bureau qui transforme votre espace de travail en territoire d'affirmation personnelle. Citations motivantes, esthétique sobre et affirmée, couleurs qui donnent de l'énergie — chaque détail contribue à l'état d'esprit.

## Pour qui ces tapis sont-ils faits ?

### Entrepreneures et freelances

Le tapis est un rappel visuel constant de vos objectifs pendant les longues journées de travail autonome. Plus efficace qu'un post-it motivant collé à l'écran.

### Étudiantes ambitieuses

Préparation de concours, études longues, projets perso — l'énergie que diffuse un bureau bien designé influence directement la productivité et la persévérance.

### Créatrices de contenu et designeuses

Un bureau photogénique qui passe bien en vidéo et en photo sans effort. Pratique si vous partagez régulièrement votre setup sur les réseaux.

## Les codes esthétiques Girl Boss

- **Palette dominante** : noir, blanc, doré (ou rose + noir pour la version plus féminine)
- **Typographie** : serif élégante ou script manuscrit
- **Messages** : motivation, affirmation, ambition, élégance

## Complément idéal au reste du setup

Un tapis Girl Boss se marie bien avec :

- Un organiseur de bureau en similicuir noir ou rose
- Un support pour ordinateur portable minimaliste
- Une lampe d'appoint design
- Un agenda ou planner bien tenu
`.trim(),
  },

  'tapis-de-souris-minimaliste': {
    faq: [
      { q: "Un tapis minimaliste est-il plus performant ?", a: "Pas en tant que tel — la performance dépend de la qualité du tissu et de la base, pas du design. Mais un tapis minimaliste **distrait moins** le regard pendant le jeu compétitif ou le travail de concentration, ce qui aide indirectement." },
      { q: "Quelle couleur choisir ?", a: "Noir pour masquer les traces d'usure et la poussière, gris anthracite pour un compromis entre discrétion et élégance, beige/cream pour un setup clair et aéré, blanc pour un effet très pro (mais nécessite un entretien plus fréquent)." },
      { q: "Y a-t-il vraiment un intérêt par rapport à un tapis uni basique ?", a: "Oui : un bon tapis minimaliste haut de gamme se distingue par la qualité du tissu (tressage plus fin), les finitions (bord surpiqué précis) et la stabilité de la base. Un tapis uni cheap reste inférieur." },
      { q: "Format recommandé pour un bureau pro ?", a: "Un desk mat XXL 90×40 cm en cream ou gris anthracite. Ça protège le bureau, uniformise visuellement, et reste discret en visio." },
      { q: "Quel rendu avec un écran blanc / mac ?", a: "Un tapis cream ou gris clair complète parfaitement un setup Mac + écran blanc. Le noir crée un contraste plus marqué qui peut être intéressant en ambiance tamisée." },
    ],
    body: `
## Le choix de la sobriété

Un **tapis de souris minimaliste** part d'une conviction : le matériel de bureau ne doit pas hurler pour être qualitatif. Une surface unie, parfaitement finie, dans une couleur sobre — c'est tout ce qu'il faut pour un bureau élégant et intemporel.

## Pour quel profil ?

### Les professionnels en télétravail

Un tapis discret qui passe bien en visio client et qui ne distrait pas pendant les longues sessions de concentration.

### Les développeurs et créatifs

Le design du bureau influence la créativité. Un tapis minimaliste crée un fond neutre sur lequel les idées se projettent plus facilement que sur un motif chargé.

### Les adeptes du "clean setup"

Communauté importante sur Reddit/Instagram qui cultive l'esthétique épurée : un seul écran, peu de câbles visibles, tapis uni, lampe sobre. Le tapis minimaliste est un pilier de ce style.

## Les finitions qui font la différence

Un minimaliste haut de gamme se reconnaît à :

- La **qualité du tissu** (on doit sentir la densité sous le doigt)
- Les **bords surpiqués** parfaitement réguliers
- La **base caoutchouc** uniforme sans odeur ni picots qui marquent
- La **couleur saturée** et homogène (pas de zones plus claires/foncées)

## Les meilleures combinaisons

- **Noir uni** + clavier blanc = contraste gaming classique mais sobre
- **Cream/beige** + bois clair = ambiance scandinave
- **Gris anthracite** + chrome/acier = look tech pro
- **Blanc** + Mac = minimalisme total (mais à nettoyer souvent)
`.trim(),
  },

  'tapis-de-souris-buddypad-adventure': {
    faq: [
      { q: "Qu'est-ce qui caractérise la collection Adventure ?", a: "Des designs inspirés de paysages, de voyages et de la nature : montagnes au crépuscule, forêts brumeuses, déserts, panoramas côtiers. Un ton plus contemplatif que les collections gaming ou manga." },
      { q: "Format idéal pour ces designs ?", a: "Le XXL 90×40 cm met parfaitement en valeur les paysages panoramiques. Les formats standards (45×40 cm) conviennent aux designs plus centrés sur un élément (montagne, arbre unique)." },
      { q: "Couleurs ternes ou vibrantes ?", a: "Les deux existent : scènes au coucher de soleil avec teintes chaudes, paysages nordiques avec palette froide, ambiances fantastiques avec dégradés marqués. À vous de choisir selon votre mood." },
      { q: "Les détails des paysages restent visibles ?", a: "Oui, l'impression sublimation permet une résolution de détail élevée. Les textures, reliefs et petits éléments restent nets même sur un XXL." },
      { q: "Compatible gaming compétitif ?", a: "Techniquement oui, mais les motifs détaillés peuvent distraire en FPS compétitif. Mieux adapté au jeu solo immersif, à la création, ou à la bureautique." },
    ],
    body: `
## L'évasion sur votre bureau

La collection **Buddypad Adventure** part d'un constat simple : nos bureaux sont souvent les endroits où nous passons le plus de temps éveillés, et ils manquent cruellement d'ouverture visuelle. Un tapis Adventure, c'est une fenêtre permanente sur un paysage qui fait respirer l'espace.

## Les ambiances phares

### Paysages de montagne

Crêtes au soleil couchant, sommets enneigés, vallées brumeuses — inspire calme et hauteur de vue.

### Scènes forestières

Sous-bois embrumés, forêts d'automne, arbres isolés — idéal pour un bureau dans un environnement cosy (télétravail, studio).

### Océans et côtes

Vagues, falaises, couchers de soleil sur l'eau — apporte une sensation d'espace et d'horizon.

### Déserts et mesas

Paysages américains, rouges ocres, esthétique "road trip" — plus graphique, parfait pour un setup avec une vibe vintage ou créative.

## Comment intégrer un paysage dans son setup

L'astuce : **choisir un paysage dont les tons dominants s'accordent avec les autres éléments du bureau**. Une vallée au couchant (orange/violet) se marie avec un éclairage ambient chaud. Une forêt nordique (vert froid/bleu) fonctionne mieux avec une lumière neutre et un bureau bois clair.

## Format et impact visuel

Le XXL 90×40 cm est **le format idéal** pour cette collection : les panoramas prennent toute leur dimension. En format standard, choisissez des designs plus centrés (un arbre unique, un lac, une montagne isolée) pour garder la force visuelle.
`.trim(),
  },

  'tapis-de-souris-fantasy': {
    faq: [
      { q: "La collection Fantasy couvre quels univers ?", a: "Médiéval-fantastique (dragons, chevaliers, châteaux), heroic fantasy (paysages mystiques, créatures), dark fantasy (esthétique plus sombre). Pas de références directes à des licences copyrightées." },
      { q: "Les couleurs sombres s'accordent avec quel setup ?", a: "Parfait pour un bureau avec éclairage tamisé, LED bleues/violettes, clavier avec switches sombres. Moins bon pour un setup ultra clean et lumineux." },
      { q: "Format conseillé pour un design fantasy détaillé ?", a: "XXL pour vraiment apprécier les scènes complexes (batailles, paysages avec dragons). Format standard si vous préférez un motif central." },
      { q: "Adapté au jeu JRPG et MMO ?", a: "C'est exactement le public cible. L'immersion commence avant l'écran — un tapis fantasy met dans l'ambiance pour des sessions WoW, FFXIV, Elden Ring." },
      { q: "Durabilité des designs sombres ?", a: "Meilleure que les designs très clairs : les tons foncés masquent les micro-usures et les traces. Une autre bonne raison de choisir un design fantasy sombre pour un usage quotidien intense." },
    ],
    body: `
## L'imaginaire à portée de souris

Un **tapis fantasy** transforme un bureau en extension de l'univers que vous aimez. Que vous jouiez à du JRPG, que vous écriviez de la fiction, ou que vous soyez juste fan d'imaginaire — l'esthétique compte autant que la performance technique.

## Les grands styles fantasy

### Médiéval-fantastique classique

Dragons, châteaux, chevaliers, forêts enchantées. L'univers popularisé par Tolkien, D&D, Warhammer.

### Dark fantasy

Ambiances sombres, créatures mystérieuses, paysages inquiétants. Influence Bloodborne, Dark Souls, Berserk.

### Heroic fantasy coloré

Paysages plus lumineux, magie éclatante, personnages héroïques. Plus accessible visuellement.

### Mythologie et légendes

Samouraïs, vikings, figures mythologiques — intersection avec la catégorie manga pour les designs japonais.

## Jouer avec l'éclairage ambient

Un tapis fantasy prend toute sa dimension dans une ambiance travaillée :

- **LED violettes/bleues** pour renforcer l'atmosphère mystique
- **Lampe de bureau à intensité variable** pour créer différentes ambiances selon l'heure
- **Écran avec mode lumière réduite** pour les sessions du soir
- **Figurines ou objets déco** qui prolongent l'univers du tapis

## Pour les sessions de jeu longues

Les joueurs MMO et JRPG passent souvent 3-4 h d'affilée devant l'écran. Un tapis fantasy bien choisi fait partie de l'expérience — il renforce l'immersion sans distraire du gameplay, surtout en XXL où l'œil capte toujours un peu le paysage en arrière-plan.
`.trim(),
  },

  'tapis-souris-led-rgb': {
    faq: [
      { q: "Le RGB améliore-t-il les performances ?", a: "Non, strictement aucun gain de précision ou de vitesse. Le RGB est purement esthétique. Mais il apporte une vraie immersion dans un setup gaming, et certains modèles intègrent des fonctionnalités pratiques (hub USB, recharge)." },
      { q: "Comment est alimenté le rétroéclairage ?", a: "Par un câble USB qui se branche sur le PC ou sur un chargeur mural. Ce câble est généralement intégré de manière discrète au tapis (sortie à l'arrière)." },
      { q: "Le RGB consomme beaucoup ?", a: "Très peu : environ 2-5W en fonctionnement. L'équivalent d'une petite LED domestique. Aucun impact sur la consommation globale du PC." },
      { q: "Peut-on couper le RGB pour dormir ?", a: "Oui : un bouton physique sur le tapis ou la touche associée du clavier (selon modèle et logiciel utilisé). Certains modèles synchronisent l'extinction avec le PC." },
      { q: "Le RGB est-il compatible avec iCue, Razer Synapse, etc. ?", a: "Cela dépend du modèle. Les tapis RGB génériques ont leur propre contrôleur. Pour une sync avec votre écosystème (clavier + souris + tapis en RGB coordonnés), vérifiez la compatibilité logicielle avant d'acheter." },
    ],
    body: `
## Le RGB, esthétique avant tout

Un **tapis de souris LED/RGB** transforme votre bureau en enseigne lumineuse. Soyons honnêtes : c'est du spectacle, pas de la performance. Mais dans un setup gaming bien pensé, le rétroéclairage donne une signature visuelle que rien d'autre ne peut reproduire.

## Les modes d'éclairage typiques

- **Statique** : une couleur fixe, la plus sobre
- **Respiration** : fondus doux entre couleurs, relaxant
- **Arc-en-ciel cyclique** : défilement continu de toutes les couleurs, très gaming
- **Réactif audio** : synchronisé avec le son du PC (musique, sons de jeu)
- **Spectrum mode** : sync avec d'autres accessoires RGB (Razer Chroma, Corsair iCue…)

## Choisir la bonne intensité

Un tapis RGB trop agressif fatigue les yeux sur une session longue. Cherchez un modèle avec **plusieurs niveaux d'intensité réglables** et des modes "calmes" (blanc tamisé, couleur unique basse intensité) en plus des modes "gaming" spectaculaires.

## Compatibilité logicielle

Si vous avez déjà un clavier et une souris RGB d'une marque (Razer, Corsair, Logitech, SteelSeries), privilégiez un tapis de la **même marque ou compatible** pour pouvoir synchroniser les effets. Sinon vous aurez 3 éclairages désaccordés qui ruinent l'effet recherché.

## Les pièges à éviter

- Tapis RGB avec câble rigide court : difficile à placer proprement
- Bouton de contrôle caché sous le tapis : pénible pour changer d'effet
- Rétroéclairage qui "fuite" sous le bord (mauvaise finition)
- Tissu trop fin où on voit les LED par transparence en plein jour

## Combiné avec la recharge sans fil

Certains tapis RGB intègrent une **zone Qi** pour recharger la souris (compatible) directement sur le tapis. C'est la gamme premium — voir notre catégorie dédiée.
`.trim(),
  },

  'tapis-souris-led-rgb-charge-sans-fil': {
    faq: [
      { q: "Quelles souris sont compatibles ?", a: "Toutes les souris Qi compatibles : Logitech PowerPlay, Razer Hyperflux, certaines souris Corsair et autres. Vérifiez que votre souris supporte explicitement la recharge sans fil Qi avant d'acheter." },
      { q: "La recharge est-elle aussi rapide qu'en filaire ?", a: "Non, la recharge sans fil est en moyenne 30-50 % plus lente. Mais comme la souris reste en charge en permanence pendant l'utilisation, vous ne tombez jamais à plat." },
      { q: "Cela affecte-t-il la précision de la souris ?", a: "Non : le champ magnétique pour la charge est indépendant du capteur optique/laser de la souris. Les pros e-sport utilisent ces setups sans problème." },
      { q: "Quelle est la surface de recharge active ?", a: "Généralement une zone de 8-12 cm dans le coin supérieur droit du tapis. La souris se recharge dès qu'elle passe dessus, même brièvement." },
      { q: "Faut-il une alimentation spéciale ?", a: "Un simple USB 2.0 ou 3.0 suffit (câble fourni). Pour une charge optimale, branchez sur une prise murale via un chargeur USB de qualité plutôt que sur un hub non alimenté." },
    ],
    body: `
## Le combo ultime : RGB + recharge sans fil

Les **tapis LED RGB avec charge sans fil** représentent le haut de gamme absolu en matière d'accessoires gaming. Vous n'avez plus jamais à penser à charger votre souris — elle se recharge en permanence pendant que vous jouez.

## Comment ça marche ?

Le tapis intègre une **bobine de charge Qi** (norme standard de recharge sans fil) dans une zone dédiée. Quand une souris compatible entre dans cette zone, la recharge s'active automatiquement. Aucun câble, aucun dock séparé — la souris se recharge dans son environnement naturel.

## Les vrais avantages au quotidien

- **Plus jamais de souris déchargée** en pleine partie
- **Plus de câble sur le bureau** (la souris sans fil devient vraiment sans fil)
- **Setup plus propre visuellement**
- **Compatible avec les souris sans batterie apparente** (ultra-légères)

## Les limites à connaître

Tous les modèles de souris ne sont pas compatibles. Seules les souris conçues avec une bobine de réception Qi peuvent être rechargées de cette manière. Avant d'acheter le tapis, vérifiez absolument que **votre souris actuelle est compatible**, sinon il vous faudra changer les deux.

## Marques et écosystèmes

### Logitech PowerPlay

Le système propriétaire de Logitech, fonctionne avec les G Pro Superlight, G502 Lightspeed, et autres G compatibles. Très fiable.

### Razer Hyperflux

Système Razer, plus limité en compatibilité mais avec intégration parfaite dans l'écosystème Razer Chroma.

### Qi standard

Tapis "ouverts" compatibles avec toutes les souris Qi — plus flexibles mais parfois moins optimisés en vitesse de charge.

## Le confort RGB en bonus

En plus de la charge sans fil, ces tapis premium intègrent un rétroéclairage RGB complet, personnalisable, et souvent synchronisé avec le clavier et la souris via le logiciel de la marque. Le setup devient un vrai produit cohérent, plus qu'un assemblage d'accessoires.
`.trim(),
  },
};

let updated = 0;

for (const [slug, data] of Object.entries(CONTENT)) {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) {
    console.log(`  ⚠ ${slug}.md introuvable`);
    continue;
  }

  const raw = fs.readFileSync(file, 'utf8');
  // Sépare le frontmatter du body
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) {
    console.log(`  ⚠ ${slug} : frontmatter invalide`);
    continue;
  }
  let fm = fmMatch[1];

  // Remplace la ligne `faq: []` par la vraie FAQ YAML
  const faqYaml = ['faq:'];
  for (const item of data.faq) {
    faqYaml.push(`  - q: "${item.q.replace(/"/g, '\\"')}"`);
    faqYaml.push(`    a: "${item.a.replace(/"/g, '\\"')}"`);
  }
  fm = fm.replace(/^faq:\s*\[\]\s*$/m, faqYaml.join('\n'));

  const out = `---\n${fm}\n---\n\n${data.body}\n`;
  fs.writeFileSync(file, out);
  updated++;
  console.log(`  ✓ ${slug} — ${data.faq.length} FAQ + ${data.body.length} chars guide`);
}

console.log(`\n✅ ${updated} catégories enrichies`);
