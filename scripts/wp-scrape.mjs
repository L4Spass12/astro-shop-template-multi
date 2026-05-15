/**
 * ============================================================
 *  Scraper WordPress → JSON
 *  Récupère posts, produits, catégories, pages depuis l'API REST
 *  publique de WordPress, et sauvegarde tout en JSON structuré.
 *
 *  Usage : node scripts/wp-scrape.mjs
 *  Output : ./import/{posts,products,categories,product_cat,pages}.json
 *
 *  L'étape suivante (wp-to-astro.mjs) convertit ce JSON en
 *  fichiers Markdown Astro.
 * ============================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const OUT = path.join(root, 'import');
fs.mkdirSync(OUT, { recursive: true });

const WP = 'https://buddypad.com/wp-json/wp/v2';
const PER_PAGE = 100;

/**
 * Récupère TOUS les items d'un endpoint paginé.
 */
async function fetchAll(endpoint) {
  let all = [];
  let page = 1;
  while (true) {
    const url = `${WP}/${endpoint}?per_page=${PER_PAGE}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 400 && page > 1) break; // plus de pages
      throw new Error(`Fetch ${url} failed: ${res.status}`);
    }
    const chunk = await res.json();
    if (!chunk.length) break;
    all = all.concat(chunk);
    console.log(`  ${endpoint} page ${page}: +${chunk.length} (total ${all.length})`);
    if (chunk.length < PER_PAGE) break;
    page++;
  }
  return all;
}

const endpoints = [
  { name: 'posts',        path: 'posts' },
  { name: 'products',     path: 'product' },
  { name: 'categories',   path: 'categories' },
  { name: 'product_cat',  path: 'product_cat' },
  { name: 'pages',        path: 'pages' },
  { name: 'tags',         path: 'tags' },
];

console.log('\n🔍 Scraping buddypad.com via WP REST API…\n');

for (const ep of endpoints) {
  try {
    console.log(`→ /${ep.path}`);
    const data = await fetchAll(ep.path);
    const file = path.join(OUT, `${ep.name}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`  ✓ Saved ${data.length} items → ${path.relative(root, file)}\n`);
  } catch (e) {
    console.error(`  ✗ ${ep.name} failed: ${e.message}\n`);
  }
}

console.log('✅ Scraping terminé. Voir dossier import/');
