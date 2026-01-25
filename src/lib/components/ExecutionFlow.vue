<template>
  <div class="execution-flow">
    <div class="command">
      <code>{{ command }}</code>
    </div>

    <div v-for="(phase, index) in phases" :key="index" class="phase">
      <div :class="['phase-header', phase.type]">
        <span class="phase-title">{{ phase.title }}</span>
        <VPBadge
          v-if="phase.badge"
          :type="phase.badgeType"
          :text="phase.badge"
        />
      </div>

      <div class="steps">
        <div
          v-for="(step, stepIndex) in phase.steps"
          :key="stepIndex"
          class="step"
        >
          <div class="step-connector">
            <div class="step-dot"></div>
            <div
              v-if="stepIndex < phase.steps.length - 1"
              class="step-line"
            ></div>
          </div>
          <div class="step-content">
            <span class="step-name">{{ step.name }}</span>
            <span class="step-desc">{{ step.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { VPBadge } from 'vitepress/theme';
import { defineComponent, PropType } from 'vue';

interface Step {
  name: string;
  description: string;
}

interface Phase {
  title: string;
  type: 'validation' | 'action' | 'post';
  badge?: string;
  badgeType?: 'info' | 'tip' | 'warning' | 'danger';
  steps: Step[];
}

export default defineComponent({
  name: 'ExecutionFlow',
  components: { VPBadge },
  props: {
    command: {
      type: String,
      default: 'sley bump patch',
    },
    phases: {
      type: Array as PropType<Phase[]>,
      required: true,
    },
  },
});
</script>

<style scoped>
.execution-flow {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
}

.command {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.command code {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.phase {
  margin-bottom: 1.5rem;
}

.phase:last-child {
  margin-bottom: 0;
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-border);
}

.phase-header.validation {
  border-bottom-color: var(--vp-c-warning-1);
}

.phase-header.action {
  border-bottom-color: var(--vp-c-brand-1);
}

.phase-header.post {
  border-bottom-color: var(--vp-c-text-3);
}

.phase-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.steps {
  padding-left: 0.5rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-height: 2.5rem;
}

.step-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  width: 12px;
}

.step-dot {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  flex-shrink: 0;
}

.step-line {
  width: 2px;
  flex-grow: 1;
  background: var(--vp-c-border);
  margin: 4px 0;
}

.step-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 0.75rem;
}

.step-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.step-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-top: 0.125rem;
}
</style>
