<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import type { ContentModuleIndex } from '../types/content';

interface Props {
  modules: readonly ContentModuleIndex[];
  activeSlug?: string;
}

defineProps<Props>();

const scrolled = shallowRef(false);

function onScroll() {
  scrolled.value = window.scrollY > 8;
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="site-header__inner">
      <RouterLink class="site-header__brand" to="/">
        <span class="site-header__logo" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="7" fill="currentColor" />
            <path
              d="M9 18V10L14 7L19 10V18L14 21L9 18Z"
              stroke="#fff"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
            <path
              d="M14 7V21M9 10L19 18M19 10L9 18"
              stroke="#fff"
              stroke-width="1"
              stroke-opacity=".4"
            />
          </svg>
        </span>
        <span class="site-header__name">AI Hub</span>
      </RouterLink>
      <nav class="site-header__nav" aria-label="内容模块">
        <RouterLink class="site-header__link" :class="{ 'is-active': !activeSlug }" to="/">
          首页
        </RouterLink>
        <RouterLink
          v-for="module in modules"
          :key="module.id"
          class="site-header__link"
          :class="{ 'is-active': activeSlug === module.slug }"
          :to="`/${module.slug}`"
        >
          {{ module.title }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: -80px;
  left: 16px;
  z-index: 100;
  padding: 8px 14px;
  color: #fff;
  background: var(--ink);
  border-radius: var(--radius-sm);
  font-size: 13px;
  transition: top 200ms ease;
}

.skip-link:focus {
  top: 8px;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
  transition: box-shadow 200ms ease;
}

.site-header.is-scrolled {
  box-shadow: var(--shadow-sm);
}

.site-header__inner {
  display: flex;
  width: min(var(--page-width), calc(100% - 40px));
  min-height: var(--header-height);
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.site-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--ink);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.02em;
}

.site-header__logo {
  display: flex;
  width: 30px;
  height: 30px;
  color: var(--brand);
  filter: drop-shadow(0 2px 8px rgba(35, 84, 224, 0.3));
}

.site-header__logo svg {
  width: 100%;
  height: 100%;
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.site-header__link {
  display: inline-flex;
  min-height: 32px;
  padding: 0 12px;
  align-items: center;
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.site-header__link:hover {
  color: var(--ink);
  background: var(--surface-2);
}

.site-header__link.is-active {
  color: var(--brand);
  background: var(--brand-soft);
  font-weight: 600;
  box-shadow: inset 0 0 0 1px var(--brand-light);
}

@media (max-width: 640px) {
  .site-header__inner {
    width: calc(100% - 24px);
    gap: 12px;
  }

  .site-header__brand {
    flex-shrink: 0;
  }

  .site-header__nav {
    flex: 1;
    min-width: 0;
    justify-content: flex-end;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .site-header__nav::-webkit-scrollbar {
    display: none;
  }

  .site-header__link {
    min-height: 36px;
    padding: 0 10px;
  }
}
</style>
