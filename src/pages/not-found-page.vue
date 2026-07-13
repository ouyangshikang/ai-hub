<script setup lang="ts">
import { computed, onMounted } from 'vue';
import SiteHeader from '../components/site-header.vue';
import { useContentIndex } from '../composables/use-content-index';

const { index, ensureLoaded } = useContentIndex();
const modules = computed(() => index.value?.modules ?? []);

onMounted(ensureLoaded);
</script>

<template>
  <SiteHeader :modules="modules" />
  <main id="main-content" class="site-shell empty-state">
    <p class="eyebrow">404</p>
    <h1>页面不存在</h1>
    <RouterLink to="/">返回首页</RouterLink>
  </main>
  <footer class="site-footer">
    <p>AI Hub · 个人技术知识库 · 持续更新中</p>
  </footer>
</template>
