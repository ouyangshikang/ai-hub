<script setup lang="ts">
import { computed } from "vue";
import type { ContentItem } from "../types/content";

interface Props {
  moduleSlug: string;
  items: readonly ContentItem[];
}

const props = defineProps<Props>();
const groups = computed(() => {
  const grouped = new Map<string, ContentItem[]>();
  for (const item of props.items) {
    const month = item.date.slice(0, 7);
    grouped.set(month, [...(grouped.get(month) ?? []), item]);
  }
  return [...grouped].map(([month, items]) => ({
    month,
    label: `${month.slice(0, 4)} 年 ${month.slice(5)} 月`,
    items,
  }));
});
</script>

<template>
  <div class="archive">
    <section v-for="group in groups" :key="group.month" class="archive__group">
      <div class="archive__group-label">
        <h3>{{ group.label }}</h3>
        <span>{{ group.items.length }} 期</span>
      </div>
      <div class="archive__group-list">
        <RouterLink
          v-for="item in group.items"
          :key="item.date"
          class="archive__item"
          :to="`/${moduleSlug}/${item.date}`"
        >
          <time :datetime="item.date">{{ item.date }}</time>
          <strong>{{ item.title }}</strong>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.archive {
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.archive__group {
  display: grid;
  grid-template-columns: 180px 1fr;
}

.archive__group + .archive__group {
  border-top: 1px solid var(--line);
}

.archive__group-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px;
  background: var(--surface);
  border-right: 1px solid var(--line);
}

.archive__group-label h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}

.archive__group-label span {
  color: var(--subtle);
  font-size: 13px;
}

.archive__group-list {
  display: flex;
  flex-direction: column;
}

.archive__item {
  display: grid;
  grid-template-columns: 100px 1fr 16px;
  align-items: center;
  gap: 16px;
  min-height: 48px;
  padding: 10px 24px;
  text-decoration: none;
  transition: background 200ms ease;
}

.archive__item + .archive__item {
  border-top: 1px solid var(--line);
}

.archive__item:hover {
  background: var(--surface);
}

.archive__item time {
  color: var(--subtle);
  font-family: var(--font-mono);
  font-size: 13px;
}

.archive__item strong {
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 200ms ease;
}

.archive__item:hover strong {
  color: var(--brand);
}

.archive__item svg {
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

.archive__item:hover svg {
  stroke: var(--brand);
  transform: translateX(2px);
}

@media (max-width: 760px) {
  .archive__group {
    grid-template-columns: 1fr;
  }

  .archive__group-label {
    flex-direction: row;
    justify-content: space-between;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 14px 16px;
  }

  .archive__item {
    padding: 12px 16px;
  }
}
</style>
