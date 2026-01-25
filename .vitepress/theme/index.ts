// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import VersionBadge from '../../src/lib/components/VersionBadge.vue';
import PluginMeta from '../../src/lib/components/PluginMeta.vue';
import ExtensionMeta from '../../src/lib/components/ExtensionMeta.vue';
import ExecutionFlow from '../../src/lib/components/ExecutionFlow.vue';
import CustomFeatures from '../../src/lib/components/CustomFeatures.vue';

import { h } from 'vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-hero-after': () => h(CustomFeatures),
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component('VersionBadge', VersionBadge);
    app.component('PluginMeta', PluginMeta);
    app.component('ExtensionMeta', ExtensionMeta);
    app.component('ExecutionFlow', ExecutionFlow);
    app.component('CustomFeatures', CustomFeatures);
  },
} satisfies Theme;
