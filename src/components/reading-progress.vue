<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';

const progress = shallowRef(0);
let ticking = false;

function update() {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  progress.value = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    update();
    ticking = false;
  });
}

onMounted(() => {
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});
</script>

<template>
  <div
    class="reading-progress"
    role="progressbar"
    aria-label="阅读进度"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="reading-progress__bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  z-index: 15;
  height: 3px;
  pointer-events: none;
}

.reading-progress__bar {
  width: 100%;
  height: 100%;
  background: var(--brand-gradient);
  transform: scaleX(0);
  transform-origin: left;
}
</style>
