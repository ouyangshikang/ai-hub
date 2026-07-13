import { createRouter, createWebHistory } from 'vue-router';
import DetailPage from '../pages/detail-page.vue';
import HomePage from '../pages/home-page.vue';
import ModulePage from '../pages/module-page.vue';
import NotFoundPage from '../pages/not-found-page.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/:moduleSlug/:date', name: 'detail', component: DetailPage },
    { path: '/:moduleSlug', name: 'module', component: ModulePage },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
