import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/NotesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notes/:path(.*)',
      name: 'note-detail',
      component: () => import('@/views/NoteDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/new',
      name: 'new-note',
      component: () => import('@/views/NewNoteView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('@/views/CallbackView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.user && authStore.token) {
    await authStore.initAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'notes' })
    return
  }

  next()
})

export default router
