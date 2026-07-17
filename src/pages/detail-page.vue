<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleHeader from '../components/article-header.vue';
import ArticleNavigation from '../components/article-navigation.vue';
import HtmlRenderer from '../components/html-renderer.vue';
import MarkdownRenderer from '../components/markdown-renderer.vue';
import ReadingProgress from '../components/reading-progress.vue';
import SiteHeader from '../components/site-header.vue';
import { useContentIndex } from '../composables/use-content-index';

const route = useRoute();
const router = useRouter();
const { index, loading, error, ensureLoaded } = useContentIndex();
const modules = computed(() => index.value?.modules ?? []);
const moduleIndex = computed(() => modules.value.find((m) => m.slug === route.params.moduleSlug));
const itemIndex = computed(
  () => moduleIndex.value?.items.findIndex((item) => item.date === route.params.date) ?? -1
);
const item = computed(() =>
  itemIndex.value >= 0 ? moduleIndex.value?.items[itemIndex.value] : undefined
);
const newer = computed(() =>
  itemIndex.value > 0 ? moduleIndex.value?.items[itemIndex.value - 1] : undefined
);
const older = computed(() =>
  itemIndex.value >= 0 ? moduleIndex.value?.items[itemIndex.value + 1] : undefined
);

function selectDate(date: string) {
  if (moduleIndex.value && date) router.push(`/${moduleIndex.value.slug}/${date}`);
}

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
    return;
  }
  const target = event.target as HTMLElement | null;
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
  const slug = moduleIndex.value?.slug;
  if (!slug) return;
  if (event.key === 'ArrowLeft' && older.value) {
    router.push(`/${slug}/${older.value.date}`);
  } else if (event.key === 'ArrowRight' && newer.value) {
    router.push(`/${slug}/${newer.value.date}`);
  }
}

onMounted(() => {
  ensureLoaded();
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div class="page">
    <SiteHeader :modules="modules" :active-slug="moduleIndex?.slug" />
    <ReadingProgress v-if="moduleIndex && item" />
    <main id="main-content" class="detail">
      <div
        v-if="loading"
        class="detail__paper detail-skeleton"
        role="status"
        aria-label="正在加载内容"
      >
        <div class="skeleton skeleton--title" />
        <div v-for="i in 5" :key="i" class="skeleton skeleton--text" />
        <div class="skeleton skeleton--text detail-skeleton__short" />
      </div>
      <p v-else-if="error" class="status-message status-message--error" role="alert">
        {{ error }}
      </p>
      <template v-else-if="moduleIndex && item">
        <div class="detail__paper">
          <ArticleHeader :module="moduleIndex" :item="item" @select-date="selectDate" />

          <div class="detail__body">
            <MarkdownRenderer v-if="moduleIndex.renderer === 'markdown'" :src="item.contentPath" />
            <HtmlRenderer v-else :src="item.contentPath" :title="item.title" />
          </div>

          <ArticleNavigation :module-slug="moduleIndex.slug" :older="older" :newer="newer" />
        </div>
      </template>
      <section v-else class="empty-state">
        <p class="eyebrow">404</p>
        <h1>内容不存在</h1>
        <RouterLink v-if="moduleIndex" :to="`/${moduleIndex.slug}`"
          >查看 {{ moduleIndex.title }}</RouterLink
        >
        <RouterLink v-else to="/">返回首页</RouterLink>
      </section>
    </main>
    <footer class="site-footer">
      <p>AI Hub · AI 自动收集生成的技术内容 · 持续更新中</p>
    </footer>
  </div>
</template>

<style scoped>
.detail {
  width: min(var(--page-width), calc(100% - 40px));
  min-height: calc(100vh - 56px);
  margin: 0 auto;
  padding: 30px 0;
}

.detail__paper {
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 8px 40px 40px;
}

.detail__body {
  padding: 28px 0 0;
}

/* ── Loading Skeleton ── */
.detail-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 40px;
}

.detail-skeleton__short {
  width: 60%;
}

@media (max-width: 760px) {
  .detail {
    width: calc(100% - 24px);
    padding-bottom: 56px;
  }

  .detail__paper {
    padding: 8px 20px 28px;
    border-radius: var(--radius-md);
  }
}
</style>
