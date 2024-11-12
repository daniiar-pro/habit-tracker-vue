import { createRouter, createWebHistory } from 'vue-router'
import HabitsView from '../views/habits/HabitsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Habits',
      component: HabitsView,
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
