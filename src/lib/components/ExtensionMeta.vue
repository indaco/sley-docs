<template>
  <div class="extension-meta">
    <div class="badges">
      <VPBadge type="danger" :text="hook" />
      <VPBadge type="info" :text="language" />
      <VPBadge v-if="version" type="tip" :text="`v${version}`" />
    </div>
    <p v-if="repo" class="extension-repo">
      <a :href="repo" target="_blank" rel="noopener noreferrer"
        >View on GitHub</a
      >
    </p>
  </div>
</template>

<script lang="ts">
import { VPBadge } from 'vitepress/theme';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExtensionMeta',
  components: { VPBadge },
  props: {
    hook: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      default: '',
    },
    repo: {
      type: String,
      default: '',
    },
  },
});
</script>

<style scoped>
.extension-meta {
  margin: 1.5rem 0;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.extension-repo {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.extension-repo a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.extension-repo a:hover {
  text-decoration: underline;
}
</style>
