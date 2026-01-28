import { defineConfig } from 'vitepress';
import {
  getVersionFromPackageJson,
  injectNPMPackageVersion,
} from '../src/lib/plugins/injectVersion';

import { nav } from './nav';
import { sidebar } from './sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'sley',
  description: 'Version orchestrator for semantic versioning',
  lastUpdated: true,
  sitemap: {
    hostname: 'https://sley.indaco.dev',
  },

  // Source directory for markdown files
  srcDir: 'pages',

  // Use .html on URLs
  cleanUrls: false,

  // Head meta tags
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#14b8a6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'sley' }],
  ],

  appearance: 'force-dark',
  themeConfig: {
    // Logo in nav
    logo: '/logo.svg',

    // Nav bar
    nav: nav,

    // Sidebar
    sidebar: sidebar,

    // Social links
    socialLinks: [{ icon: 'github', link: 'https://github.com/indaco/sley' }],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright:
        "© 2026 <a href='https://github.com/indaco' target='_blank'>indaco</a>",
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/indaco/sley-docs/edit/main/pages/:path',
      text: 'Edit this page on GitHub',
    },

    // Search (using local search)
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    // Last updated
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },

    // Doc footer
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },

    // Outline
    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    // External link icon
    externalLinkIcon: true,
  },

  ignoreDeadLinks: [/^https?:\/\/localhost/],
  // Markdown config
  markdown: {
    image: {
      lazyLoading: true,
    },
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },

  vite: {
    plugins: [injectNPMPackageVersion(getVersionFromPackageJson())],
  },
});
