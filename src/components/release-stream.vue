<script setup lang="ts">
import type { ContentItem } from '../types/content';

interface ReleaseEntry {
  item: ContentItem;
  moduleSlug: string;
  moduleTitle: string;
  moduleMark: string;
}

interface Props {
  entries: readonly ReleaseEntry[];
}

defineProps<Props>();
</script>

<template>
  <div class="release-list">
    <RouterLink
      v-for="entry in entries"
      :key="`${entry.moduleSlug}-${entry.item.date}`"
      class="release-row"
      :to="`/${entry.moduleSlug}/${entry.item.date}`"
    >
      <span class="release-row__icon">{{ entry.moduleMark }}</span>
      <span class="release-row__module">{{ entry.moduleTitle }}</span>
      <time class="release-row__date" :datetime="entry.item.date">{{ entry.item.date }}</time>
      <span class="release-row__title">{{ entry.item.title }}</span>
      <svg class="release-row__arrow" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
      </svg>
    </RouterLink>
  </div>
</template>

<style scoped>
.release-list {
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.release-row {
  position: relative;
  display: grid;
  grid-template-columns: 36px 110px 100px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 16px;
  min-height: 56px;
  padding: 10px 24px;
  color: var(--ink);
  text-decoration: none;
  transition: background 200ms ease;
}

.release-row::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: var(--brand);
  transform: scaleY(0);
  transition: transform 200ms ease;
}

.release-row + .release-row {
  border-top: 1px solid var(--line);
}

.release-row:hover {
  background: var(--brand-soft);
}

.release-row:hover::before {
  transform: scaleY(1);
}

.release-row__icon {
  display: inline-flex;
  width: 34px;
  height: 30px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--brand);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(35, 84, 224, 0.2);
}

.release-row__module {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.release-row__date {
  color: var(--subtle);
  font-family: var(--font-mono);
  font-size: 13px;
}

.release-row__title {
  overflow: hidden;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 200ms ease;
}

.release-row:hover .release-row__title {
  color: var(--brand);
}

.release-row__arrow {
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

.release-row:hover .release-row__arrow {
  stroke: var(--brand);
  transform: translateX(2px);
}

@media (max-width: 760px) {
  .release-row {
    grid-template-columns: 32px minmax(0, 1fr) auto 16px;
    grid-template-areas:
      'icon module date arrow'
      'icon title title arrow';
    gap: 4px 12px;
    min-height: auto;
    padding: 14px 16px;
  }

  .release-row__icon {
    grid-area: icon;
    align-self: center;
  }

  .release-row__module {
    grid-area: module;
  }

  .release-row__date {
    grid-area: date;
    justify-self: end;
  }

  .release-row__title {
    grid-area: title;
    white-space: normal;
  }

  .release-row__arrow {
    grid-area: arrow;
    align-self: center;
  }
}
</style>
