import {createRouter, createWebHistory} from 'vue-router'
import {PassageUser} from '@passageidentity/passage-elements/passage-user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/StatsView.vue')
    },
    {
      path: '/input',
      name: 'input',
      component: () => import('@/views/InputView.vue')
    },
    {
      path: '/log',
      name: 'log',
      component: () => import('@/views/LogView.vue')
    },
    {
      path: '/graphs',
      name: 'graphs',
      component: () => import('@/views/GraphsView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/stats'
    }
  ],
});

router.beforeEach(async (to, from) => {
  if (to.name !== 'input') {
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
