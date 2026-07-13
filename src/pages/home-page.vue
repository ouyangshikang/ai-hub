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
const totalItems = computed(() => modules.value.reduce((sum, m) => sum + m.count, 0));

onMounted(ensureLoaded);
</script>

<template>
  <SiteHeader :modules="modules" />
  <main id="main-content" class="site-shell">
    <!-- Hero -->
    <section class="hero">
      <h1 class="hero__title">AI Hub</h1>
      <p class="hero__desc">个人技术知识库 — 持续记录 AI 前沿动态、Java 学习笔记与前端技术趋势。</p>
      <div class="hero__stats">
        <div v-if="latestUpdate" class="hero__stat">
          <span class="hero__stat-value">{{ latestUpdate }}</span>
          <span class="hero__stat-label">最近更新</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-value">{{ modules.length }}</span>
          <span class="hero__stat-label">内容栏目</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-value">{{ totalItems }}</span>
          <span class="hero__stat-label">期内容</span>
        </div>
      </div>
    </section>

    <p v-if="loading" class="status-message" role="status">正在加载内容…</p>
    <p v-else-if="error" class="status-message status-message--error" role="alert">
      {{ error }}
    </p>
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
  padding: 48px 0 0;
}

.hero__title {
  margin: 0;
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--ink);
}

.hero__desc {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.7;
  max-width: 56ch;
}

.hero__stats {
  display: flex;
  gap: 40px;
  margin-top: 32px;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero__stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--font-mono);
}

.hero__stat-label {
  color: var(--subtle);
  font-size: 13px;
}

.section {
  margin-top: 48px;
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
  .hero {
    padding: 32px 0 0;
  }

  .hero__stats {
    gap: 24px;
    flex-wrap: wrap;
  }

  .section {
    margin-top: 36px;
  }

  .section__title {
    font-size: 22px;
  }
}
</style>
