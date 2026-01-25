<template>
  <div class="plugin-meta">
    <div class="badges">
      <VPBadge v-if="type" type="danger" :text="type" />
      <VPBadge type="info" text="Built-in" />
      <VPBadge
        :type="enabled ? 'tip' : 'warning'"
        :text="enabled ? 'Enabled by default' : 'Disabled by default'"
      />
    </div>
    <p v-if="$slots.default" class="plugin-note">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
import { VPBadge } from 'vitepress/theme';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PluginMeta',
  components: { VPBadge },
  props: {
    enabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
  },
});
</script>

<style scoped>
.plugin-meta {
  margin: 1.5rem 0;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.plugin-note {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>
