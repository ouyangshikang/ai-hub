<script setup lang="ts">
import { nextTick, onBeforeUnmount, shallowRef, useTemplateRef, watch } from 'vue';

interface Props {
  src: string;
  title: string;
}

const props = defineProps<Props>();
const frame = useTemplateRef<HTMLIFrameElement>('frame');
const height = shallowRef('80vh');
const loaded = shallowRef(false);
let observer: ResizeObserver | null = null;

watch(
  () => props.src,
  () => {
    loaded.value = false;
    height.value = '80vh';
  }
);

function resize() {
  const doc = frame.value?.contentDocument;
  if (!doc) return;
  height.value = `${Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight ?? 0)}px`;
}

function disableScroll() {
  const doc = frame.value?.contentDocument;
  if (!doc) return;
  const style = doc.createElement('style');
  style.textContent = 'html, body { overflow: hidden !important; }';
  doc.head?.appendChild(style);
}

async function onLoad() {
  await nextTick();
  disableScroll();
  resize();
  const body = frame.value?.contentDocument?.body;
  if (body && 'ResizeObserver' in window) {
    observer?.disconnect();
    observer = new ResizeObserver(resize);
    observer.observe(body);
  }
  loaded.value = true;
}

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="html-reader">
    <div v-if="!loaded" class="html-reader__loading" role="status">
      <span class="html-reader__spinner" aria-hidden="true" />
      <span>正在加载内容…</span>
    </div>
    <iframe
      ref="frame"
      class="html-frame"
      :class="{ 'html-frame--ready': loaded }"
      :src="src"
      :title="title"
      :style="{ height }"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      @load="onLoad"
    />
  </div>
</template>

<style scoped>
.html-reader {
  position: relative;
  width: 100%;
}

.html-reader__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 80vh;
  color: var(--muted);
  font-size: 14px;
}

.html-reader__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--brand-soft);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.html-frame {
  display: block;
  width: 100%;
  min-height: 80vh;
  border: 0;
  opacity: 0;
  transition: opacity 200ms ease;
}

.html-frame--ready {
  opacity: 1;
}
</style>
