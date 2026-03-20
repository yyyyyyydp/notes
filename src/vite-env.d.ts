/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_CLIENT_ID: string
  readonly VITE_GITHUB_CLIENT_SECRET: string
  readonly VITE_GITHUB_OWNER: string
  readonly VITE_GITHUB_REPO: string
  readonly VITE_GITHUB_BRANCH: string
  readonly VITE_NOTES_PATH: string
  readonly VITE_ADMIN_USERS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
