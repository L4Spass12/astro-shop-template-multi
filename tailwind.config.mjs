import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        /**
         * Pure neutral dark palette (GLIDE-style).
         * Les noms sont conservés pour faciliter la migration depuis yoga-malin
         * mais les valeurs sont remappées :
         *   dark        = body background (#0a0a0a)
         *   panel       = sections secondaires / cards (#0d0d0d)
         *   teal        = variation panel légèrement plus claire (#111111)
         *   beige       = bordures / tags / subtle bg (#1f1f1f)
         *   cream       = blanc principal (texte et surfaces)
         *   terracotta  = accent = blanc pur (utilisé pour boutons, liens, labels)
         *   sage        = accent de statut (vert)
         */
        dark:       '#0A0A0A',
        panel:      '#0D0D0D',
        teal:       '#111111',
        beige:      '#1F1F1F',
        cream:      '#FFFFFF',
        terracotta: '#FFFFFF',
        sage:       '#22C55E',
        /* Neutres supplémentaires pour granularité (optional) */
        'n-500':    '#737373',
        'n-400':    '#A3A3A3',
      },
      fontFamily: {
        /**
         * One typeface, Inter, pour tout le site.
         * "display" existe pour compat avec les class existantes, pointe sur Inter.
         */
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
      },
    },
  },
  plugins: [typography],
};
