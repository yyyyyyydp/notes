import type { AppConfig } from '@/types'

export const config: AppConfig = {
  repo: import.meta.env.VITE_GITHUB_REPO || 'notes',
  owner: import.meta.env.VITE_GITHUB_OWNER || '',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
  notesPath: import.meta.env.VITE_NOTES_PATH || 'notes',
  adminUsers: (import.meta.env.VITE_ADMIN_USERS || '').split(',').filter(Boolean)
}

export const GITHUB_API_BASE = 'https://api.github.com'
export const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize'
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

export const getAuthUrl = (clientId: string, redirectUri: string, state: string) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo',
    state: state,
    response_type: 'code'
  })
  return `${GITHUB_AUTH_URL}?${params.toString()}`
}
