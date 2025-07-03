import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '../views/Login.vue'
import DashboardView from '../views/DashboardView.vue'
import SignUp from '@/views/SignUp.vue'
import SessionsList from '@/views/SessionsList.vue'
import HeatmapView from '@/views/HeatmapView.vue' 
import ApiKeysView from '@/views/ApiKeys.vue'
import SessionsView from '@/views/SessionsView.vue'
const routes = [
  {
    path: '/users/:id/sessions',
    component: SessionsList,
    meta: { requiresAuth: true },
  },
  {
    path: '/heatmap/',
    component: HeatmapView,
    meta: { requiresAuth: true },
  },
  { path: '/login', component: Login },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/signup', component: SignUp },
  { path: '/sessions', component: SessionsView, meta: { requiresAuth: true } },
  { path: '/apikeys', component: ApiKeysView, meta: { requiresAuth: true } },

  
  { path: '/', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
