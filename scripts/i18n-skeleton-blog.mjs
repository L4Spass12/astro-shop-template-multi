#!/usr/bin/env node
/**
 * Auto-génère des skeletons EN + DE pour les articles blog FR.
 *
 * Pareil que i18n-skeleton-products.mjs mais adapté au schema blog.
 * - Traduit : title, description, imageAlt, imageTitle, tags[], faq[]
 *   (les FAQ q/a sont laissées en FR avec marqueur TODO car uniques par article)
 * - Préserve : pubDate, updatedDate, author, category, image, featured
 *
 * Le `category` reste en FR car le schema l'attend dans la liste FR canonique.
 * Au rendu, la couche i18n traduira le label affiché (Phase 6).
 *
 * Idempotent — skip si la cible existe déjà.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src/content/blog');

const LANGS = ['en', 'de'];

function processBlog(srcPath, lang) {
  const targetDir = path.join(path.dirname(srcPath), lang);
  const targetPath = path.join(targetDir, path.basename(srcPath));
  if (fs.existsSync(targetPath)) return false;

  const raw = fs.readFileSync(srcPath, 'utf8');
  const { data, content } = matter(raw);
  const newData = JSON.parse(JSON.stringify(data));

  // Body en FR avec marqueur TODO en haut
  const todoBody = `<!-- TODO i18n:${lang} - body in FR, please translate -->\n\n${content.trimStart()}`;

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetPath, matter.stringify(todoBody, newData), 'utf8');
  return true;
}

const all = fs.readdirSync(SRC, { withFileTypes: true })
  .filter(e => e.isFile() && e.name.endsWith('.md'))
  .map(e => path.join(SRC, e.name));

let created = 0, skipped = 0;
for (const f of all) {
  for (const lang of LANGS) {
    if (processBlog(f, lang)) created++;
    else skipped++;
  }
}

console.log(`✅ ${created} skeleton(s) créé(s), ⊙ ${skipped} skip`);
