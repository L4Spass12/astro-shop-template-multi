/**
 * Convertit import/product_cat.json (descriptions WP) en fichiers markdown
 * dans src/content/product-categories/<slug>.md.
 *
 * L'intro WP est mise dans le frontmatter `intro`. Le body markdown est
 * vide — à remplir plus tard (guide d'achat H2/H3) ou à générer via IA.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const IN = path.join(root, 'import', 'product_cat.json');
const OUT_DIR = path.join(root, 'src', 'content', 'productCategories');

fs.mkdirSync(OUT_DIR, { recursive: true });

const raw = JSON.parse(fs.readFileSync(IN, 'utf8'));

function decodeEntities(s) {
  return (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(s) {
  return decodeEntities((s || '').replace(/<[^>]+>/g, '')).trim();
}

// Seulement les catégories qu'on expose (pas "uncategorized")
const EXCLUDE = new Set(['uncategorized']);

// siteConfig.productCategories (slugs canoniques + labels jolis)
const knownSlugs = new Set([
  'tapis-de-souris-buddypad-adventure',
  'tapis-de-souris-fantasy',
  'tapis-de-souris-gaming',
  'girl-boss',
  'tapis-de-souris-girly',
  'tapis-de-souris-kawaii',
  'tapis-souris-led-rgb',
  'tapis-souris-led-rgb-charge-sans-fil',
  'tapis-de-souris-manga-anime',
  'tapis-de-souris-minimaliste',
  'tapis-de-souris-xxl',
]);

function yamlEscape(s) {
  // échappe les double quotes pour du YAML string double-quoted
  return (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildKeywords(slug, name) {
  // Keywords de base à partir du slug/name
  const base = [name.toLowerCase()];
  if (slug.includes('kawaii')) base.push('kawaii', 'mignon', 'japonais');
  if (slug.includes('manga-anime')) base.push('manga', 'anime', 'japonais');
  if (slug.includes('gaming') || slug.includes('gamer')) base.push('gaming', 'gamer', 'esport');
  if (slug.includes('xxl')) base.push('xxl', 'grand format', 'large');
  if (slug.includes('girly')) base.push('rose', 'pastel', 'féminin');
  if (slug.includes('girl-boss')) base.push('motivation', 'femme', 'bureau');
  if (slug.includes('fantasy')) base.push('fantaisie', 'dragon', 'médiéval');
  if (slug.includes('adventure')) base.push('aventure', 'voyage', 'nature');
  if (slug.includes('minimaliste')) base.push('minimaliste', 'épuré', 'sobre');
  if (slug.includes('led-rgb')) base.push('rgb', 'led', 'rétroéclairé');
  if (slug.includes('charge-sans-fil')) base.push('qi', 'recharge', 'sans fil');
  return [...new Set(base)];
}

let written = 0;
for (const c of raw) {
  if (!knownSlugs.has(c.slug)) continue;
  if (EXCLUDE.has(c.slug)) continue;

  const name = stripHtml(c.name);
  const intro = stripHtml(c.description);
  const title = `${name} — Notre sélection ${new Date().getFullYear()}`;
  const metaDescription = intro.slice(0, 160);
  const keywords = buildKeywords(c.slug, name);

  const frontmatter = [
    '---',
    `title: "${yamlEscape(title)}"`,
    `metaDescription: "${yamlEscape(metaDescription)}"`,
    `intro: "${yamlEscape(intro)}"`,
    `keywords:`,
    ...keywords.map(k => `  - "${yamlEscape(k)}"`),
    `faq: []`,
    `updatedDate: ${new Date().toISOString().slice(0, 10)}`,
    '---',
    '',
    `<!-- Corps markdown libre : guide d'achat, critères, conseils d'entretien. -->`,
    `<!-- Ce contenu est rendu SOUS la grille produits, au-dessus de la FAQ. -->`,
    '',
  ].join('\n');

  const file = path.join(OUT_DIR, `${c.slug}.md`);
  fs.writeFileSync(file, frontmatter);
  written++;
  console.log(`  ✓ ${c.slug}`);
}

console.log(`\n✅ ${written} catégories écrites dans src/content/product-categories/`);
