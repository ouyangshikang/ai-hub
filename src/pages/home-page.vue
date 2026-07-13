<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ModuleIndex from '../components/module-index.vue';
import ReleaseStream from '../components/release-stream.vue';
import SiteHeader from '../components/site-header.vue';
import { useContentIndex } from '../composables/use-content-index';

const { index, loading, error, ensureLoaded } = useContentIndex();
const modules = computed(() => index.value?.modules ?? []);
const recentItems = computed(() =>
  modules.value
    .flatMap((module) =>
      module.items.map((item) => ({
        item,
        moduleSlug: module.slug,
        moduleTitle: module.title,
        moduleMark: module.theme.icon,
      }))
    )
    .sort((a, b) => b.item.date.localeCompare(a.item.date))
    .slice(0, 10)
);
const latestUpdate = computed(() => recentItems.value[0]?.item.date);

onMounted(ensureLoaded);
</script>

<template>
  <SiteHeader :modules="modules" />
  <main id="main-content" class="site-shell">
    <!-- Hero -->
    <section class="hero">
      <div class="hero__text">
        <h1 class="hero__title">AI Hub</h1>
        <p class="hero__desc">
          个人技术知识库 — 持续记录 AI 前沿动态、Java 学习笔记与前端技术趋势。
        </p>
      </div>
      <div v-if="latestUpdate" class="hero__stat">
        <span class="hero__stat-label">最近更新</span>
        <time class="hero__stat-value" :datetime="latestUpdate">{{ latestUpdate }}</time>
      </div>
    </section>

    <p v-if="loading" class="status-message" role="status">正在加载内容…</p>
    <p v-else-if="error" class="status-message status-message--error" role="alert">{{ error }}</p>
    <template v-else>
      <!-- Modules -->
      <section class="section">
        <header class="section__head">
          <p class="section-label">栏目</p>
          <h2 class="section__title">内容栏目</h2>
        </header>
        <ModuleIndex :modules="modules" />
      </section>

      <!-- Latest -->
      <section class="section">
        <header class="section__head">
          <p class="section-label">最新</p>
          <h2 class="section__title">最新发布</h2>
        </header>
        <ReleaseStream :entries="recentItems" />
      </section>
    </template>
  </main>
  <footer class="site-footer">
    <p>AI Hub · 个人技术知识库 · 持续更新中</p>
  </footer>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding: 40px 0 48px;
}

.hero__title {
  margin: 0;
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--ink);
}

.hero__desc {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
  max-width: 52ch;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
  flex-shrink: 0;
}

.hero__stat-label {
  color: var(--subtle);
  font-size: 11px;
  font-weight: 500;
}

.hero__stat-value {
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
}

.section {
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

@media (max-width: 760px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 28px 0 36px;
  }

  .hero__stat {
    text-align: left;
  }

  .section {
    margin-top: 32px;
  }
}
</style>
