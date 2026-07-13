<script setup lang="ts">
import type { ContentItem, ContentModuleIndex } from '../types/content';

interface Props {
  module: ContentModuleIndex;
  item: ContentItem;
}

defineProps<Props>();

const emit = defineEmits<{
  selectDate: [date: string];
}>();

function onSelectDate(event: Event) {
  emit('selectDate', (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <header class="article-head">
    <nav class="breadcrumb" aria-label="面包屑">
      <RouterLink to="/">首页</RouterLink>
      <span class="breadcrumb__sep">/</span>
      <RouterLink :to="`/${module.slug}`">{{ module.title }}</RouterLink>
      <span class="breadcrumb__sep">/</span>
      <span class="breadcrumb__current">{{ item.date }}</span>
    </nav>
    <div class="article-head__body">
      <h1 class="article-head__title">{{ item.title }}</h1>
      <div class="article-head__actions">
        <label class="date-picker">
          <select :value="item.date" @change="onSelectDate">
            <option v-for="entry in module.items" :key="entry.date" :value="entry.date">
              {{ entry.date }}
            </option>
          </select>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </label>
      </div>
    </div>
  </header>
</template>

<style scoped>
.article-head {
  max-width: none;
  margin: 0;
  padding: 16px 0 24px;
  border-bottom: 1px solid var(--line);
}

.article-head__body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 12px;
}

.article-head__title {
  margin: 0;
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.article-head__actions {
  flex-shrink: 0;
}

.date-picker {
  position: relative;
  display: block;
}

.date-picker select {
  appearance: none;
  min-height: 34px;
  padding: 0 32px 0 12px;
  color: var(--ink-soft);
  background: var(--canvas);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 200ms ease;
}

.date-picker select:hover {
  border-color: var(--brand);
}

.date-picker select:focus-visible {
  border-color: var(--brand);
  outline: none;
  box-shadow: 0 0 0 3px var(--brand-soft);
}

.date-picker svg {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  pointer-events: none;
  color: var(--muted);
}

@media (max-width: 640px) {
  .article-head__body {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .date-picker {
    width: 100%;
  }

  .date-picker select {
    width: 100%;
  }
}
</style>
