/**
 * ============================================================
 *  Convertisseur WP pages légales → Astro pages
 *
 *  Lit import/pages.json et génère src/pages/<slug>.astro pour
 *  chaque page statique dont on veut préserver l'URL.
 *
 *  Pages gérées :
 *   - /contact/
 *   - /livraisons-et-retours/
 *   - /conditions-generales-de-vente-cgv/
 *   - /politique-de-confidentialite/
 *   - /mentions-legales/
 *
 *  Skip /tapis-de-souris/ (déjà généré comme listing produits),
 *  /accueil/ (= home), /blog/ (= blog index), /checkout/, /cart/,
 *  /my-account/, /wishlist/, /etape-de-paiement/ (gérés par Atelier).
 * ============================================================
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const IMPORT = path.join(root, 'import');
const OUT = path.join(root, 'src', 'pages');

const pages = JSON.parse(fs.readFileSync(path.join(IMPORT, 'pages.json'), 'utf8'));
const imageMap = JSON.parse(fs.readFileSync(path.join(IMPORT, 'image-map.json'), 'utf8'));

// Liste des slugs à générer (URLs WP qu'on préserve)
const WANTED = [
  'contact',
  'livraisons-et-retours',
  'conditions-generales-de-vente-cgv',
  'politique-de-confidentialite',
  'mentions-legales',
];

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  strongDelimiter: '**',
  linkStyle: 'inlined',
});
td.addRule('img-remap', {
  filter: 'img',
  replacement: (content, node) => {
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
    .replace(/&nbsp;/g, ' ');
}

// Template Astro : BaseLayout + prose
function astroTemplate(title, description, htmlContent) {
  const escaped = htmlContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  return `---
import BaseLayout from '../layouts/BaseLayout.astro';
import siteConfig from '../../site.config.mjs';

const title = ${JSON.stringify(title)};
const description = ${JSON.stringify(description)};
---

<BaseLayout title={\`\${title} | \${siteConfig.name}\`} description={description}>
  <div class="max-w-3xl mx-auto px-6 py-16 md:py-24">
    <h1 class="text-4xl md:text-5xl font-medium tracking-tight text-cream leading-[1.1] mb-10">{title}</h1>
    <article class="prose prose-invert prose-lg max-w-none
      prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-cream
      prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl
      prose-p:font-light prose-p:text-n-400 prose-p:leading-relaxed
      prose-a:text-cream prose-a:underline prose-a:underline-offset-4 prose-a:decoration-white/30 hover:prose-a:decoration-cream
      prose-strong:text-cream prose-strong:font-medium
      prose-ul:font-light prose-ol:font-light prose-li:text-n-400
      prose-hr:border-white/[0.08]"
      set:html={\`${escaped}\`}
    />
  </div>
</BaseLayout>
`;
}

console.log(`\n📄 Conversion des pages statiques…\n`);
let written = 0;

for (const slug of WANTED) {
  const page = pages.find(p => p.slug === slug);
  if (!page) {
    console.log(`  ⚠ ${slug} introuvable dans pages.json`);
    continue;
  }
  const title = decodeEntities(page.title.rendered);
  const htmlRaw = page.content.rendered;
  // On garde le HTML tel quel (les styles .prose géreront l'habillage dark)
  // Mais on remappe les images vers le local
  const html = htmlRaw.replace(/<img([^>]+)src=["']([^"']+)["']/g, (m, pre, src) => {
    const mapped = imageMap[src] || src;
    return `<img${pre}src="${mapped}"`;
  });

  // Description = premier paragraphe ou extrait
  const pMatch = html.match(/<p[^>]*>(.*?)<\/p>/s);
  const description = pMatch
    ? decodeEntities(pMatch[1].replace(/<[^>]+>/g, '').trim()).slice(0, 160)
    : title;

  const out = astroTemplate(title, description, html);
  fs.writeFileSync(path.join(OUT, `${slug}.astro`), out);
  written++;
  console.log(`  ✓ ${slug}  → /${slug}/`);
}

console.log(`\n✅ ${written} pages statiques générées`);
