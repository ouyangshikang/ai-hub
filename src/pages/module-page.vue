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
  <SiteHeader :modules="modules" :active-slug="moduleIndex?.slug" />
  <main id="main-content" class="site-shell">
    <p v-if="loading" class="status-message" role="status">正在加载…</p>
    <p v-else-if="error" class="status-message status-message--error" role="alert">{{ error }}</p>
    <template v-else-if="moduleIndex">
      <nav class="breadcrumb" aria-label="面包屑">
        <RouterLink to="/">首页</RouterLink>
        <span class="breadcrumb__sep">/</span>
        <span class="breadcrumb__current">{{ moduleIndex.title }}</span>
      </nav>

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
    <p>AI Hub · 个人技术知识库 · 持续更新中</p>
  </footer>
</template>

<style scoped>
.archive-section {
  margin-top: 40px;
}

.section__head {
  margin-bottom: 20px;
}

.section__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}
</style>
