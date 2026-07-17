<script setup lang="ts">
import BackToTop from './components/back-to-top.vue';
</script>

<template>
  <div class="app-root">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <BackToTop />
  </div>
</template>
