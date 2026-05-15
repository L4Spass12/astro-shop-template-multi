/**
 * ============================================================
 *  Convertisseur WP posts → Astro Markdown
 *
 *  Lit import/posts.json + import/image-map.json + import/categories.json
 *  Génère src/content/blog/{slug}.md pour chaque post publié.
 *
 *  Features :
 *   - HTML → Markdown via turndown (avec règles custom pour WP blocks)
 *   - Remap des URLs d'images WP vers chemins locaux
 *   - Mapping category ID → nom + slug
 *   - Extraction de la meta description (excerpt si dispo)
 *   - Détection basique de FAQ (h2/h3 avec "?" + paragraphe)
 *
 *  Usage : node scripts/convert-posts.mjs
 * ============================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const IMPORT = path.join(root, 'import');
const OUT = path.join(root, 'src', 'content', 'blog');

// ───────── Load data ─────────
const posts = JSON.parse(fs.readFileSync(path.join(IMPORT, 'posts.json'), 'utf8'));
const cats = JSON.parse(fs.readFileSync(path.join(IMPORT, 'categories.json'), 'utf8'));
const imageMap = JSON.parse(fs.readFileSync(path.join(IMPORT, 'image-map.json'), 'utf8'));

// ───────── Category map (id → {name, slug}) ─────────
const catById = {};
for (const c of cats) {
  if (c.slug === 'uncategorized') continue;
  catById[c.id] = {
    name: c.name
      .replace(/&amp;/g, '&')
      .replace(/&#8217;|&rsquo;/g, "'")
      .replace(/&#8216;|&lsquo;/g, "'")
      .replace(/&quot;/g, '"'),
    slug: c.slug,
  };
}

// ───────── Turndown config ─────────
const td = new TurndownService({
  headingStyle: 'atx',          // # Heading
  codeBlockStyle: 'fenced',      // ``` blocks
  bulletListMarker: '-',
  emDelimiter: '_',
  strongDelimiter: '**',
  linkStyle: 'inlined',
});

// Préserver les figures avec caption
td.addRule('figure', {
  filter: 'figure',
  replacement: function (content, node) {
    const img = node.querySelector('img');
    const caption = node.querySelector('figcaption');
    if (!img) return content;
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const title = img.getAttribute('title') || '';
    const mapped = imageMap[src] || src;
    const c = caption ? caption.textContent.trim() : '';
    if (c) {
      return `\n\n<figure>\n<img src="${mapped}" alt="${alt}" title="${title}" loading="lazy" />\n<figcaption>${c}</figcaption>\n</figure>\n\n`;
    }
    return `\n\n![${alt}](${mapped}${title ? ` "${title}"` : ''})\n\n`;
  },
});

// Remapper TOUTES les images (incluses dans les <img> hors <figure>)
td.addRule('img-remap', {
  filter: 'img',
  replacement: function (content, node) {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';
    const title = node.getAttribute('title') || '';
    const mapped = imageMap[src] || src;
    return `![${alt}](${mapped}${title ? ` "${title}"` : ''})`;
  },
});

// Supprimer les <style> et <script> inline
td.remove(['style', 'script']);

// ───────── Helpers ─────────
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ');
}

function yamlEscape(s) {
  if (s == null) return '""';
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
}

function extractDescription(post) {
  // Priorité : excerpt rendered → premier paragraphe content → fallback
  if (post.excerpt?.rendered) {
    const txt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim();
    if (txt) return decodeEntities(txt).slice(0, 200).trim();
  }
  const content = post.content?.rendered || '';
  const pMatch = content.match(/<p[^>]*>(.*?)<\/p>/s);
  if (pMatch) {
    const txt = pMatch[1].replace(/<[^>]+>/g, '').trim();
    if (txt) return decodeEntities(txt).slice(0, 200).trim();
  }
  return decodeEntities(post.title.rendered);
}

function detectFaq(markdown) {
  // Chercher un pattern ## FAQ / ## Questions fréquentes / ## Q&R suivi de h3 en question
  const faqSection = markdown.match(/## (?:FAQ|Questions? (?:fréquentes?|courantes?)|Q&R|Questions?)\s*\n\s*([\s\S]*?)(?=\n##\s|\n---|$)/i);
  if (!faqSection) return null;
  const body = faqSection[1];
  const faqs = [];
  // Pattern : ### Question?  \n paragraphe
  const re = /###\s+(.+?\?)\s*\n\s*([\s\S]+?)(?=\n###\s|\n##\s|$)/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const q = m[1].trim();
    const a = m[2].trim().replace(/\n{2,}/g, ' ').replace(/\n/g, ' ');
    if (q && a) faqs.push({ q, a });
  }
  return faqs.length ? faqs : null;
}

// ───────── Main loop ─────────
// Nettoyer l'ancien contenu seed
console.log('🗑  Suppression des posts seed…');
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith('.md')) fs.unlinkSync(path.join(OUT, f));
}

console.log(`\n📝 Conversion de ${posts.length} posts WP → Astro Markdown…\n`);
let written = 0, skipped = 0;

for (const p of posts) {
  if (p.status !== 'publish') { skipped++; continue; }
  if (p.type !== 'post') { skipped++; continue; }

  const slug = p.slug;
  const title = decodeEntities(p.title.rendered);
  const description = extractDescription(p);
  const pubDate = p.date ? p.date.slice(0, 10) : '2026-01-01';
  const updatedDate = p.modified && p.modified !== p.date ? p.modified.slice(0, 10) : null;

  // Category : priorité aux catégories spécifiques quand un post en a plusieurs.
  // Ordre : Gaming (111) > Bureau & Setup (113) > Guide d'achat (112, fourre-tout)
  const CAT_PRIORITY = [111, 113, 112];
  const catIds = (p.categories || []).filter(id => catById[id]);
  catIds.sort((a, b) => {
    const ia = CAT_PRIORITY.indexOf(a); const ib = CAT_PRIORITY.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
  const category = catIds.length ? catById[catIds[0]] : null;
  if (!category) {
    console.warn(`  ⚠ ${slug} : pas de catégorie valide, skip`);
    skipped++;
    continue;
  }

  // Image featured
  const featuredUrl = p.jetpack_featured_media_url;
  const imagePath = featuredUrl ? imageMap[featuredUrl] : null;

  // Convert HTML → Markdown
  let body = td.turndown(p.content.rendered);
  // Cleanup : espaces multiples, lignes vides en série
  body = body
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();

  // FAQ extraction
  const faq = detectFaq(body);

  // Frontmatter
  const fm = [];
  fm.push('---');
  fm.push(`title: ${yamlEscape(title)}`);
  fm.push(`description: ${yamlEscape(description)}`);
  fm.push(`pubDate: ${pubDate}`);
  if (updatedDate) fm.push(`updatedDate: ${updatedDate}`);
  fm.push(`author: "Équipe BuddyPad"`);
  fm.push(`category: ${yamlEscape(category.name)}`);
  if (imagePath) {
    fm.push(`image: "${imagePath}"`);
    fm.push(`imageAlt: ${yamlEscape(title)}`);
  }
  if (faq && faq.length) {
    fm.push('faq:');
    for (const item of faq) {
      fm.push(`  - q: ${yamlEscape(item.q)}`);
      fm.push(`    a: ${yamlEscape(item.a)}`);
    }
  }
  fm.push('---');

  const out = fm.join('\n') + '\n\n' + body + '\n';
  fs.writeFileSync(path.join(OUT, `${slug}.md`), out);
  written++;
  const faqInfo = faq ? ` (+${faq.length} FAQ)` : '';
  console.log(`  ✓ ${slug}  [${category.name}]${faqInfo}`);
}

console.log(`\n✅ ${written} posts écrits, ${skipped} skipped`);

// Liste les catégories utilisées (pour mise à jour site.config.mjs)
const usedCats = new Set();
for (const p of posts) {
  if (p.status !== 'publish' || p.type !== 'post') continue;
  const catIds = (p.categories || []).filter(id => catById[id]);
  if (catIds.length) usedCats.add(catById[catIds[0]].name);
}
console.log('\n📋 Catégories utilisées (à reporter dans site.config.mjs):');
for (const c of usedCats) console.log(`  - "${c}"`);
