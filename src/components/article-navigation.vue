<script setup lang="ts">
import type { ContentItem } from '../types/content';

interface Props {
  moduleSlug: string;
  older?: ContentItem;
  newer?: ContentItem;
}

defineProps<Props>();
</script>

<template>
  <nav class="page-nav" aria-label="相邻内容">
    <RouterLink
      v-if="older"
      :to="`/${moduleSlug}/${older.date}`"
      class="page-nav__item page-nav__item--prev"
    >
      <span class="page-nav__dir">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13 8H4M7.5 4.5 4 8l3.5 3.5" />
        </svg>
        上一篇
      </span>
      <strong class="page-nav__title">{{ older.title }}</strong>
      <time class="page-nav__date">{{ older.date }}</time>
    </RouterLink>
    <span v-else />
    <RouterLink
      v-if="newer"
      :to="`/${moduleSlug}/${newer.date}`"
      class="page-nav__item page-nav__item--next"
    >
      <span class="page-nav__dir">
        下一篇
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
        </svg>
      </span>
      <strong class="page-nav__title">{{ newer.title }}</strong>
      <time class="page-nav__date">{{ newer.date }}</time>
    </RouterLink>
    <span v-else />
  </nav>
</template>

<style scoped>
.page-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: none;
  margin: 48px 0 0;
}

.page-nav__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-height: 88px;
  padding: 20px 24px;
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    transform 200ms ease;
}

.page-nav__item:hover {
  border-color: var(--brand-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.page-nav__item--next {
  align-items: flex-end;
  text-align: right;
}

.page-nav__dir {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  color: var(--brand);
  background: var(--brand-soft);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.page-nav__dir svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.page-nav__title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--ink);
  transition: color 200ms ease;
}

.page-nav__item:hover .page-nav__title {
  color: var(--brand);
}

.page-nav__date {
  color: var(--subtle);
  font-family: var(--font-mono);
  font-size: 11px;
}

@media (max-width: 640px) {
  .page-nav {
    grid-template-columns: 1fr;
  }

  .page-nav__item--next {
    align-items: flex-start;
    text-align: left;
  }
}
</style>
