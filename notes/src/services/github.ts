import type { GitHubUser, Note, NoteContent, CommitResponse } from '@/types'
import { config, GITHUB_API_BASE } from '@/config'

const getHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json'
})

const handleApiError = async (response: Response, operation: string): never => {
  const errorData = await response.json().catch(() => ({}))
  const message = errorData.message || response.statusText
  throw new Error(`GitHub API ${operation} failed: ${message}`)
}

export const githubApi = {
  async getUser(token: string): Promise<GitHubUser> {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: getHeaders(token)
    })
    if (!response.ok) await handleApiError(response, 'getUser')
    return response.json()
  },

  async getNotes(token: string): Promise<Note[]> {
    const { owner, repo, branch, notesPath } = config
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${notesPath}?ref=${branch}`,
      { headers: getHeaders(token) }
    )
    if (!response.ok) {
      if (response.status === 404) return []
      await handleApiError(response, 'getNotes')
    }
    const data = await response.json()
    return Array.isArray(data) 
      ? data.filter((item: Note) => item.name.endsWith('.md'))
      : []
  },

  async getNote(token: string, path: string): Promise<NoteContent> {
    const { owner, repo, branch } = config
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers: getHeaders(token) }
    )
    if (!response.ok) await handleApiError(response, 'getNote')
    return response.json()
  },

  async createNote(token: string, name: string, content: string): Promise<CommitResponse> {
    const { owner, repo, branch, notesPath } = config
    const path = `${notesPath}/${name}`
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({
          message: `Create note: ${name}`,
          content: btoa(unescape(encodeURIComponent(content))),
          branch: branch
        })
      }
    )
    if (!response.ok) await handleApiError(response, 'createNote')
    return response.json()
  },

  async updateNote(token: string, path: string, content: string, sha: string): Promise<CommitResponse> {
    const { owner, repo, branch } = config
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({
          message: `Update note: ${path.split('/').pop()}`,
          content: btoa(unescape(encodeURIComponent(content))),
          sha: sha,
          branch: branch
        })
      }
    )
    if (!response.ok) await handleApiError(response, 'updateNote')
    return response.json()
  },

  async deleteNote(token: string, path: string, sha: string): Promise<void> {
    const { owner, repo, branch } = config
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'DELETE',
        headers: getHeaders(token),
        body: JSON.stringify({
          message: `Delete note: ${path.split('/').pop()}`,
          sha: sha,
          branch: branch
        })
      }
    )
    if (!response.ok) await handleApiError(response, 'deleteNote')
  }
}

export const decodeContent = (content: string): string => {
  return decodeURIComponent(escape(atob(content)))
}
