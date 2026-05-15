/**
 * Run once after cloning the template to a new niche :
 *   node scripts/init.mjs
 *
 * Ce script automatise tout ce qui peut l'être :
 *   1. Met à jour le name de package.json depuis siteConfig.name
 *   2. Renomme src/pages/tapis-de-souris.astro → <shop.path>.astro
 *   3. Renomme src/pages/[lang]/tapis-de-souris.astro → <shop.path>.astro
 *   4. Audit : signale les hardcodes BuddyPad/Roubaix qui restent
 *   5. Audit : signale les secrets/keys encore aux valeurs du template
 *   6. Sanity-check : enum blog.category synchro avec siteConfig.categories
 *   7. Sanity-check : images requises présentes
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const cd = (p) => path.join(root, p);

const { default: siteConfig } = await import('../site.config.mjs');

const ok = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[33m⚠\x1b[0m ${m}`);
const err = (m) => console.log(`\x1b[31m✗\x1b[0m ${m}`);
let issues = 0;
const issue = (m) => { issues++; err(m); };

// ─── 1. package.json name ──────────────────────────────────────────────────
const pkgPath = cd('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const slug = siteConfig.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
if (pkg.name !== slug) {
  pkg.name = slug;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  ok(`package.json name → "${slug}"`);
} else {
  ok(`package.json name déjà à jour ("${slug}")`);
}

// ─── 2 + 3. Renommage des routes boutique ──────────────────────────────────
const shopPath = siteConfig.shop?.path;
if (shopPath) {
  const renames = [
    ['src/pages/tapis-de-souris.astro', `src/pages/${shopPath}.astro`],
    ['src/pages/[lang]/tapis-de-souris.astro', `src/pages/[lang]/${shopPath}.astro`],
  ];
  for (const [from, to] of renames) {
    const fromAbs = cd(from), toAbs = cd(to);
    if (fs.existsSync(fromAbs) && from !== to) {
      if (fs.existsSync(toAbs)) {
        warn(`${to} existe déjà — renommage skip`);
      } else {
        fs.renameSync(fromAbs, toAbs);
        ok(`Renommé : ${from} → ${to}`);
      }
    } else if (fs.existsSync(toAbs)) {
      ok(`Route boutique déjà : ${to}`);
    } else {
      warn(`Aucune route boutique trouvée (cherché : ${from} ou ${to})`);
    }
  }
}

// ─── 4. Audit hardcodes BuddyPad/Roubaix résiduels ─────────────────────────
console.log('\n── Audit hardcodes ──');
try {
  const grep = execSync(
    `grep -rn -iE "buddypad|123 rue|Roubaix|06 27 29|contact@buddypad" src/ scripts/topics.json --include="*.astro" --include="*.ts" --include="*.mjs" --include="*.json" 2>/dev/null | grep -v "siteConfig" | grep -v "^[^:]*:[0-9]*: *//"`,
    { cwd: root, encoding: 'utf8' }
  ).trim();
  if (grep) {
    const lines = grep.split('\n').slice(0, 8);
    issue(`${grep.split('\n').length} occurrences "BuddyPad/Roubaix" dans le code :`);
    lines.forEach((l) => console.log('   ' + l));
    if (grep.split('\n').length > 8) console.log(`   …`);
  } else {
    ok('Aucun hardcode BuddyPad/Roubaix dans src/');
  }
} catch (e) { /* grep retourne 1 si rien trouvé */ ok('Aucun hardcode BuddyPad/Roubaix dans src/'); }

// ─── 5. Audit secrets/keys encore template ─────────────────────────────────
console.log('\n── Audit clés à remplacer ──');
if (siteConfig.forms?.web3formsKey === 'cb2f0db3-85e5-4006-b2d9-bdeacf271b9f') {
  issue("forms.web3formsKey est encore celle de BuddyPad — les soumissions contact partiront ailleurs");
}
if (siteConfig.shop?.atelierShopId === '50e9f184-21e0-43bc-940e-52768855c84f') {
  issue("shop.atelierShopId est encore celui de BuddyPad — le widget paiement utilisera le shop BuddyPad réel");
}
if (siteConfig.forms?.contactEmail?.includes('buddypad')) {
  issue(`forms.contactEmail contient encore "buddypad" : ${siteConfig.forms.contactEmail}`);
}
if (siteConfig.legal?.editor?.email?.includes('buddypad')) {
  issue(`legal.editor.email contient encore "buddypad" : ${siteConfig.legal.editor.email}`);
}
if (issues === 0) ok('Toutes les clés/emails sont au format custom');

// ─── 6. Sanity-check enum blog.category ↔ siteConfig.categories ────────────
console.log('\n── Sanity blog.category ↔ categories ──');
const blogDir = cd('src/content/blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  const blogCats = new Set();
  blogFiles.forEach((f) => {
    const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
    const m = content.match(/^category:\s*['"]?([^'"\n]+?)['"]?\s*$/m);
    if (m) blogCats.add(m[1].trim());
  });
  const cfgCats = new Set(siteConfig.categories ?? []);
  const orphan = [...blogCats].filter((c) => !cfgCats.has(c));
  if (orphan.length) {
    issue(`Articles avec category absente de siteConfig.categories : ${orphan.join(', ')} → build crash sur z.enum`);
  } else if (blogFiles.length === 0) {
    warn('Aucun article dans src/content/blog/ — collection vide');
  } else {
    ok(`${blogFiles.length} articles, catégories synchronisées`);
  }
}

// ─── 7. Sanity-check images requises ───────────────────────────────────────
console.log('\n── Sanity images requises ──');
const requiredImages = [
  'public/og-image.jpg',
  'public/favicon.svg',
  'public/images/home/hero-desktop.webp',
  'public/images/home/hero-mobile.webp',
  'public/images/home/hero-desktop-800w.webp',
];
const missing = requiredImages.filter((p) => !fs.existsSync(cd(p)));
if (missing.length) {
  issue(`Images requises manquantes : ${missing.join(', ')}`);
} else {
  ok('Toutes les images requises sont présentes');
}

// ─── 8. Sanity topics.json ─────────────────────────────────────────────────
const topicsPath = cd('scripts/topics.json');
if (fs.existsSync(topicsPath)) {
  const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
  const looksTemplated = topics.some((t) => {
    const title = typeof t === 'string' ? t : t.title;
    return /tapis|souris|mousepad/i.test(title);
  });
  if (looksTemplated) {
    issue(`scripts/topics.json contient encore des sujets BuddyPad — purge OBLIGATOIRE avant que le CRON ne tourne`);
  } else if (topics.length === 0) {
    warn('scripts/topics.json est vide — pas d\'article auto-généré tant que tu ne le remplis pas');
  } else {
    ok(`scripts/topics.json : ${topics.length} sujets prêts`);
  }
}

// ─── Résumé ────────────────────────────────────────────────────────────────
console.log('\n──────────────────────────────────');
if (issues === 0) {
  console.log('\x1b[32m✅ Init terminé sans bloquant.\x1b[0m Lance maintenant : npm run dev');
} else {
  console.log(`\x1b[31m⚠  ${issues} bloquant(s) à corriger avant déploiement.\x1b[0m`);
  console.log('   Édite site.config.mjs (ou les fichiers signalés), puis relance : node scripts/init.mjs');
  process.exit(1);
}
