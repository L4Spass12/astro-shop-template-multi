/**
 * ============================================================
 *  Scraper des variations produits (WC Store API)
 *
 *  Pour chaque produit variable de products-wc.json, fetch chaque
 *  variation (par ID) pour récupérer son prix, stock, image propre.
 *
 *  Output : import/products-full.json (produits enrichis avec vraies variantes)
 * ============================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const IMPORT = path.join(root, 'import');
const BASE = 'https://buddypad.com/wp-json/wc/store/v1/products';

const products = JSON.parse(fs.readFileSync(path.join(IMPORT, 'products-wc.json'), 'utf8'));

const cents = (v) => v == null ? null : parseInt(v) / 100;

/**
 * @param ref  {id, attributes: [{name, value}]} venant du parent product
 *             (l'endpoint variation ne retourne pas ses propres attributes,
 *              c'est le parent qui liste la combinaison)
 */
async function fetchVariation(ref) {
  const res = await fetch(`${BASE}/${ref.id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const v = await res.json();
  return {
    id: v.id,
    sku: v.sku,
    price: cents(v.prices?.price),
    regular: cents(v.prices?.regular_price),
    sale: v.prices?.sale_price ? cents(v.prices.sale_price) : null,
    stock: v.stock_quantity,
    in_stock: v.is_in_stock,
    // attributs : on prend ceux du parent (ex: "Dimensions"="90-x-40-cm")
    attributes: (ref.attributes || []).map(a => ({
      name: a.name,      // "Dimensions", "Couleurs"
      slug: a.value,     // slug : "90-x-40-cm", "bleu-fonce"
    })),
    // image spécifique de la variante (si elle diffère du parent)
    image: v.images?.[0]?.src || null,
  };
}

console.log(`\n🔀 Scraping variations de ${products.length} produits…\n`);

let totalVariations = 0;
for (const prod of products) {
  // Les variations ici sont [{id, attributes}, ...]
  const varRefs = prod.variations || [];
  prod.variations_detail = [];
  for (const ref of varRefs) {
    // ref peut être un ID brut ou {id, attributes}
    const refObj = typeof ref === 'object' ? ref : { id: ref, attributes: [] };
    try {
      const detail = await fetchVariation(refObj);
      prod.variations_detail.push(detail);
      totalVariations++;
    } catch (e) {
      console.error(`  ✗ ${prod.slug} variation ${refObj.id}: ${e.message}`);
    }
  }
  console.log(`  ✓ ${prod.slug}: ${prod.variations_detail.length} variations`);
}

const out = path.join(IMPORT, 'products-full.json');
fs.writeFileSync(out, JSON.stringify(products, null, 2));
console.log(`\n✅ Saved ${products.length} products with ${totalVariations} variations → ${path.relative(root, out)}`);
