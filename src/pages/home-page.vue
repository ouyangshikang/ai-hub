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
      <div class="hero__panel">
        <h1 class="hero__title">AI Hub</h1>
        <p class="hero__desc">
          AI 自动收集生成的技术内容 — 涵盖 AI 前沿动态、给前端的 Java 学习笔记与前端技术趋势。
        </p>
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
    <p>AI Hub · AI 自动收集生成的技术内容 · 持续更新中</p>
  </footer>
</template>

<style scoped>
.hero {
  padding: 32px 0 0;
}

.hero__panel {
  padding: 40px 36px;
  background: linear-gradient(135deg, #2354e0 0%, #3b6ff0 50%, #5b7ef0 100%);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(35, 84, 224, 0.18);
}

.hero__title {
  margin: 0;
  font-size: clamp(36px, 5.5vw, 56px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #fff;
}

.hero__desc {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  line-height: 1.7;
  max-width: 56ch;
}

.hero__stats {
  display: flex;
  gap: 32px;
  margin-top: 28px;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 20px 12px 0;
}

.hero__stat + .hero__stat {
  padding-left: 32px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.hero__stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-mono);
}

.hero__stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.section {
  margin-top: 40px;
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
    padding: 20px 0 0;
  }

  .hero__panel {
    padding: 28px 24px;
  }

  .hero__stats {
    gap: 20px;
    flex-wrap: wrap;
  }

  .hero__stat + .hero__stat {
    padding-left: 20px;
  }

  .section {
    margin-top: 32px;
  }

  .section__title {
    font-size: 22px;
  }
}
</style>
