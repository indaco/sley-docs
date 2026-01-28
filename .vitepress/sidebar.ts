import { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Config['sidebar'] = [
  {
    text: 'Guide',
    items: [
      { text: 'What is sley?', link: '/guide/what-is-sley' },
      { text: 'Quick Start', link: '/guide/quick-start' },
      { text: 'Tutorial', link: '/guide/tutorial' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'Usage', link: '/guide/usage' },
      { text: 'Pre-release Versions', link: '/guide/pre-release' },
      {
        text: 'Monorepo Support',
        link: '/guide/monorepo/',
        collapsed: true,
        items: [
          { text: 'Versioning Models', link: '/guide/monorepo/versioning-models' },
          { text: 'Configuration', link: '/guide/monorepo/configuration' },
          { text: 'Workflows', link: '/guide/monorepo/workflows' },
        ],
      },
      { text: 'CI/CD Integration', link: '/guide/ci-cd' },
      {
        text: 'Troubleshooting',
        link: '/guide/troubleshooting/',
        collapsed: true,
        items: [
          {
            text: '.version File Issues',
            link: '/guide/troubleshooting/version-file',
          },
          {
            text: 'Configuration Issues',
            link: '/guide/troubleshooting/configuration',
          },
          {
            text: 'Git & Tag Issues',
            link: '/guide/troubleshooting/git-and-tags',
          },
          { text: 'Plugin Errors', link: '/guide/troubleshooting/plugins' },
          { text: 'CI/CD Issues', link: '/guide/troubleshooting/ci-cd' },
          { text: 'Monorepo Issues', link: '/guide/troubleshooting/monorepo' },
          { text: 'Advanced Topics', link: '/guide/troubleshooting/advanced' },
        ],
      },
    ],
  },
  {
    text: 'Plugins',
    items: [
      { text: 'Overview', link: '/plugins/' },
      { text: 'Commit Parser', link: '/plugins/commit-parser' },
      { text: 'Tag Manager', link: '/plugins/tag-manager' },
      { text: 'Changelog Generator', link: '/plugins/changelog-generator' },
      { text: 'Changelog Parser', link: '/plugins/changelog-parser' },
      { text: 'Version Validator', link: '/plugins/version-validator' },
      { text: 'Dependency Check', link: '/plugins/dependency-check' },
      { text: 'Release Gate', link: '/plugins/release-gate' },
      { text: 'Audit Log', link: '/plugins/audit-log' },
    ],
  },
  {
    text: 'Extensions',
    items: [
      { text: 'Overview', link: '/extensions/' },
      { text: 'Commit Validator', link: '/extensions/commit-validator' },
      { text: 'Docker Tag Sync', link: '/extensions/docker-tag-sync' },
      { text: 'GitHub Version Sync', link: '/extensions/github-version-sync' },
    ],
  },
  {
    text: 'Configuration',
    items: [
      { text: 'Overview', link: '/config/' },
      { text: 'Environment Variables', link: '/config/env-vars' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'CLI', link: '/reference/cli' },
      { text: '.sley.yaml', link: '/reference/sley-yaml' },
    ],
  },
  {
    text: 'Resources',
    items: [
      { text: 'Changelog', link: '/changelog' },
      { text: 'Contributing', link: '/contributing' },
    ],
  },
];
