<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const notesStore = useNotesStore()
const authStore = useAuthStore()

const sortedNotes = computed(() => {
  return [...notesStore.notes].sort((a, b) => a.name.localeCompare(b.name))
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatSize = (bytes?: number) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const openNote = (path: string) => {
  router.push(`/notes/${encodeURIComponent(path)}`)
}

onMounted(() => {
  notesStore.fetchNotes()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-primary-900 font-mono">笔记列表</h1>
        <p class="text-primary-600 mt-1">共 {{ notesStore.noteCount }} 篇笔记</p>
      </div>
      <router-link 
        v-if="authStore.isAdmin"
        to="/new"
        class="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors cursor-pointer font-medium flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新建笔记
      </router-link>
    </div>

    <div v-if="notesStore.loading" class="text-center py-12">
      <svg class="w-8 h-8 mx-auto text-primary-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <p class="mt-4 text-primary-600">加载中...</p>
    </div>

    <div v-else-if="notesStore.notes.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-primary-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      <p class="mt-4 text-primary-500">暂无笔记</p>
      <router-link 
        v-if="authStore.isAdmin"
        to="/new"
        class="mt-4 inline-block text-primary-600 hover:underline"
      >
        创建第一篇笔记
      </router-link>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="note in sortedNotes"
        :key="note.path"
        @click="openNote(note.path)"
        class="glass-dark rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <h3 class="font-semibold text-primary-800 group-hover:text-primary-600 transition-colors truncate">
                {{ note.name.replace('.md', '') }}
              </h3>
            </div>
            <div class="mt-2 flex items-center gap-4 text-sm text-primary-500">
              <span v-if="note.size">{{ formatSize(note.size) }}</span>
              <span class="text-primary-300">.md</span>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
