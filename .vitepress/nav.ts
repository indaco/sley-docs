import { DefaultTheme } from 'vitepress';
import { getVersionFromPackageJson } from '../src/lib/plugins/injectVersion';

const pkgVersion = getVersionFromPackageJson();

export const nav: DefaultTheme.Config['nav'] = [
  { text: 'Guide', link: '/guide/quick-start' },
  { text: 'Plugins', link: '/plugins/' },
  { text: 'Extensions', link: '/extensions/' },
  { text: 'Configuration', link: '/config/' },
  { text: 'Reference', link: '/reference/cli' },
  {
    text: pkgVersion.replace(/\"/g, ''),
    items: [
      { text: 'Changelog', link: '/changelog' },
      { text: 'Contributing', link: '/contributing' },
    ],
  },
];
