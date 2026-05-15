#!/usr/bin/env node
/**
 * Auto-génère des skeletons EN + DE pour les produits FR existants.
 *
 * Stratégie : la frontmatter est largement répétitive (mêmes prix, mêmes
 * dimensions, mêmes IDs de variation, même "shortDescription" boilerplate)
 * donc on l'auto-traduit avec une simple table de substitution. Seuls le
 * `name`, l'`imageAlt` et le body sont uniques par produit — ils sont
 * laissés en FR avec un marqueur `# TODO i18n: <lang>` que je / Claude
 * remplit ensuite.
 *
 * Pas de surprise SEO : aucune sortie n'est publiée tant qu'on n'a pas
 * relu et corrigé le marqueur.
 *
 * Usage :
 *   node scripts/i18n-skeleton-products.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src/content/products');

const LANGS = ['en', 'de'];

// Boilerplate translations (champs identiques dans 100% des fiches).
// Le \s (whitespace) couvre l'espace simple ET l'insécable (U+00A0) qu'on a
// hérité de WordPress.
const TRANSLATIONS = {
  en: {
    shortDesc_pattern: /^Tapis\s+de\s+souris\s+Designé\s+par\s+Buddypad$/i,
    shortDesc_replacement: 'Mouse pad designed by BuddyPad',
    attrName: { Dimensions: 'Dimensions' },
  },
  de: {
    shortDesc_pattern: /^Tapis\s+de\s+souris\s+Designé\s+par\s+Buddypad$/i,
    shortDesc_replacement: 'Von BuddyPad designtes Mauspad',
    attrName: { Dimensions: 'Größe' },
  },
};

// Table des cœurs des noms : on ne traduit le préfixe "Tapis de souris" que pour
// les noms purement structurels. Pour les noms qui contiennent un nom propre
// (Bushido, Karasu, etc.), on les laisse tels quels et on adapte juste le suffixe.
function translateName(name, lang) {
  const m = name.match(/^Tapis de [Ss]ouris\s+(.*)$/);
  if (!m) return name;
  const core = m[1].trim();
  if (lang === 'en') return `${core} Mouse Pad`;
  if (lang === 'de') return `Mauspad ${core}`;
  return name;
}

function localizeFrontmatter(data, lang) {
  const T = TRANSLATIONS[lang];
  const out = JSON.parse(JSON.stringify(data));

  // name + imageAlt (cas simple : on conserve la base, on adapte)
  if (out.name) out.name = translateName(out.name, lang);
  if (out.imageAlt) out.imageAlt = translateName(out.imageAlt, lang);

  // shortDescription (boilerplate)
  if (out.shortDescription && T.shortDesc_pattern.test(out.shortDescription)) {
    out.shortDescription = T.shortDesc_replacement;
  }

  // attributes[].name : "Dimensions" → "Größe" pour DE
  if (Array.isArray(out.attributes)) {
    for (const a of out.attributes) {
      if (T.attrName[a.name]) a.name = T.attrName[a.name];
    }
  }

  // variations[].attributes : remappe la clé "Dimensions" → "Größe"
  if (Array.isArray(out.variations)) {
    for (const v of out.variations) {
      if (v.attributes && 'Dimensions' in v.attributes && T.attrName.Dimensions !== 'Dimensions') {
        v.attributes = { [T.attrName.Dimensions]: v.attributes.Dimensions };
      }
    }
  }

  return out;
}

function processProduct(srcPath, lang) {
  const targetDir = path.join(path.dirname(srcPath), lang);
  const targetPath = path.join(targetDir, path.basename(srcPath));

  if (fs.existsSync(targetPath)) return false; // déjà traduit, skip

  const raw = fs.readFileSync(srcPath, 'utf8');
  const { data, content } = matter(raw);

  const newData = localizeFrontmatter(data, lang);

  // Body laissé en FR avec un marqueur TODO en haut
  const todoMarker = `<!-- TODO i18n:${lang} - body in FR, please translate -->\n\n`;
  const newBody = todoMarker + content.trimStart();

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetPath, matter.stringify(newBody, newData), 'utf8');
  return true;
}

const all = fs.readdirSync(SRC, { withFileTypes: true })
  .filter(e => e.isFile() && e.name.endsWith('.md') && !e.name.startsWith('produit-test-'))
  .map(e => path.join(SRC, e.name));

let created = 0, skipped = 0;
for (const f of all) {
  for (const lang of LANGS) {
    if (processProduct(f, lang)) created++;
    else skipped++;
  }
}

console.log(`✅ ${created} skeleton(s) créé(s), ⊙ ${skipped} skip (existaient déjà)`);
