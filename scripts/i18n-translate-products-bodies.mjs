#!/usr/bin/env node
/**
 * One-shot script: applique les traductions EN + DE sur les bodies des fiches
 * produit qui ont encore le marqueur <!-- TODO i18n:LANG -->.
 *
 * Les traductions sont inline ci-dessous. Idempotent : si le marqueur n'existe
 * plus dans le fichier (= déjà traduit manuellement ou par une exécution
 * précédente), le fichier est laissé inchangé.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROD = path.join(__dirname, '..', 'src/content/products');

// Map: slug → { en, de } where each is the full translated body markdown
const T = {
  'tapis-de-souris-heros': {
    en: `An anime-style hero with a determined gaze - Heros is a **manga-style gaming mouse pad** that captures the energy of the protagonists we love. Perfect for an energetic gaming setup or a Japanese-culture fan's bedroom.

High-density micro-woven cloth, non-slip rubber base, anti-fraying stitched edges. Available in Standard (45x35 cm / 18x14 in), Large (60x40 cm / 24x16 in) and XXL deskmat (90x40 cm / 35x16 in).`,
    de: `Ein Anime-Held mit entschlossenem Blick - Heros ist ein **Manga-Stil Gaming Mauspad**, das die Energie der Protagonisten verkörpert, die wir lieben. Perfekt für ein energiegeladenes Gaming-Setup oder das Zimmer eines Fans der japanischen Kultur.

Hochdichter mikro-gewebter Stoff, rutschfeste Gummibasis, vernähte Anti-Ausfransen-Ränder. Verfügbar in Standard (45x35 cm), Large (60x40 cm) und XXL Deskmat (90x40 cm).`,
  },
  'tapis-de-souris-karasu-katana': {
    en: `A black raven against a violet mist background - this **samurai gaming mouse pad** turns your desk into a Japanese manga universe. High-density micro-woven surface, non-slip rubber base, stitched edges. Available in Standard, Large and XXL to cover keyboard and mouse on the same surface.`,
    de: `Ein schwarzer Rabe vor violettem Nebel - dieses **Samurai Gaming Mauspad** verwandelt deinen Schreibtisch in ein japanisches Manga-Universum. Hochdichte mikro-gewebte Oberfläche, rutschfeste Gummibasis, vernähte Ränder. In Standard, Large und XXL verfügbar - bedeckt Tastatur und Maus auf derselben Fläche.`,
  },
  'tapis-de-souris-kawaii-cerises-roses-fleurs-3d': {
    en: `Fall for this **mouse pad** with a kawaii pastry design featuring pink cherries and white **3D**-relief flowers on a pink background. A fruity, sweet motif that brings cheer and freshness to your desk.

High-density micro-woven surface, optimized for precise tracking with every optical and laser mouse. Thick non-slip rubber base for total stability. Reinforced stitched edges to prevent fraying for long-term durability.`,
    de: `Verlieb dich in dieses **Mauspad** mit einem niedlichen Kawaii-Patisserie-Design mit rosa Kirschen und weißen **3D**-Reliefblüten auf rosa Hintergrund. Ein fruchtiges, süßes Motiv, das Frische und gute Laune auf deinen Schreibtisch bringt.

Hochdichte mikro-gewebte Oberfläche, optimiert für präzises Tracking mit jeder optischen und Laser-Maus. Dicke rutschfeste Gummibasis für totale Stabilität. Verstärkte vernähte Ränder gegen Ausfransen für maximale Haltbarkeit.`,
  },
  'tapis-de-souris-kawaii-ciel-etoile-tulipes-pastel': {
    en: `Drift away into a pastel kawaii universe with this **mouse pad** featuring a starry sky and pastel tulips in blue and pink tones. A poetic, magical **XXL mouse pad** that brings softness and wonder to your desk.

High-density micro-woven surface, optimized for precise tracking with every optical and laser mouse. Thick non-slip rubber base for total stability. Reinforced stitched edges to prevent fraying for long-term durability.`,
    de: `Lass dich in ein pastellfarbenes Kawaii-Universum entführen mit diesem **Mauspad** im Design Sternenhimmel und Pastelltulpen in Blau- und Rosatönen. Ein poetisches, märchenhaftes **XXL Mauspad**, das Sanftheit und Magie auf deinen Schreibtisch bringt.

Hochdichte mikro-gewebte Oberfläche, optimiert für präzises Tracking mit jeder optischen und Laser-Maus. Dicke rutschfeste Gummibasis für totale Stabilität. Verstärkte vernähte Ränder gegen Ausfransen für maximale Haltbarkeit.`,
  },
  'tapis-de-souris-kawaii-galaxie-pastel-etoiles': {
    en: `Drop your desk into a cosmic kawaii universe with this **mouse pad** featuring a pastel galaxy design dotted with shining stars and soft clouds. A celestial **mouse pad** in soft, luminous colors for a creative and dreamy setup.

High-density micro-woven surface, optimized for precise tracking with every optical and laser mouse. Thick non-slip rubber base for total stability. Reinforced stitched edges to prevent fraying for long-term durability.`,
    de: `Tauche deinen Schreibtisch in ein kosmisches Kawaii-Universum mit diesem **Mauspad** im Design Pastellgalaxie, übersät mit leuchtenden Sternen und sanften Wolken. Ein himmlisches **Mauspad** in sanften, leuchtenden Farben für ein kreatives und verträumtes Setup.

Hochdichte mikro-gewebte Oberfläche, optimiert für präzises Tracking mit jeder optischen und Laser-Maus. Dicke rutschfeste Gummibasis für totale Stabilität. Verstärkte vernähte Ränder gegen Ausfransen für maximale Haltbarkeit.`,
  },
  'tapis-de-souris-kawaii-lapin-rameur-nenuphar': {
    en: `Add a touch of kawaii softness to your setup with this **rower bunny mouse pad** floating on a water-lily pond. A poetic, cute illustration that turns your desk into a fairytale world - perfect for anime fans and kawaii aesthetic lovers.

## Why pick this BuddyPad kawaii mouse pad?

-   **Exclusive kawaii illustration:** rower bunny on a lily pond, soft and soothing vibe, high-definition print.
-   **Optimized glide surface:** micro-woven cloth compatible with every optical and laser sensor, balanced between speed and control.
-   **Non-slip rubber base:** total grip on wood, glass or plastic, even during the fastest movements.
-   **Reinforced stitched edges:** anti-fraying stitching for long-term durability.
-   **3 sizes available:** from standard to XXL to cover the whole desk.

## Tech specs

-   **Material:** micro-woven cloth surface / high-density non-slip rubber base
-   **Care:** hand wash with lukewarm water, dry flat in open air

## Sizes available

-   **35 x 45 cm:** standard size, ideal for the mouse alone.
-   **40 x 60 cm:** mid size, comfortably fits keyboard and mouse.
-   **40 x 90 cm (XXL):** the ultimate deskmat, covers the full keyboard + mouse area.`,
    de: `Bring eine Prise Kawaii-Sanftheit in dein Setup mit diesem **ruderndem Hasen-Mauspad** auf einem Seerosenteich. Eine poetische, niedliche Illustration, die deinen Schreibtisch in eine Märchenwelt verwandelt - ideal für Anime-Fans und Liebhaber der Kawaii-Ästhetik.

## Warum dieses BuddyPad Kawaii-Mauspad wählen?

-   **Exklusive Kawaii-Illustration:** rudernder Hase auf Seerosenteich, sanfte und beruhigende Atmosphäre, HD-Druck.
-   **Optimierte Gleitfläche:** mikro-gewebter Stoff, kompatibel mit allen optischen und Laser-Sensoren, ausgewogen zwischen Speed und Control.
-   **Rutschfeste Gummibasis:** voller Halt auf Holz, Glas oder Kunststoff, auch bei schnellsten Bewegungen.
-   **Verstärkte vernähte Ränder:** Anti-Ausfransen-Naht für lange Haltbarkeit.
-   **3 Größen verfügbar:** vom Standardformat bis XXL, um den ganzen Schreibtisch abzudecken.

## Technische Daten

-   **Material:** mikro-gewebte Stoffoberfläche / hochdichte rutschfeste Gummibasis
-   **Pflege:** Handwäsche mit lauwarmem Wasser, flach an der Luft trocknen

## Verfügbare Größen

-   **35 x 45 cm:** Standardformat, ideal nur für die Maus.
-   **40 x 60 cm:** mittleres Format, Tastatur und Maus haben bequem Platz.
-   **40 x 90 cm (XXL):** das ultimative Deskmat, deckt den gesamten Tastatur- und Mausbereich ab.`,
  },
  'tapis-de-souris-marbre-rose-pastel-papillons': {
    en: `Lift up your desk with this **mouse pad** featuring a pastel pink marble and iridescent butterflies design. The marbled background in delicate tones, dotted with butterflies in holographic shimmer, brings a chic, feminine and sophisticated touch to your workspace.

High-density micro-woven surface, optimized for precise tracking with every optical and laser mouse. Thick non-slip rubber base for total stability. Reinforced stitched edges to prevent fraying for long-term durability.`,
    de: `Veredle deinen Schreibtisch mit diesem **Mauspad** im Design Pastellrosa Marmor und schillernde Schmetterlinge. Der marmorierte Hintergrund in zarten Tönen, geschmückt mit Schmetterlingen in holografischem Schimmer, bringt einen schicken, femininen und edlen Touch in deinen Arbeitsbereich.

Hochdichte mikro-gewebte Oberfläche, optimiert für präzises Tracking mit jeder optischen und Laser-Maus. Dicke rutschfeste Gummibasis für totale Stabilität. Verstärkte vernähte Ränder gegen Ausfransen für maximale Haltbarkeit.`,
  },
  'tapis-de-souris-miami-street': {
    en: `A pixel art sunrise on Miami Street - this **pixel art gaming mouse pad** blends retro nostalgia with neon vibes for a one-of-a-kind gaming setup. Surface optimized for precision, non-slip base, stitched edges. Standard, Large and XXL.`,
    de: `Ein Pixel-Art-Sonnenaufgang auf Miami Street - dieses **Pixel Art Gaming Mauspad** verbindet Retro-Nostalgie mit Neon-Atmosphäre für ein einzigartiges Gaming-Setup. Auf Präzision optimierte Oberfläche, rutschfeste Basis, vernähte Ränder. Standard, Large und XXL.`,
  },
  'tapis-de-souris-montagne': {
    en: `## **Bring a touch of serenity and precision to your workspace.**

Turn your desk into a place of inspiration with our **Mouse Pad**. Combining minimalist Japanese aesthetics with technical performance, this deskmat is built for demanding gamers and remote-work professionals alike.

Its monochrome black and white design - depicting the iconic Japanese peak emerging from the mist - fits any **gaming setup** or modern desk perfectly.

## **Why choose this deskmat?**

-   **Zen & elegant design:** the high-definition print of Mount Fuji creates a soothing, refined atmosphere. The grey gradient adds depth without visually overloading the space.

-   **Unshakeable stability (rubber base):** no more pad sliding mid-action. The **textured natural rubber base** delivers full grip on wood, glass or plastic. It stays anchored, even during fast mouse movements.

-   **Optimized glide surface:** the smooth fabric coating allows precise tracking (optical or laser), striking the perfect balance between speed and control.

-   **Reinforced durability:** edges have **stitched seams** (anti-fraying). That ensures a long lifespan and prevents the surface from peeling over time.

-   **Sizes for every need:** available in standard size for the mouse only or in **extended XXL** to fit your keyboard and protect the entire desk.


### **Tech specs:**

-   **Material:** micro-woven cloth surface / high-density **non-slip rubber** base.

-   **Color:** black, white, grey (monochrome).

-   **Thickness:** wrist-friendly 2 mm.

-   **Care:** water-resistant and easy to clean.


### **Sizes available:**

-   **35 x 45 cm (14 x 18 in):** generous standard format, ideal for FPS gaming.

-   **40 x 60 cm (16 x 24 in):** versatile mid-size.

-   **40 x 90 cm (XXL - 16 x 35 in):** the ultimate "deskmat" format. Covers the full keyboard + mouse area for total immersion.`,
    de: `## **Bring eine Prise Ruhe und Präzision in deinen Arbeitsbereich.**

Verwandle deinen Schreibtisch in einen Ort der Inspiration mit unserem **Mauspad**. Es verbindet minimalistische japanische Ästhetik mit technischer Leistung - dieses Deskmat ist für anspruchsvolle Gamer wie für Homeoffice-Profis konzipiert.

Sein monochromes Schwarz-Weiß-Design, das den berühmten japanischen Gipfel zeigt, der aus dem Nebel auftaucht, passt perfekt zu jedem **Gaming-Setup** oder modernen Schreibtisch.

## **Warum dieses Deskmat wählen?**

-   **Zen-Design & Eleganz:** Der HD-Druck des Mount Fuji erzeugt eine beruhigende, klare Atmosphäre. Der Grauverlauf bringt Tiefe, ohne den Raum visuell zu überladen.

-   **Unerschütterliche Stabilität (Gummibasis):** Schluss mit dem Pad, das mitten in der Aktion verrutscht. Die **texturierte Naturgummi-Basis** garantiert vollen Halt auf Holz, Glas oder Kunststoff. Es bleibt verankert, auch bei schnellsten Mausbewegungen.

-   **Optimierte Gleitfläche:** Die glatte Stoffoberfläche ermöglicht präzises Tracking (optisch oder Laser), perfekt ausbalanciert zwischen Speed und Control.

-   **Verstärkte Haltbarkeit:** Die Ränder sind mit **vernähten Anti-Ausfransen-Nähten** versehen. Das garantiert eine lange Lebensdauer und verhindert, dass sich die Oberfläche mit der Zeit ablöst.

-   **Größen für jeden Bedarf:** Verfügbar in Standardgröße nur für die Maus oder im **XXL-Format**, um auch die Tastatur abzudecken und den gesamten Schreibtisch zu schützen.


### **Technische Daten:**

-   **Material:** mikro-gewebte Stoffoberfläche / hochdichte **rutschfeste Gummibasis**.

-   **Farbe:** Schwarz, Weiß, Grau (monochrom).

-   **Dicke:** handgelenkfreundliche 2 mm.

-   **Pflege:** wasserfest und leicht zu reinigen.


### **Verfügbare Größen:**

-   **35 x 45 cm:** großzügiges Standardformat, ideal für FPS-Gaming.

-   **40 x 60 cm:** vielseitiges mittleres Format.

-   **40 x 90 cm (XXL):** das ultimative "Deskmat"-Format. Deckt den gesamten Tastatur- + Mausbereich ab für totale Immersion.`,
  },
  'tapis-de-souris-myosotis': {
    en: `Small blue flowers on a soft, calming background - Myosotis is a **minimalist floral office mouse pad** for lo-fi setups, remote-work spaces and desks that want a touch of nature without overdoing it. Discreet, elegant, timeless.

High-density micro-woven cloth, non-slip rubber base, anti-fraying stitched edges. Available in Standard (45x35 cm / 18x14 in), Large (60x40 cm / 24x16 in) and XXL deskmat (90x40 cm / 35x16 in).`,
    de: `Kleine blaue Blumen auf sanftem, beruhigendem Hintergrund - Myosotis ist ein **minimalistisches florales Büro-Mauspad** für Lo-Fi-Setups, Homeoffice-Bereiche und Schreibtische, die einen Hauch Natur wollen, ohne zu übertreiben. Dezent, elegant, zeitlos.

Hochdichter mikro-gewebter Stoff, rutschfeste Gummibasis, vernähte Anti-Ausfransen-Ränder. Verfügbar in Standard (45x35 cm), Large (60x40 cm) und XXL Deskmat (90x40 cm).`,
  },
  'tapis-de-souris-new-chapter': {
    en: `A luminous feminine silhouette in a pastel universe - this **aesthetic office mouse pad** brings a soft, inspiring touch to your setup. High-density cloth, non-slip base, stitched edges. Standard, Large and XXL formats available.`,
    de: `Eine leuchtende weibliche Silhouette in einem pastellfarbenen Universum - dieses **ästhetische Büro-Mauspad** bringt eine sanfte, inspirierende Note in dein Setup. Hochdichter Stoff, rutschfeste Basis, vernähte Ränder. Standard, Large und XXL verfügbar.`,
  },
  'tapis-de-souris-noir-silex': {
    en: `## **Bring mineral strength and absolute precision to your workspace.**

Turn your desk into a place of inspiration with the **Black Flint Mouse Pad**. Combining raw aesthetics and technical performance, this deskmat is built for demanding gamers and professionals chasing elegance.

Its monochrome design, evoking the deep texture of carved flint and the soberness of volcanic rock, fits any minimalist gaming setup or modern desk perfectly.

## Why choose Black Flint?

-   **Mineral & elegant design:** the high-definition print captures shades of black and graphite grey, creating a soothing atmosphere without visually overloading the space. The textured look adds unique depth to your desk.

-   **Unshakeable stability (rubber base):** no more pad sliding mid-action. The textured natural rubber base delivers full grip on wood, glass or plastic. It stays anchored, even during ultra-fast mouse movements.

-   **Optimized glide surface:** the smooth micro-woven cloth coating allows precise tracking (optical or laser), striking the perfect balance between **Speed** and **Control**.

-   **Reinforced durability:** edges have stitched anti-fraying seams. That ensures exceptional longevity and prevents the surface from peeling over time.

-   **Sizes for every need:** available in standard size for the mouse or in extended XXL to fit your keyboard and protect the whole work surface.


## Tech specs:

-   **Material:** technical cloth surface / high-density non-slip rubber base.

-   **Color:** Black Flint (shades of grey and deep black).

-   **Thickness:** 2 mm (slim profile for optimal wrist comfort).

-   **Care:** water-resistant and easy to clean.


## Sizes available:

-   **35 x 45 cm:** generous standard format, ideal for FPS gaming.

-   **40 x 60 cm:** versatile mid-size.

-   **40 x 90 cm (XXL):** the ultimate "deskmat" format. Covers the full keyboard + mouse area for total immersion.`,
    de: `## **Bring mineralische Kraft und absolute Präzision in deinen Arbeitsbereich.**

Verwandle deinen Schreibtisch in einen Ort der Inspiration mit dem **Mauspad Schwarzer Feuerstein**. Es verbindet rohe Ästhetik mit technischer Leistung - dieses Deskmat ist für anspruchsvolle Gamer wie für eleganzsuchende Profis konzipiert.

Sein monochromes Design, das die tiefe Textur des geschlagenen Feuersteins und die Schlichtheit von Vulkangestein heraufbeschwört, passt perfekt zu jedem minimalistischen Gaming-Setup oder modernen Schreibtisch.

## Warum Schwarzer Feuerstein wählen?

-   **Mineralisches & elegantes Design:** Der HD-Druck fängt Schattierungen von Schwarz und Graphitgrau ein und schafft eine beruhigende Atmosphäre, ohne den Raum visuell zu überladen. Die texturierte Optik bringt einzigartige Tiefe in deinen Schreibtisch.

-   **Unerschütterliche Stabilität (Gummibasis):** Schluss mit dem Pad, das mitten in der Aktion verrutscht. Die texturierte Naturgummi-Basis garantiert vollen Halt auf Holz, Glas oder Kunststoff. Es bleibt verankert, auch bei ultra-schnellen Mausbewegungen.

-   **Optimierte Gleitfläche:** Die glatte mikro-gewebte Stoffoberfläche ermöglicht präzises Tracking (optisch oder Laser), perfekt ausbalanciert zwischen **Speed** und **Control**.

-   **Verstärkte Haltbarkeit:** Die Ränder haben vernähte Anti-Ausfransen-Nähte. Das garantiert eine außergewöhnliche Lebensdauer und verhindert, dass sich die Oberfläche mit der Zeit ablöst.

-   **Größen für jeden Bedarf:** Verfügbar in Standardgröße für die Maus oder im XXL-Format, um auch die Tastatur abzudecken und den gesamten Arbeitsbereich zu schützen.


## Technische Daten:

-   **Material:** technische Stoffoberfläche / hochdichte rutschfeste Gummibasis.

-   **Farbe:** Schwarzer Feuerstein (Grau- und Tiefschwarztöne).

-   **Dicke:** 2 mm (schmales Profil für optimalen Handgelenkkomfort).

-   **Pflege:** wasserfest und leicht zu reinigen.


## Verfügbare Größen:

-   **35 x 45 cm:** großzügiges Standardformat, ideal für FPS-Gaming.

-   **40 x 60 cm:** vielseitiges mittleres Format.

-   **40 x 90 cm (XXL):** das ultimative "Deskmat"-Format. Deckt den gesamten Tastatur- + Mausbereich ab für totale Immersion.`,
  },
  'tapis-de-souris-paysage-fantastique': {
    en: `A contemplative hero facing a vast fantasy landscape at sunrise - this **fantasy landscape XXL gaming mouse pad** gives your desk an adventurous, escapist atmosphere. High-density cloth, non-slip rubber base, stitched edges. Standard, Large and XXL.`,
    de: `Ein nachdenklicher Held vor einer weitläufigen Fantasie-Landschaft im Sonnenaufgang - dieses **Fantasy-Landschaft XXL Gaming Mauspad** bringt eine abenteuerliche und entrückte Stimmung auf deinen Schreibtisch. Hochdichter Stoff, rutschfeste Gummibasis, vernähte Ränder. Standard, Large und XXL.`,
  },
  'tapis-de-souris-personnalise': {
    en: `### Custom mouse pad, printed with your image

Create a unique **ergonomic custom mouse pad** by uploading your photo, logo or design. This **personalized made-to-order mouse pad** is ideal to customize your desk, improve your work comfort, or give a useful and original gift.

Its smooth high-precision surface delivers fluid glide and optimal tracking for every optical and laser mouse. The non-slip base guarantees perfect stability on the desk, even during long use.

The **high-definition print** delivers crisp output with accurate, durable colors. For best results, upload a high-quality, non-pixelated, well-resolved image to get a professional, premium look on your custom mouse pad.

This **ergonomic custom mouse pad with photo or logo** is suited to personal as well as professional use, and makes an excellent gift idea for a birthday, a company or an event.`,
    de: `### Personalisiertes Mauspad, mit deinem Bild bedruckt

Erstelle ein einzigartiges **ergonomisches personalisiertes Mauspad**, indem du dein Foto, Logo oder Design hochlädst. Dieses **maßgefertigte Mauspad** ist ideal, um deinen Schreibtisch zu personalisieren, deinen Arbeitskomfort zu verbessern oder ein nützliches und originelles Geschenk zu machen.

Seine glatte, hochpräzise Oberfläche liefert flüssiges Gleiten und optimales Tracking für jede optische und Laser-Maus. Die rutschfeste Basis garantiert perfekte Stabilität auf dem Schreibtisch, auch bei langer Nutzung.

Der **HD-Druck** liefert ein scharfes Ergebnis mit naturgetreuen, langlebigen Farben. Für ein optimales Ergebnis lade ein hochwertiges, nicht verpixeltes, gut aufgelöstes Bild hoch, um eine professionelle, hochwertige Optik auf deinem personalisierten Mauspad zu erzielen.

Dieses **ergonomische personalisierte Mauspad mit Foto oder Logo** eignet sich sowohl für den privaten als auch für den beruflichen Einsatz und ist eine ausgezeichnete Geschenkidee für einen Geburtstag, ein Unternehmen oder ein Event.`,
  },
  'tapis-de-souris-pixel-ninja': {
    en: `A pixel art ninja against a Mount Fuji background in grey gradient - this **minimalist Japanese gaming mouse pad** brings a zen, refined atmosphere to your setup. Micro-woven cloth, non-slip rubber base, stitched edges. Standard, Large and XXL.`,
    de: `Ein Pixel-Art-Ninja vor einem Mount-Fuji-Hintergrund im Grauverlauf - dieses **minimalistische japanische Gaming Mauspad** bringt eine zen-artige, klare Atmosphäre in dein Setup. Mikro-gewebter Stoff, rutschfeste Gummibasis, vernähte Ränder. Standard, Large und XXL.`,
  },
  'tapis-de-souris-prismatique': {
    en: `An explosion of spectral colors for a **colorful XXL gaming deskmat** that makes your setup stand out. High-density micro-woven cloth, non-slip rubber base, stitched edges. Available in Standard, Large and XXL.`,
    de: `Eine Explosion spektraler Farben für ein **buntes XXL Gaming Deskmat**, das dein Setup aus der Masse hebt. Hochdichter mikro-gewebter Stoff, rutschfeste Gummibasis, vernähte Ränder. In Standard, Large und XXL verfügbar.`,
  },
  'tapis-de-souris-repos-du-chevalier': {
    en: `A lone knight surrounded by nature - Knight's Rest is a **fantasy XXL and Standard gaming mouse pad** that mixes poetry and warrior energy for a truly out-of-the-ordinary desk. The contrast between the warrior's brutality and the softness of the flowers makes for a one-of-a-kind design. High-density micro-woven precision surface for optimal mouse tracking. Non-slip rubber base to stay stable no matter how intense the session. Stitched edges for a clean, durable finish.`,
    de: `Ein einsamer Ritter umgeben von Natur - Ruhe des Ritters ist ein **Fantasy XXL und Standard Gaming Mauspad**, das Poesie und Kriegerwelt verbindet, für einen wirklich außergewöhnlichen Schreibtisch. Der Kontrast zwischen der Brutalität des Kämpfers und der Sanftheit der Blumen macht das Design einzigartig. Hochdichte mikro-gewebte Präzisionsoberfläche für optimales Maustracking. Rutschfeste Gummibasis bleibt stabil, egal wie intensiv die Session. Vernähte Ränder für ein sauberes, langlebiges Finish.`,
  },
  'tapis-de-souris-reve-astral': {
    en: `Stars, mist and an enchanting night sky - this **anime-aesthetic Japanese mouse pad** brings a dreamy, timeless atmosphere to your desk. Micro-woven cloth, rubber base, stitched edges. Standard, Large or XXL.`,
    de: `Sterne, Nebel und ein bezaubernder Nachthimmel - dieses **anime-ästhetische japanische Mauspad** bringt eine traumhafte, zeitlose Stimmung auf deinen Schreibtisch. Mikro-gewebter Stoff, Gummibasis, vernähte Ränder. Standard, Large oder XXL.`,
  },
  'tapis-de-souris-sakura': {
    en: `A flowery path beneath cherry blossoms in bloom - this **Japanese sakura deskmat** turns your desk into a serene spring landscape. Ideal for a lo-fi, gaming or remote-work setup. Micro-woven cloth, non-slip base, stitched edges. Standard, Large and XXL.`,
    de: `Ein blühender Weg unter Kirschblüten - dieses **japanische Sakura Deskmat** verwandelt deinen Schreibtisch in eine friedliche Frühlingslandschaft. Ideal für ein Lo-Fi-, Gaming- oder Homeoffice-Setup. Mikro-gewebter Stoff, rutschfeste Basis, vernähte Ränder. Standard, Large und XXL.`,
  },
  'tapis-de-souris-samourai-papillons-bleus': {
    en: `A katana-wielding warrior surrounded by glowing blue butterflies - this **samurai anime gaming mouse pad** is one of BuddyPad's most iconic designs. Micro-woven cloth, non-slip rubber base, stitched edges. Standard, Large and XXL.`,
    de: `Eine Kriegerin mit Katana, umgeben von leuchtend blauen Schmetterlingen - dieses **Samurai Anime Gaming Mauspad** ist eines der ikonischsten Designs von BuddyPad. Mikro-gewebter Stoff, rutschfeste Gummibasis, vernähte Ränder. Standard, Large und XXL.`,
  },
  'tapis-de-souris-samurai-nuit-etoilee': {
    en: `Turn your desk into an epic backdrop with this **starry-night samurai mouse pad**, inspired by the dark and poetic universe of Ghost of Tsushima. A striking Japanese night landscape that dresses your setup with a unique atmosphere - somewhere between honor and mystery.

## Why pick this BuddyPad samurai mouse pad?

-   **Immersive samurai design:** Ghost-of-Tsushima-style starry-night illustration, high-definition print with deep, contrasted colors.
-   **Optimized glide surface:** micro-woven cloth compatible with every optical and laser sensor, balanced between speed and control.
-   **Non-slip rubber base:** maximum grip on wood, glass or plastic, even during the fastest movements.
-   **Reinforced stitched edges:** anti-fraying stitching for long-term durability.
-   **3 sizes available:** from standard to XXL to cover the whole desk.

## Tech specs

-   **Material:** micro-woven cloth surface / high-density non-slip rubber base
-   **Care:** hand wash with lukewarm water, dry flat in open air

## Sizes available

-   **35 x 45 cm:** standard size, ideal for the mouse alone.
-   **40 x 60 cm:** mid size, comfortably fits keyboard and mouse.
-   **40 x 90 cm (XXL):** the ultimate deskmat, covers the full keyboard + mouse area.`,
    de: `Verwandle deinen Schreibtisch in eine epische Kulisse mit diesem **Samurai Sternennacht Mauspad**, inspiriert vom düsteren und poetischen Universum von Ghost of Tsushima. Eine ergreifende japanische Nachtlandschaft, die dein Setup mit einer einzigartigen Atmosphäre einhüllt - irgendwo zwischen Ehre und Mysterium.

## Warum dieses BuddyPad Samurai Mauspad wählen?

-   **Immersives Samurai-Design:** Sternennacht-Illustration im Ghost-of-Tsushima-Stil, HD-Druck mit tiefen, kontrastreichen Farben.
-   **Optimierte Gleitfläche:** mikro-gewebter Stoff, kompatibel mit allen optischen und Laser-Sensoren, ausgewogen zwischen Speed und Control.
-   **Rutschfeste Gummibasis:** maximaler Halt auf Holz, Glas oder Kunststoff, auch bei schnellsten Bewegungen.
-   **Verstärkte vernähte Ränder:** Anti-Ausfransen-Naht für lange Haltbarkeit.
-   **3 Größen verfügbar:** vom Standardformat bis XXL, um den ganzen Schreibtisch abzudecken.

## Technische Daten

-   **Material:** mikro-gewebte Stoffoberfläche / hochdichte rutschfeste Gummibasis
-   **Pflege:** Handwäsche mit lauwarmem Wasser, flach an der Luft trocknen

## Verfügbare Größen

-   **35 x 45 cm:** Standardformat, ideal nur für die Maus.
-   **40 x 60 cm:** mittleres Format, Tastatur und Maus haben bequem Platz.
-   **40 x 90 cm (XXL):** das ultimative Deskmat, deckt den gesamten Tastatur- und Mausbereich ab.`,
  },
  'tapis-de-souris-seigneur-des-ombres': {
    en: `A dark knight rises from the shadows on this **dark fantasy XXL gaming mouse pad** by **BuddyPad**. The dark, cinematic design installs an epic, immersive vibe on your gaming setup, whether you play or you stream. High-density micro-woven surface for precise tracking with your optical or laser mouse. Non-slip rubber base that stays anchored even during the most intense session. Anti-fraying stitched edges for maximum lifespan.`,
    de: `Ein Ritter der Finsternis steigt aus dem Schatten auf diesem **Dark Fantasy XXL Gaming Mauspad** von **BuddyPad**. Das düstere, cinematische Design legt eine epische, immersive Atmosphäre auf dein Gaming-Setup, egal ob du spielst oder streamst. Hochdichte mikro-gewebte Oberfläche für präzises Tracking mit deiner optischen oder Laser-Maus. Rutschfeste Gummibasis, die auch bei den intensivsten Sessions verankert bleibt. Vernähte Anti-Ausfransen-Ränder für maximale Lebensdauer.`,
  },
  'tapis-de-souris-simili-cuir': {
    en: `**Combine protection, comfort and elegance for your workspace.**

This high-quality PU faux-leather desk mat is the must-have accessory to modernize your setup. Designed to replace traditional mouse pads, it offers a generous surface that protects your furniture while improving your daily work comfort.

**Tech specs and benefits:**

-   **Reinforced stability (Suede base):** unlike standard pads that slide, this model is fitted with a suede-textured back. This specific design boosts friction by 70%, ensuring the pad stays perfectly in place on your desk.

-   **Full protection:** the durable synthetic-leather surface acts as an effective barrier against scratches, scuffs, stains and the heat from computers or hot mugs.

-   **Versatile 2-in-1 surface:** the smooth texture is optimized for precise mouse glide and also serves as a comfortable handwriting support, reducing wrist fatigue.

-   **Easy and quick care:** fully waterproof, the surface fears neither water nor oil stains. A wipe with a damp cloth is all it takes to bring it back to new.

-   **Sized to fit:** available in several dimensions (45x35 cm, 60x40 cm, 90x40 cm) to perfectly fit your desk, from a small workspace to a full big setup.


**A desk that always looks sharp.** No more tiny mouse pads that limit your movements. Pick a wide, clean and professional solution that showcases your equipment.`,
    de: `**Verbinde Schutz, Komfort und Eleganz für deinen Arbeitsbereich.**

Dieses hochwertige Schreibtischunterlage aus PU-Kunstleder ist das unverzichtbare Accessoire, um dein Setup zu modernisieren. Konzipiert, um traditionelle Mauspads zu ersetzen, bietet es eine großzügige Oberfläche, die deine Möbel schützt und gleichzeitig deinen täglichen Arbeitskomfort verbessert.

**Technische Daten und Vorteile:**

-   **Verstärkte Stabilität (Suede-Basis):** Anders als Standard-Pads, die rutschen, ist dieses Modell mit einer Wildleder-Textur (Suede) ausgestattet. Diese spezielle Konzeption erhöht die Reibung um 70 % und garantiert, dass das Pad perfekt auf deinem Schreibtisch hält.

-   **Vollständiger Schutz:** Die langlebige Kunstleder-Oberfläche wirkt als effektive Barriere gegen Kratzer, Schrammen, Flecken und die Hitze von Computern oder heißen Tassen.

-   **Vielseitige 2-in-1 Oberfläche:** Die glatte Textur ist auf präzises Mausgleiten optimiert und dient gleichzeitig als komfortable Schreibunterlage, was die Handgelenkermüdung reduziert.

-   **Einfache und schnelle Pflege:** Vollständig wasserdicht - die Oberfläche fürchtet weder Wasser noch Ölflecken. Ein Wischen mit einem feuchten Tuch genügt, um es wie neu aussehen zu lassen.

-   **Passende Größen:** In mehreren Abmessungen verfügbar (45x35 cm, 60x40 cm, 90x40 cm), um perfekt zur Größe deines Schreibtisches zu passen, vom kleinen Arbeitsplatz bis zum großen Komplett-Setup.


**Ein Schreibtisch, der immer makellos aussieht.** Schluss mit winzigen Mauspads, die deine Bewegungen einschränken. Wähl eine breite, saubere und professionelle Lösung, die deine Ausrüstung in Szene setzt.`,
  },
  'tapis-de-souris-train-paysage-luxuriant': {
    en: `Step aboard for an immersive, fantastic journey with this **mouse pad** featuring a lush landscape seen from a train, inhabited by a cat and a mysterious creature. A detail-rich illustration that turns your desk into a window onto an imaginary world.

High-density micro-woven surface, optimized for precise tracking with every optical and laser mouse. Thick non-slip rubber base for total stability. Reinforced stitched edges to prevent fraying for long-term durability.`,
    de: `Steig ein für eine immersive, fantastische Reise mit diesem **Mauspad**, das eine üppige Landschaft aus einem Zug zeigt, bewohnt von einer Katze und einer geheimnisvollen Kreatur. Eine detailreiche Illustration, die deinen Schreibtisch in ein Fenster auf eine imaginäre Welt verwandelt.

Hochdichte mikro-gewebte Oberfläche, optimiert für präzises Tracking mit jeder optischen und Laser-Maus. Dicke rutschfeste Gummibasis für totale Stabilität. Verstärkte vernähte Ränder gegen Ausfransen für maximale Haltbarkeit.`,
  },
  'tapis-de-souris-trust-the-process': {
    en: `Trust the Process - a **motivational gaming setup mouse pad** that reminds you every day to stay focused. The design features a determined woman, perfect for a work desk, a streaming setup or a space where productivity meets character.

High-density micro-woven cloth, non-slip rubber base, anti-fraying stitched edges. Available in Standard (45x35 cm / 18x14 in), Large (60x40 cm / 24x16 in) and XXL (90x40 cm / 35x16 in).`,
    de: `Trust the Process - ein **motivierendes Gaming-Setup-Mauspad**, das dich jeden Tag daran erinnert, fokussiert zu bleiben. Das Design zeigt eine entschlossene Frau, ideal für einen Arbeits-Schreibtisch, ein Streaming-Setup oder einen Bereich, in dem Produktivität auf Charakter trifft.

Hochdichter mikro-gewebter Stoff, rutschfeste Gummibasis, vernähte Anti-Ausfransen-Ränder. Verfügbar in Standard (45x35 cm), Large (60x40 cm) und XXL (90x40 cm).`,
  },
  'tapis-de-souris-yami-karasu': {
    en: `A black raven spreads its wings against a violet mist - Yami Karasu is a **gaming manga mouse pad** that drops your desk into the mystical world of feudal Japan. Yami (闇) means "darkness" - the perfect name for this design that's both elegant and intense. High-density micro-woven surface, optimized for precise tracking with every optical and laser gaming mouse. Thick non-slip rubber base for total stability. Reinforced stitched edges to prevent fraying.`,
    de: `Ein schwarzer Rabe breitet seine Flügel vor violettem Nebel aus - Yami Karasu ist ein **Manga Gaming Mauspad**, das deinen Schreibtisch in die mystische Welt des feudalen Japans eintauchen lässt. Yami (闇) bedeutet "Dunkelheit" - der perfekte Name für dieses Design, das gleichermaßen elegant und intensiv ist. Hochdichte mikro-gewebte Oberfläche, optimiert für präzises Tracking mit jeder optischen und Laser-Gaming-Maus. Dicke rutschfeste Gummibasis für totale Stabilität. Verstärkte vernähte Ränder gegen Ausfransen.`,
  },
};

// Apply
let written = 0, skipped = 0;
const todoRegex = /<!-- TODO i18n:(en|de) - body in FR, please translate -->\s*\n[\s\S]*$/;

for (const [slug, t] of Object.entries(T)) {
  for (const lang of ['en', 'de']) {
    const filePath = path.join(PROD, lang, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ missing : ${filePath}`);
      continue;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.includes('TODO i18n:')) {
      skipped++;
      continue;
    }
    const newRaw = raw.replace(todoRegex, t[lang].trim() + '\n');
    fs.writeFileSync(filePath, newRaw, 'utf8');
    written++;
  }
}

console.log(`✅ ${written} body translated, ⊙ ${skipped} skipped (already done)`);
