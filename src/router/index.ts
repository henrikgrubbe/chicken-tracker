import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'input',
      component: () => import('@/components/input/InputView.vue')
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/components/stats/StatsView.vue')
    },
    {
      path: '/log',
      name: 'log',
      component: () => import('@/components/log/LogView.vue')
    },
  ],
});

export default router;
