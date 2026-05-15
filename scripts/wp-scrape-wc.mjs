/**
 * ============================================================
 *  Scraper WooCommerce Store API → JSON
 *  Enrichit les produits avec :
 *   - prix (actuel, barré, range pour variables)
 *   - galerie d'images
 *   - attributs (taille, couleur, etc.)
 *   - variantes
 *   - catégories produit (avec slugs)
 *
 *  Usage : node scripts/wp-scrape-wc.mjs
 *  Prerequis : import/products.json (via wp-scrape.mjs)
 *  Output : import/products-wc.json (version enrichie)
 * ============================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const IMPORT = path.join(root, 'import');
const BASE = 'https://buddypad.com/wp-json/wc/store/v1/products';

async function fetchAllWC() {
  let all = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${BASE}?per_page=100&page=${page}`);
    if (!res.ok) throw new Error(`WC fetch failed: ${res.status}`);
    const chunk = await res.json();
    if (!chunk.length) break;
    all = all.concat(chunk);
    console.log(`  WC products page ${page}: +${chunk.length} (total ${all.length})`);
    if (chunk.length < 100) break;
    page++;
  }
  return all;
}

console.log('\n🛍  Scraping WC Store API (prix, variantes, images)…\n');
const products = await fetchAllWC();

// Simplification de la structure pour être plus digeste
const simplified = products.map(p => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  type: p.type,                          // simple | variable
  permalink: p.permalink,
  sku: p.sku,
  description: p.description,             // HTML
  short_description: p.short_description, // HTML
  is_in_stock: p.is_in_stock,
  stock_quantity: p.stock_quantity,
  prices: {
    price: parseInt(p.prices?.price || 0) / 100,
    regular: parseInt(p.prices?.regular_price || 0) / 100,
    sale: p.prices?.sale_price ? parseInt(p.prices.sale_price) / 100 : null,
    range_min: parseInt(p.prices?.price_range?.min_amount || 0) / 100 || null,
    range_max: parseInt(p.prices?.price_range?.max_amount || 0) / 100 || null,
    currency: p.prices?.currency_code || 'EUR',
  },
  images: (p.images || []).map(img => ({
    id: img.id,
    src: img.src,
    thumbnail: img.thumbnail,
    alt: img.alt,
    name: img.name,
  })),
  categories: (p.categories || []).map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  })),
  attributes: (p.attributes || []).map(a => ({
    id: a.id,
    name: a.name,
    taxonomy: a.taxonomy,
    has_variations: a.has_variations,
    terms: (a.terms || []).map(t => ({ name: t.name, slug: t.slug })),
  })),
  variations: p.variations || [],  // tableaux d'IDs de variations
  add_to_cart: p.add_to_cart,      // texte du bouton + URL
  date_created: p.date_created,
  date_modified: p.date_modified,
}));

const out = path.join(IMPORT, 'products-wc.json');
fs.writeFileSync(out, JSON.stringify(simplified, null, 2));

console.log(`\n✅ Saved ${simplified.length} products → ${path.relative(root, out)}`);
console.log('\n📊 Stats :');
const types = simplified.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {});
console.log(`  types:`, types);
const withGallery = simplified.filter(p => p.images.length > 1).length;
console.log(`  avec galerie (>1 image): ${withGallery} / ${simplified.length}`);
const onSale = simplified.filter(p => p.prices.sale && p.prices.sale < p.prices.regular).length;
console.log(`  en promo: ${onSale} / ${simplified.length}`);
const totalImages = simplified.reduce((acc, p) => acc + p.images.length, 0);
console.log(`  total images à télécharger: ${totalImages}`);
