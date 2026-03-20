<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="fixed top-4 left-4 right-4 z-50">
    <nav class="glass rounded-2xl shadow-lg px-6 py-4 max-w-6xl mx-auto">
      <div class="flex items-center justify-between">
        <router-link 
          to="/" 
          class="flex items-center gap-3 text-primary-700 hover:text-primary-600 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
          <span class="text-xl font-semibold font-mono">Notes</span>
        </router-link>

        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <router-link 
              to="/notes" 
              class="text-primary-600 hover:text-primary-500 transition-colors cursor-pointer font-medium"
            >
              笔记列表
            </router-link>
            <router-link 
              v-if="authStore.isAdmin"
              to="/new" 
              class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors cursor-pointer font-medium"
            >
              新建笔记
            </router-link>
            <div class="flex items-center gap-3 pl-4 border-l border-primary-200">
              <img 
                :src="authStore.user?.avatar_url" 
                :alt="authStore.user?.login"
                class="w-8 h-8 rounded-full ring-2 ring-primary-200"
              />
              <div class="hidden sm:block">
                <p class="text-sm font-medium text-primary-700">{{ authStore.user?.name || authStore.user?.login }}</p>
                <p v-if="authStore.isAdmin" class="text-xs text-accent-500">管理员</p>
              </div>
            </div>
            <button 
              @click="handleLogout"
              class="text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
              title="退出登录"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </template>
          <template v-else>
            <router-link 
              to="/login" 
              class="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer font-medium"
            >
              登录
            </router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>
