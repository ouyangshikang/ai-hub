<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ArticleHeader from '../components/article-header.vue';
import ArticleNavigation from '../components/article-navigation.vue';
import HtmlRenderer from '../components/html-renderer.vue';
import MarkdownRenderer from '../components/markdown-renderer.vue';
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

onMounted(ensureLoaded);
</script>

<template>
  <SiteHeader :modules="modules" :active-slug="moduleIndex?.slug" />
  <main id="main-content" class="detail">
    <p v-if="loading" class="status-message" role="status">正在加载…</p>
    <p v-else-if="error" class="status-message status-message--error" role="alert">{{ error }}</p>
    <template v-else-if="moduleIndex && item">
      <ArticleHeader :module="moduleIndex" :item="item" @select-date="selectDate" />

      <div class="detail__body">
        <MarkdownRenderer v-if="moduleIndex.renderer === 'markdown'" :src="item.contentPath" />
        <HtmlRenderer v-else :src="item.contentPath" :title="item.title" />
      </div>

      <ArticleNavigation :module-slug="moduleIndex.slug" :older="older" :newer="newer" />
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
    <p>AI Hub · 个人技术知识库 · 持续更新中</p>
  </footer>
</template>

<style scoped>
.detail {
  width: min(var(--page-width), calc(100% - 40px));
  min-height: calc(100vh - 56px);
  margin: 0 auto;
  padding: 0 0 80px;
}

.detail__body {
  padding: 28px 0 0;
}

@media (max-width: 760px) {
  .detail {
    width: calc(100% - 24px);
    padding-bottom: 56px;
  }

  .detail__body {
    padding-top: 20px;
  }
}
</style>
