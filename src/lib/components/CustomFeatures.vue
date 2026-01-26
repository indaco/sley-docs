<script setup lang="ts">
interface Feature {
  icon: string;
  title: string;
  details: string;
}

const features: Feature[] = [
  {
    icon: 'file',
    title: 'Simple .version File',
    details:
      'A single source of truth for your project version. Human-readable, language-agnostic, CI/CD friendly.',
  },
  {
    icon: 'plugin',
    title: 'Powerful Plugin System',
    details:
      'Built-in plugins for git tagging, changelog generation, version validation, and more.',
  },
  {
    icon: 'monorepo',
    title: 'Monorepo Support',
    details:
      'Manage multiple .version files across a monorepo with pattern matching and bulk operations.',
  },
  {
    icon: 'discover',
    title: 'Smart Discovery',
    details:
      'Auto-detect version sources from package.json, Cargo.toml, pyproject.toml, and suggest sync configuration.',
  },
  {
    icon: 'policy',
    title: 'Version Policies',
    details: 'Enforce versioning rules, branch constraints, and release gates.',
  },
  {
    icon: 'cicd',
    title: 'CI/CD Ready',
    details:
      'Works seamlessly in GitHub Actions, GitLab CI, and any automated workflow.',
  },
];
</script>

<template>
  <section class="custom-features">
    <div class="features-container">
      <div class="features-grid">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card"
        >
          <div class="feature-icon">
            <!-- File icon -->
            <svg
              v-if="feature.icon === 'file'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <!-- Plugin icon -->
            <svg
              v-else-if="feature.icon === 'plugin'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <!-- Monorepo icon -->
            <svg
              v-else-if="feature.icon === 'monorepo'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            <!-- Discover icon -->
            <svg
              v-else-if="feature.icon === 'discover'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <!-- Policy icon -->
            <svg
              v-else-if="feature.icon === 'policy'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <!-- CI/CD icon -->
            <svg
              v-else-if="feature.icon === 'cicd'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-details">{{ feature.details }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-features {
  position: relative;
  padding: 64px 24px 80px;
}

.features-container {
  position: relative;
  max-width: 1152px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-auto-rows: 1fr;
  border: 1px solid var(--sley-teal-600);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(20, 184, 166, 0.1),
    0 0 20px rgba(20, 184, 166, 0.1),
    0 0 40px rgba(20, 184, 166, 0.05);
}

.dark .features-grid {
  border-color: var(--sley-teal-500);
  box-shadow:
    0 0 0 1px rgba(45, 212, 191, 0.15),
    0 0 25px rgba(45, 212, 191, 0.15),
    0 0 50px rgba(45, 212, 191, 0.08);
}

@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  padding: 32px 28px;
  border-bottom: 1px solid rgba(20, 184, 166, 0.3);
}

.dark .feature-card {
  border-bottom-color: rgba(45, 212, 191, 0.25);
}

/* Remove bottom border from last row */
.feature-card:last-child {
  border-bottom: none;
}

@media (min-width: 640px) {
  .feature-card {
    border-right: 1px solid rgba(20, 184, 166, 0.3);
  }

  .dark .feature-card {
    border-right-color: rgba(45, 212, 191, 0.25);
  }

  /* Remove right border from last column (2 cols) */
  .feature-card:nth-child(2n) {
    border-right: none;
  }

  /* Remove bottom border from last row (2 cols) */
  .feature-card:nth-last-child(-n + 2) {
    border-bottom: none;
  }
}

@media (min-width: 960px) {
  /* Reset 2-col rules */
  .feature-card:nth-child(2n) {
    border-right: 1px solid rgba(20, 184, 166, 0.3);
  }

  .dark .feature-card:nth-child(2n) {
    border-right-color: rgba(45, 212, 191, 0.25);
  }

  .feature-card:nth-last-child(-n + 2) {
    border-bottom: 1px solid rgba(20, 184, 166, 0.3);
  }

  .dark .feature-card:nth-last-child(-n + 2) {
    border-bottom-color: rgba(45, 212, 191, 0.25);
  }

  /* Remove right border from last column (3 cols) */
  .feature-card:nth-child(3n) {
    border-right: none;
  }

  /* Remove bottom border from last row (3 cols) */
  .feature-card:nth-last-child(-n + 3) {
    border-bottom: none;
  }
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(20, 184, 166, 0.1) 0%,
    rgba(13, 148, 136, 0.05) 100%
  );
  color: var(--sley-teal-600);
}

.dark .feature-icon {
  background: linear-gradient(
    135deg,
    rgba(45, 212, 191, 0.15) 0%,
    rgba(20, 184, 166, 0.05) 100%
  );
  color: var(--sley-teal-400);
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.feature-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}

.feature-details {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
</style>
