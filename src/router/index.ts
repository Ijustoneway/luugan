import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/calendar', name: 'calendar', component: () => import('../views/CalendarView.vue') },
    { path: '/diary/:date?', name: 'diary', component: () => import('../views/DiaryView.vue') },
    { path: '/timer', name: 'timer', component: () => import('../views/TimerView.vue') },
  ],
})

export default router
