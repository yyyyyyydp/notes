export interface GitHubUser {
  id: number
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

export interface Note {
  name: string
  path: string
  sha: string
  content?: string
  html_url?: string
  download_url?: string
  last_modified?: string
  size?: number
}

export interface NoteContent {
  name: string
  path: string
  sha: string
  content: string
  encoding: string
}

export interface CommitResponse {
  content: NoteContent | null
  commit: {
    sha: string
    html_url: string
  }
}

export interface AppConfig {
  repo: string
  owner: string
  branch: string
  notesPath: string
  adminUsers: string[]
}

export interface AuthState {
  token: string | null
  user: GitHubUser | null
  isAdmin: boolean
}
