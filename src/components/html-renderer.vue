<script setup lang="ts">
import { nextTick, onBeforeUnmount, shallowRef, useTemplateRef } from 'vue';

interface Props {
  src: string;
  title: string;
}

defineProps<Props>();
const frame = useTemplateRef<HTMLIFrameElement>('frame');
const height = shallowRef('80vh');
let observer: ResizeObserver | null = null;

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
}

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <iframe
    ref="frame"
    class="html-frame"
    :src="src"
    :title="title"
    :style="{ height }"
    sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    @load="onLoad"
  />
</template>

<style scoped>
.html-frame {
  display: block;
  width: 100%;
  min-height: 80vh;
  border: 0;
}
</style>
