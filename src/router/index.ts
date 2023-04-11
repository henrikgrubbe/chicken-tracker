import {createRouter, createWebHistory} from 'vue-router'
import {PassageUser} from '@passageidentity/passage-elements/passage-user'


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
      path: '/auth',
      name: 'auth',
      component: () => import('@/components/auth/AuthView.vue')
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

router.beforeEach(async (to, from) => {
  if (to.name === 'auth') {
    return true;
  }

  try {
    const authenticated = await new PassageUser().authGuard();
    if (authenticated) {
      return true;
    }
  } catch (e) {
    return {name: 'auth'};
  }

  return {name: 'auth'};
})

export default router;
