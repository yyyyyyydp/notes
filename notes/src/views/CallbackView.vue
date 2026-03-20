<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { GITHUB_TOKEN_URL } from '@/config'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const error = ref('')
const loading = ref(true)

const exchangeCodeForToken = async (code: string) => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
  const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth 配置不完整')
  }

  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    })
  })

  if (!response.ok) {
    throw new Error('Token 交换失败')
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(data.error_description || data.error)
  }
  
  return data.access_token
}

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const storedState = sessionStorage.getItem('oauth_state')

  if (!code) {
    error.value = '未收到授权码'
    loading.value = false
    return
  }

  if (state !== storedState) {
    error.value = '状态验证失败'
    loading.value = false
    return
  }

  sessionStorage.removeItem('oauth_state')

  try {
    const token = await exchangeCodeForToken(code)
    await authStore.login(token)
    const redirect = route.query.redirect as string
    router.push(redirect || '/notes')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败'
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-md mx-auto">
    <div class="glass rounded-2xl p-8 shadow-xl text-center">
      <div v-if="loading" class="py-8">
        <svg class="w-12 h-12 mx-auto text-primary-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p class="mt-4 text-primary-600">正在处理登录...</p>
      </div>

      <div v-else-if="error" class="py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <p class="mt-4 text-red-600">{{ error }}</p>
        <router-link to="/login" class="mt-4 inline-block text-primary-600 hover:underline">
          返回登录
        </router-link>
      </div>
    </div>
  </div>
</template>
