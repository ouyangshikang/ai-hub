<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ArchiveList from '../components/archive-list.vue';
import ModuleOverview from '../components/module-overview.vue';
import SiteHeader from '../components/site-header.vue';
import { useContentIndex } from '../composables/use-content-index';

const route = useRoute();
const { index, loading, error, ensureLoaded } = useContentIndex();
const modules = computed(() => index.value?.modules ?? []);
const moduleIndex = computed(() => modules.value.find((m) => m.slug === route.params.moduleSlug));
const latestItem = computed(() => moduleIndex.value?.items[0]);

onMounted(ensureLoaded);
</script>

<template>
  <div class="page">
    <SiteHeader :modules="modules" :active-slug="moduleIndex?.slug" />
    <main id="main-content" class="site-shell">
      <div v-if="loading" class="module-skeleton" role="status" aria-label="正在加载内容">
        <div class="skeleton module-skeleton__hero" />
        <div class="module-skeleton__rows">
          <div v-for="i in 6" :key="i" class="skeleton module-skeleton__row" />
        </div>
      </div>
      <p v-else-if="error" class="status-message status-message--error" role="alert">
        {{ error }}
      </p>
      <template v-else-if="moduleIndex">
        <ModuleOverview :module="moduleIndex" :latest-item="latestItem" />

        <section class="archive-section">
          <header class="section__head">
            <p class="section-label">归档</p>
            <h2 class="section__title">全部内容</h2>
          </header>
          <ArchiveList :module-slug="moduleIndex.slug" :items="moduleIndex.items" />
        </section>
      </template>
      <section v-else class="empty-state">
        <p class="eyebrow">404</p>
        <h1>模块不存在</h1>
        <RouterLink to="/">返回首页</RouterLink>
      </section>
    </main>
    <footer class="site-footer">
      <p>AI Hub · AI 自动收集生成的技术内容 · 持续更新中</p>
    </footer>
  </div>
</template>

<style scoped>
.archive-section {
  margin-top: 48px;
}

/* ── Loading Skeleton ── */
.module-skeleton {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 28px;
}

.module-skeleton__hero {
  height: 180px;
  border-radius: var(--radius-lg);
}

.module-skeleton__rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-skeleton__row {
  height: 48px;
  border-radius: var(--radius-md);
}

.section__head {
  margin-bottom: 24px;
}

.section__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}

@media (max-width: 760px) {
  .archive-section {
    margin-top: 36px;
  }

  .section__title {
    font-size: 22px;
  }
}
</style>
