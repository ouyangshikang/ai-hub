<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';

const visible = shallowRef(false);

function onScroll() {
  visible.value = window.scrollY > 600;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <Transition name="back-top">
    <button
      v-if="visible"
      class="back-to-top"
      type="button"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--brand);
  border: 0;
  border-radius: 50%;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition:
    background 200ms ease,
    transform 200ms ease,
    box-shadow 200ms ease;
}

.back-to-top:hover {
  background: var(--brand-dark);
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.back-to-top svg {
  width: 18px;
  height: 18px;
}

.back-top-enter-active,
.back-top-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
  }
}
</style>
