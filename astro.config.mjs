import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://abialas.pl',
  // Off: its injected h1s ("Audit", "Settings"…) break e2e strict-mode h1
  // assertions whenever playwright reuses a running dev server on :4321.
  devToolbar: { enabled: false },
  // /resume is an under-construction note while resume.draft (noindexed);
  // drop the filter when the real résumé lands there.
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/resume/') })],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'directory',
  },
});
