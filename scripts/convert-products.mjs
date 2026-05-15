/**
 * ============================================================
 *  Convertisseur WP products → Astro Markdown
 *
 *  Lit import/products-full.json (avec variations scrapées)
 *       import/image-map.json
 *
 *  Génère src/content/products/{slug}.md pour chaque produit publié,
 *  avec :
 *   - frontmatter complet (prix, compareAtPrice, priceRange, gallery,
 *     attributs, variations complètes avec combinaisons)
 *   - description HTML → Markdown (images remappées)
 *
 *  Usage : node scripts/convert-products.mjs
 * ============================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const IMPORT = path.join(root, 'import');
const OUT = path.join(root, 'src', 'content', 'products');
fs.mkdirSync(OUT, { recursive: true });

const products = JSON.parse(fs.readFileSync(path.join(IMPORT, 'products-full.json'), 'utf8'));
const imageMap = JSON.parse(fs.readFileSync(path.join(IMPORT, 'image-map.json'), 'utf8'));

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  strongDelimiter: '**',
  linkStyle: 'inlined',
});

td.addRule('img-remap', {
  filter: 'img',
  replacement: function (content, node) {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';
    const mapped = imageMap[src] || src;
    return `![${alt}](${mapped})`;
  },
});

td.remove(['style', 'script']);

function decodeEntities(s) {
  return (s || '')
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

// Nettoyer ancien seed
console.log('🗑  Suppression des produits seed…');
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith('.md')) fs.unlinkSync(path.join(OUT, f));
}

console.log(`\n🛍  Conversion de ${products.length} produits…\n`);
let written = 0;

for (const p of products) {
  const slug = p.slug;
  const name = decodeEntities(p.name);
  const pubDate = p.date_created ? p.date_created.slice(0, 10) : '2026-01-01';
  const updatedDate = p.date_modified && p.date_modified !== p.date_created ? p.date_modified.slice(0, 10) : null;

  // Gallery : toutes les images du parent (mappées local)
  const gallery = (p.images || []).map(img => imageMap[img.src] || img.src);
  const mainImage = gallery[0] || '';

  // Short description
  const shortDesc = decodeEntities((p.short_description || '').replace(/<[^>]+>/g, '').trim()).slice(0, 240);

  // Categories : slugs WP directement (pour matcher /product-category/<slug>/)
  const categorySlugs = (p.categories || []).map(c => c.slug).filter(s => s && s !== 'uncategorized');

  // Variations : mappe vers notre schema
  const variations = (p.variations_detail || []).map(v => {
    const attrs = {};
    for (const a of v.attributes || []) {
      attrs[a.name] = a.slug;
    }
    const obj = {
      id: v.id,
      price: v.price,
      inStock: v.in_stock !== false,
      attributes: attrs,
    };
    if (v.regular && v.regular > v.price) obj.compareAtPrice = v.regular;
    if (v.sku) obj.sku = v.sku;
    if (v.stock != null) obj.stock = v.stock;
    if (v.image) obj.image = imageMap[v.image] || v.image;
    return obj;
  });

  // Prix affichés sur la fiche & listings
  let price, compareAtPrice, priceRange;
  if (variations.length > 0) {
    const prices = variations.map(v => v.price).filter(Boolean).sort((a, b) => a - b);
    const comps = variations.map(v => v.compareAtPrice || v.price).sort((a, b) => a - b);
    price = prices[0];                                   // prix mini
    if (prices[0] !== prices[prices.length - 1]) {
      priceRange = { min: prices[0], max: prices[prices.length - 1] };
    }
    // compareAtPrice uniquement si toutes les variations ont un prix barré
    const allHaveComp = variations.every(v => v.compareAtPrice);
    if (allHaveComp) compareAtPrice = comps[0]; // le plus bas (pour matcher le prix "dès X €")
  } else {
    price = p.prices?.price || p.prices?.sale || 0;
    compareAtPrice = p.prices?.regular && p.prices.regular > price ? p.prices.regular : null;
  }

  // Attributs normalisés (name + values lisibles)
  const attributes = (p.attributes || [])
    .filter(a => a.has_variations !== false)
    .map(a => ({
      name: a.name,
      values: (a.terms || []).map(t => ({ label: decodeEntities(t.name), slug: t.slug })),
    }));

  // Description longue HTML → Markdown
  let body = td.turndown(p.description || '').trim();
  body = body.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+$/gm, '');

  // Frontmatter
  const fm = [];
  fm.push('---');
  fm.push(`name: ${yamlEscape(name)}`);
  fm.push(`price: ${price}`);
  if (compareAtPrice) fm.push(`compareAtPrice: ${compareAtPrice}`);
  if (priceRange) {
    fm.push(`priceRange:`);
    fm.push(`  min: ${priceRange.min}`);
    fm.push(`  max: ${priceRange.max}`);
  }
  fm.push(`image: "${mainImage}"`);
  fm.push(`imageAlt: ${yamlEscape(name)}`);
  if (gallery.length > 1) {
    fm.push('gallery:');
    for (const g of gallery) fm.push(`  - "${g}"`);
  }
  fm.push('categories:');
  for (const c of categorySlugs) fm.push(`  - "${c}"`);
  fm.push(`shortDescription: ${yamlEscape(shortDesc || name)}`);
  if (p.stock_quantity != null) fm.push(`stock: ${p.stock_quantity}`);
  if (p.sku) fm.push(`sku: "${p.sku}"`);
  fm.push(`pubDate: ${pubDate}`);
  if (updatedDate) fm.push(`updatedDate: ${updatedDate}`);
  if (attributes.length) {
    fm.push('attributes:');
    for (const a of attributes) {
      fm.push(`  - name: ${yamlEscape(a.name)}`);
      fm.push(`    values:`);
      for (const v of a.values) {
        fm.push(`      - label: ${yamlEscape(v.label)}`);
        fm.push(`        slug: "${v.slug}"`);
      }
    }
  }
  if (variations.length) {
    fm.push('variations:');
    for (const v of variations) {
      fm.push(`  - id: ${typeof v.id === 'string' ? yamlEscape(v.id) : v.id}`);
      fm.push(`    price: ${v.price}`);
      if (v.compareAtPrice) fm.push(`    compareAtPrice: ${v.compareAtPrice}`);
      fm.push(`    inStock: ${v.inStock}`);
      if (v.stock != null) fm.push(`    stock: ${v.stock}`);
      if (v.sku) fm.push(`    sku: ${yamlEscape(v.sku)}`);
      if (v.image) fm.push(`    image: ${yamlEscape(v.image)}`);
      fm.push(`    attributes:`);
      for (const [k, val] of Object.entries(v.attributes)) {
        fm.push(`      ${yamlEscape(k)}: "${val}"`);
      }
    }
  }
  fm.push('---');

  const out = fm.join('\n') + '\n\n' + body + '\n';
  fs.writeFileSync(path.join(OUT, `${slug}.md`), out);
  written++;
  const varInfo = variations.length ? ` (${variations.length}var)` : '';
  console.log(`  ✓ ${slug}  ${price.toFixed(2)}€${compareAtPrice ? ` (${compareAtPrice}€ barré)` : ''}${varInfo}`);
}

console.log(`\n✅ ${written} produits écrits`);
