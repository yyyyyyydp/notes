import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, NoteContent } from '@/types'
import { githubApi, decodeContent } from '@/services/github'
import { useAuthStore } from './auth'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const currentNote = ref<NoteContent | null>(null)
  const currentContent = ref<string>('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const noteCount = computed(() => notes.value.length)

  const fetchNotes = async () => {
    const authStore = useAuthStore()
    if (!authStore.token) return

    loading.value = true
    error.value = null
    try {
      notes.value = await githubApi.getNotes(authStore.token)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch notes'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchNote = async (path: string) => {
    const authStore = useAuthStore()
    if (!authStore.token) return

    loading.value = true
    error.value = null
    try {
      const note = await githubApi.getNote(authStore.token, path)
      currentNote.value = note
      currentContent.value = decodeContent(note.content)
      return note
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch note'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createNote = async (name: string, content: string) => {
    const authStore = useAuthStore()
    if (!authStore.token || !authStore.isAdmin) {
      throw new Error('Unauthorized: Admin access required')
    }

    loading.value = true
    error.value = null
    try {
      const result = await githubApi.createNote(authStore.token, name, content)
      await fetchNotes()
      return result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create note'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (path: string, content: string) => {
    const authStore = useAuthStore()
    if (!authStore.token || !authStore.isAdmin) {
      throw new Error('Unauthorized: Admin access required')
    }

    if (!currentNote.value) {
      throw new Error('No note loaded')
    }

    loading.value = true
    error.value = null
    try {
      const result = await githubApi.updateNote(
        authStore.token, 
        path, 
        content, 
        currentNote.value.sha
      )
      if (result.content) {
        currentNote.value = result.content
        currentContent.value = decodeContent(result.content.content)
      }
      return result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update note'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (path: string, sha: string) => {
    const authStore = useAuthStore()
    if (!authStore.token || !authStore.isAdmin) {
      throw new Error('Unauthorized: Admin access required')
    }

    loading.value = true
    error.value = null
    try {
      await githubApi.deleteNote(authStore.token, path, sha)
      notes.value = notes.value.filter(n => n.path !== path)
      if (currentNote.value?.path === path) {
        currentNote.value = null
        currentContent.value = ''
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete note'
      throw e
    } finally {
      loading.value = false
    }
  }

  const clearCurrentNote = () => {
    currentNote.value = null
    currentContent.value = ''
  }

  return {
    notes,
    currentNote,
    currentContent,
    loading,
    error,
    noteCount,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    clearCurrentNote
  }
})
