/**
 * ============================================================
 *  Téléchargement local des images WP
 *
 *  - Featured images des posts → public/images/blog/{post-slug}.{ext}
 *  - Galerie produits → public/images/products/{product-slug}/{index}.{ext}
 *  - Images inline dans les contenus HTML (src="https://buddypad.com/...") →
 *    remappées aussi, mais elles seront traitées par convert-*.mjs
 *
 *  Écrit un mapping URL-WP → chemin-local dans import/image-map.json
 *  pour que les scripts de conversion puissent réécrire les <img src="...">
 *
 *  Usage : node scripts/download-images.mjs
 * ============================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, URL as NodeURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const IMPORT = path.join(root, 'import');
const PUBLIC = path.join(root, 'public');

const BLOG_DIR = path.join(PUBLIC, 'images', 'blog');
const PROD_DIR = path.join(PUBLIC, 'images', 'products');
fs.mkdirSync(BLOG_DIR, { recursive: true });
fs.mkdirSync(PROD_DIR, { recursive: true });

const imageMap = {}; // { "https://buddypad.com/...": "/images/blog/..." }

function extFromUrl(u) {
  try {
    const url = new NodeURL(u);
    const m = url.pathname.match(/\.([a-zA-Z0-9]+)$/);
    return m ? m[1].toLowerCase() : 'webp';
  } catch { return 'webp'; }
}

async function downloadTo(url, destAbs) {
  if (fs.existsSync(destAbs)) {
    // idempotent : si déjà dl, skip
    return 'cached';
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destAbs, buf);
  return 'ok';
}

// ───────── Load data ─────────
const posts = JSON.parse(fs.readFileSync(path.join(IMPORT, 'posts.json'), 'utf8'));
// Préférer products-full.json (avec variations) si dispo, sinon fallback
const productsFile = fs.existsSync(path.join(IMPORT, 'products-full.json'))
  ? 'products-full.json' : 'products-wc.json';
const products = JSON.parse(fs.readFileSync(path.join(IMPORT, productsFile), 'utf8'));

// ───────── BLOG : featured images des posts ─────────
console.log('\n📸 Posts featured images…');
let ok = 0, cached = 0, fail = 0;
for (const p of posts) {
  const url = p.jetpack_featured_media_url;
  if (!url) continue;
  const ext = extFromUrl(url);
  const dest = path.join(BLOG_DIR, `${p.slug}.${ext}`);
  const publicPath = `/images/blog/${p.slug}.${ext}`;
  try {
    const st = await downloadTo(url, dest);
    if (st === 'cached') cached++; else ok++;
    imageMap[url] = publicPath;
  } catch (e) {
    console.error(`  ✗ ${p.slug}: ${e.message}`);
    fail++;
  }
}
console.log(`  Blog: ${ok} téléchargés, ${cached} en cache, ${fail} erreurs`);

// ───────── INLINE : toutes les <img> dans les contenus HTML ─────────
console.log('\n🖼  Inline images dans les contenus des posts…');
const INLINE_DIR = path.join(PUBLIC, 'images', 'inline');
fs.mkdirSync(INLINE_DIR, { recursive: true });
let iOk = 0, iCached = 0, iFail = 0, iSkipped = 0;

const extractImgSrcs = (html) => {
  const srcs = [];
  const re = /<img[^>]+src=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html)) !== null) srcs.push(m[1]);
  return srcs;
};

const allInlineUrls = new Set();
for (const p of posts) {
  const html = p.content?.rendered || '';
  for (const url of extractImgSrcs(html)) allInlineUrls.add(url);
}
// Aussi dans les descriptions longues des produits
for (const prod of products) {
  const html = (prod.description || '') + (prod.short_description || '');
  for (const url of extractImgSrcs(html)) allInlineUrls.add(url);
}

for (const url of allInlineUrls) {
  // Skip si déjà téléchargé (featured ou galerie produit)
  if (imageMap[url]) { iSkipped++; continue; }
  // Skip si URL externe (pas buddypad.com)
  if (!url.includes('buddypad.com') && !url.includes('wp-content')) { iSkipped++; continue; }
  try {
    const urlObj = new NodeURL(url);
    const filename = path.basename(urlObj.pathname);  // ex. Design-sans-titre-15-1024x559.webp
    const dest = path.join(INLINE_DIR, filename);
    const publicPath = `/images/inline/${filename}`;
    const st = await downloadTo(url, dest);
    if (st === 'cached') iCached++; else iOk++;
    imageMap[url] = publicPath;
  } catch (e) {
    console.error(`  ✗ ${url.slice(-60)}: ${e.message}`);
    iFail++;
  }
}
console.log(`  Inline: ${iOk} téléchargés, ${iCached} en cache, ${iSkipped} skipped (déjà map/externe), ${iFail} erreurs`);

// ───────── PRODUITS : galerie complète ─────────
console.log('\n🛍  Products gallery…');
let pOk = 0, pCached = 0, pFail = 0;

for (const prod of products) {
  if (!prod.images || !prod.images.length) continue;
  const dir = path.join(PROD_DIR, prod.slug);
  fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < prod.images.length; i++) {
    const img = prod.images[i];
    const ext = extFromUrl(img.src);
    const dest = path.join(dir, `${i + 1}.${ext}`);
    const publicPath = `/images/products/${prod.slug}/${i + 1}.${ext}`;
    try {
      const st = await downloadTo(img.src, dest);
      if (st === 'cached') pCached++; else pOk++;
      imageMap[img.src] = publicPath;
      // Les thumbnails Snipcart sont le même fichier avec paramètres différents
      if (img.thumbnail) imageMap[img.thumbnail] = publicPath;
    } catch (e) {
      console.error(`  ✗ ${prod.slug}/${i + 1}: ${e.message}`);
      pFail++;
    }
  }
}
console.log(`  Products: ${pOk} téléchargés, ${pCached} en cache, ${pFail} erreurs`);

// ───────── VARIATIONS : images spécifiques ─────────
console.log('\n🔀 Variations images (sous /images/products/<slug>/variations/)…');
let vOk = 0, vCached = 0, vFail = 0, vSkipped = 0;
for (const prod of products) {
  const variations = prod.variations_detail || [];
  if (!variations.length) continue;
  const dir = path.join(PROD_DIR, prod.slug, 'variations');
  fs.mkdirSync(dir, { recursive: true });
  for (const v of variations) {
    if (!v.image) { vSkipped++; continue; }
    // Si l'image est déjà celle du parent, on remappe vers le parent
    const existing = imageMap[v.image];
    if (existing) {
      // reuse, pas besoin de télécharger à nouveau
      vSkipped++;
      continue;
    }
    const ext = extFromUrl(v.image);
    const dest = path.join(dir, `${v.id}.${ext}`);
    const publicPath = `/images/products/${prod.slug}/variations/${v.id}.${ext}`;
    try {
      const st = await downloadTo(v.image, dest);
      if (st === 'cached') vCached++; else vOk++;
      imageMap[v.image] = publicPath;
    } catch (e) {
      console.error(`  ✗ ${prod.slug}/var/${v.id}: ${e.message}`);
      vFail++;
    }
  }
}
console.log(`  Variations: ${vOk} téléchargés, ${vCached} en cache, ${vSkipped} partagées avec parent, ${vFail} erreurs`);

// ───────── Sauvegarde du mapping ─────────
const mapFile = path.join(IMPORT, 'image-map.json');
fs.writeFileSync(mapFile, JSON.stringify(imageMap, null, 2));
console.log(`\n🗺  Image map: ${Object.keys(imageMap).length} entries → ${path.relative(root, mapFile)}`);

// ───────── Taille totale ─────────
function dirSize(p) {
  let size = 0;
  for (const f of fs.readdirSync(p, { recursive: true })) {
    const fp = path.join(p, f);
    if (fs.statSync(fp).isFile()) size += fs.statSync(fp).size;
  }
  return size;
}
const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`\n📊 Total volume :`);
console.log(`  public/images/blog      : ${mb(dirSize(BLOG_DIR))} Mo`);
console.log(`  public/images/products  : ${mb(dirSize(PROD_DIR))} Mo`);
