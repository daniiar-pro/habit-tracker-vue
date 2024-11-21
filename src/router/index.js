import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/day/:date?',
      name: 'Habits',
      component: () => import('@/views/habits/HabitsView.vue'),
    },
    {
      path: '/calendar',
      name: 'Calendar',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/calendar/CalendarView.vue'),
    },
  ],
})

export default router
