<script setup lang="ts">
import type { ContentItem, ContentModuleIndex } from '../types/content';

interface Props {
  module: ContentModuleIndex;
  latestItem?: ContentItem;
}

defineProps<Props>();
</script>

<template>
  <header class="module-hero">
    <div class="module-hero__head">
      <span class="module-hero__icon">{{ module.theme.icon }}</span>
      <h1 class="module-hero__title">{{ module.title }}</h1>
    </div>
    <p class="module-hero__desc">{{ module.description }}</p>
    <div class="module-hero__stats">
      <div class="module-hero__stat">
        <span class="module-hero__stat-num">{{ module.count }}</span>
        <span class="module-hero__stat-label">期</span>
      </div>
      <div v-if="module.latestDate" class="module-hero__stat">
        <span class="module-hero__stat-num">{{ module.latestDate }}</span>
        <span class="module-hero__stat-label">最近更新</span>
      </div>
    </div>
    <RouterLink
      v-if="latestItem"
      class="module-hero__latest"
      :to="`/${module.slug}/${latestItem.date}`"
    >
      <div class="module-hero__latest-info">
        <span class="module-hero__latest-label">最新一期</span>
        <strong class="module-hero__latest-title">{{ latestItem.title }}</strong>
      </div>
      <div class="module-hero__latest-meta">
        <span class="module-hero__latest-date">{{ latestItem.date }}</span>
        <span class="module-hero__latest-cta">
          阅读
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </span>
      </div>
    </RouterLink>
  </header>
</template>

<style scoped>
.module-hero {
  padding: 28px 0 0;
}

.module-hero__head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.module-hero__icon {
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--brand);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(35, 84, 224, 0.25);
}

.module-hero__title {
  margin: 0;
  font-size: clamp(36px, 5vw, 48px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.module-hero__desc {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.7;
  max-width: 60ch;
}

.module-hero__stats {
  display: flex;
  gap: 40px;
  margin-top: 24px;
}

.module-hero__stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.module-hero__stat-num {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--font-mono);
}

.module-hero__stat-label {
  color: var(--subtle);
  font-size: 14px;
}

.module-hero__latest {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 28px;
  padding: 20px 24px;
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    transform 200ms ease;
}

.module-hero__latest:hover {
  border-color: var(--brand-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.module-hero__latest-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.module-hero__latest-label {
  color: var(--brand);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.module-hero__latest-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 200ms ease;
}

.module-hero__latest:hover .module-hero__latest-title {
  color: var(--brand);
}

.module-hero__latest-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.module-hero__latest-date {
  color: var(--subtle);
  font-family: var(--font-mono);
  font-size: 13px;
}

.module-hero__latest-cta {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: var(--brand);
  background: var(--brand-soft);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition:
    background 200ms ease,
    color 200ms ease;
}

.module-hero__latest:hover .module-hero__latest-cta {
  background: var(--brand);
  color: #fff;
}

.module-hero__latest-cta svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 200ms ease;
}

.module-hero__latest:hover svg {
  transform: translateX(2px);
}

@media (max-width: 640px) {
  .module-hero__latest {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 18px;
  }

  .module-hero__latest-title {
    white-space: normal;
  }

  .module-hero__latest-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
