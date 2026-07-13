<script setup lang="ts">
import type { ContentModuleIndex } from "../types/content";

interface Props {
  modules: readonly ContentModuleIndex[];
}

defineProps<Props>();
</script>

<template>
  <div class="module-grid">
    <RouterLink
      v-for="module in modules"
      :key="module.id"
      class="module-card"
      :to="`/${module.slug}`"
    >
      <div class="module-card__head">
        <span class="module-card__icon">{{ module.theme.icon }}</span>
        <span class="module-card__count">{{ module.count }} 期</span>
      </div>
      <h3 class="module-card__title">{{ module.title }}</h3>
      <p class="module-card__desc">{{ module.description }}</p>
      <div class="module-card__foot">
        <span v-if="module.latestDate" class="module-card__date">{{
          module.latestDate
        }}</span>
        <span v-else class="module-card__date module-card__date--empty"
          >暂无内容</span
        >
        <svg class="module-card__arrow" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
        </svg>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.module-card {
  display: flex;
  flex-direction: column;
  padding: 28px;
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    transform 200ms ease;
}

.module-card:hover {
  border-color: var(--brand-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.module-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.module-card__icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: var(--brand);
  background: var(--brand-soft);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.module-card__count {
  color: var(--subtle);
  font-size: 14px;
  font-weight: 500;
}

.module-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.module-card__desc {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
  flex: 1;
}

.module-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
}

.module-card__date {
  color: var(--subtle);
  font-family: var(--font-mono);
  font-size: 13px;
}

.module-card__date--empty {
  font-family: var(--font-sans);
}

.module-card__arrow {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--subtle);
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    stroke 200ms ease,
    transform 200ms ease;
}

.module-card:hover .module-card__arrow {
  stroke: var(--brand);
  transform: translateX(3px);
}

@media (max-width: 760px) {
  .module-grid {
    grid-template-columns: 1fr;
  }
}
</style>
