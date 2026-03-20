<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAuthUrl } from '@/config'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const clientId = ref(import.meta.env.VITE_GITHUB_CLIENT_ID || '')
const manualToken = ref('')
const error = ref('')

const initiateGitHubLogin = () => {
  if (!clientId.value) {
    error.value = 'GitHub Client ID 未配置'
    return
  }
  const redirectUri = `${window.location.origin}/callback`
  const state = Math.random().toString(36).substring(7)
  sessionStorage.setItem('oauth_state', state)
  window.location.href = getAuthUrl(clientId.value, redirectUri, state)
}

const loginWithToken = async () => {
  if (!manualToken.value.trim()) {
    error.value = '请输入 GitHub Token'
    return
  }
  try {
    await authStore.login(manualToken.value.trim())
    const redirect = route.query.redirect as string
    router.push(redirect || '/notes')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败'
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/notes')
  }
})
</script>

<template>
  <div class="max-w-md mx-auto">
    <div class="glass rounded-2xl p-8 shadow-xl">
      <div class="text-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-primary-600 mb-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <h1 class="text-2xl font-bold text-primary-900">登录</h1>
        <p class="text-primary-600 mt-2">使用 GitHub 账号登录</p>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {{ error }}
      </div>

      <button
        v-if="clientId"
        @click="initiateGitHubLogin"
        class="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer font-medium flex items-center justify-center gap-2 mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        使用 GitHub 登录
      </button>

      <div v-if="clientId" class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-primary-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-primary-500">或者</span>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-primary-700 mb-1">
            GitHub Personal Access Token
          </label>
          <input
            v-model="manualToken"
            type="password"
            placeholder="ghp_xxxx..."
            class="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900"
            @keyup.enter="loginWithToken"
          />
          <p class="text-xs text-primary-500 mt-1">
            需要 repo 权限
            <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" class="text-primary-600 hover:underline">
              创建 Token
            </a>
          </p>
        </div>

        <button
          @click="loginWithToken"
          :disabled="authStore.loading"
          class="w-full py-3 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors cursor-pointer font-medium disabled:opacity-50"
        >
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>
  </div>
</template>
