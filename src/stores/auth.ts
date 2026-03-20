import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GitHubUser, AuthState } from '@/types'
import { config } from '@/config'
import { githubApi } from '@/services/github'

const TOKEN_KEY = 'github_token'
const USER_KEY = 'github_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<GitHubUser | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  )
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
  const isAdmin = computed(() => {
    if (!user.value) return false
    return config.adminUsers.includes(user.value.login)
  })

  const setAuth = (newToken: string, newUser: GitHubUser) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const fetchUser = async (authToken: string) => {
    loading.value = true
    error.value = null
    try {
      const userData = await githubApi.getUser(authToken)
      setAuth(authToken, userData)
      return userData
    } catch (e) {
      clearAuth()
      error.value = e instanceof Error ? e.message : 'Failed to fetch user'
      throw e
    } finally {
      loading.value = false
    }
  }

  const login = async (authToken: string) => {
    return fetchUser(authToken)
  }

  const logout = () => {
    clearAuth()
  }

  const initAuth = async () => {
    if (token.value && !user.value) {
      try {
        await fetchUser(token.value)
      } catch {
        // Token invalid, already cleared
      }
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initAuth
  }
})
