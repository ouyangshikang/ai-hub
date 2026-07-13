<script setup lang="ts">
import type { ContentItem } from "../types/content";

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
      <span class="page-nav__dir">← 上一篇</span>
      <strong class="page-nav__title">{{ older.title }}</strong>
      <time class="page-nav__date">{{ older.date }}</time>
    </RouterLink>
    <span v-else />
    <RouterLink
      v-if="newer"
      :to="`/${moduleSlug}/${newer.date}`"
      class="page-nav__item page-nav__item--next"
    >
      <span class="page-nav__dir">下一篇 →</span>
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
  max-width: calc(var(--content-width) + 248px);
  margin: 48px auto 0;
}

.page-nav__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 20px;
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;
}

.page-nav__item:hover {
  border-color: var(--brand-light);
  box-shadow: var(--shadow-sm);
}

.page-nav__item--next {
  text-align: right;
}

.page-nav__dir {
  color: var(--subtle);
  font-size: 11px;
  font-weight: 600;
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
    text-align: left;
  }
}
</style>
