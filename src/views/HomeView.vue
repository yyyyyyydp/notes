<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToNotes = () => {
  if (authStore.isAuthenticated) {
    router.push('/notes')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto text-center">
    <div class="mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 mx-auto text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    </div>
    
    <h1 class="text-5xl font-bold text-primary-900 mb-6 font-mono">
      Notes Manager
    </h1>
    
    <p class="text-xl text-primary-600 mb-8 max-w-2xl mx-auto leading-relaxed">
      一个基于 GitHub 的笔记管理系统，支持 Markdown 格式，管理员可以创建、编辑和删除笔记。
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <button 
        @click="goToNotes"
        class="px-8 py-4 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors cursor-pointer font-semibold text-lg shadow-lg shadow-primary-200"
      >
        查看笔记
      </button>
      <a 
        href="https://github.com"
        target="_blank"
        class="px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer font-semibold text-lg border border-primary-200 shadow-lg"
      >
        <span class="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </span>
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <div class="glass-dark rounded-xl p-6 text-left">
        <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h3 class="font-semibold text-primary-800 mb-2">安全认证</h3>
        <p class="text-sm text-primary-600">使用 GitHub OAuth 进行安全认证，保护您的笔记内容</p>
      </div>

      <div class="glass-dark rounded-xl p-6 text-left">
        <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <h3 class="font-semibold text-primary-800 mb-2">Markdown 支持</h3>
        <p class="text-sm text-primary-600">完整的 Markdown 语法支持，让笔记格式更加丰富</p>
      </div>

      <div class="glass-dark rounded-xl p-6 text-left">
        <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <h3 class="font-semibold text-primary-800 mb-2">实时同步</h3>
        <p class="text-sm text-primary-600">笔记存储在 GitHub 仓库，自动同步更新</p>
      </div>
    </div>
  </div>
</template>
