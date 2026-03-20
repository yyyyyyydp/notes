<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import AppButton from '@/components/AppButton.vue'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const authStore = useAuthStore()

const isEditing = ref(false)
const editContent = ref('')
const saving = ref(false)
const deleting = ref(false)
const showDeleteConfirm = ref(false)

const notePath = computed(() => {
  const path = route.params.path as string
  return decodeURIComponent(path)
})

const noteTitle = computed(() => {
  const name = notesStore.currentNote?.name || ''
  return name.replace('.md', '')
})

const startEdit = () => {
  editContent.value = notesStore.currentContent
  isEditing.value = true
}

const cancelEdit = () => {
  editContent.value = ''
  isEditing.value = false
}

const saveEdit = async () => {
  if (!editContent.value.trim()) return
  
  saving.value = true
  try {
    await notesStore.updateNote(notePath.value, editContent.value)
    isEditing.value = false
  } catch (e) {
    alert(e instanceof Error ? e.message : '保存失败')
  } finally {
    saving.value = false
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const executeDelete = async () => {
  if (!notesStore.currentNote) return
  
  deleting.value = true
  try {
    await notesStore.deleteNote(notePath.value, notesStore.currentNote.sha)
    router.push('/notes')
  } catch (e) {
    alert(e instanceof Error ? e.message : '删除失败')
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}

onMounted(() => {
  notesStore.fetchNote(notePath.value)
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="notesStore.loading" class="text-center py-12">
      <svg class="w-8 h-8 mx-auto text-primary-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <p class="mt-4 text-primary-600">加载中...</p>
    </div>

    <template v-else-if="notesStore.currentNote">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <router-link 
            to="/notes"
            class="p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </router-link>
          <h1 class="text-2xl font-bold text-primary-900 font-mono">{{ noteTitle }}</h1>
        </div>
        
        <div v-if="authStore.isAdmin && !isEditing" class="flex items-center gap-2">
          <button
            @click="startEdit"
            class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
            title="编辑"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            @click="confirmDelete"
            class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="删除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="isEditing" class="space-y-4">
        <MarkdownEditor v-model="editContent" placeholder="输入 Markdown 内容..." />
        <div class="flex justify-end gap-3">
          <AppButton variant="secondary" @click="cancelEdit">取消</AppButton>
          <AppButton :loading="saving" @click="saveEdit">保存</AppButton>
        </div>
      </div>

      <div v-else class="glass rounded-2xl p-8 shadow-lg">
        <MarkdownRenderer :content="notesStore.currentContent" />
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-primary-500">笔记不存在</p>
      <router-link to="/notes" class="mt-4 inline-block text-primary-600 hover:underline">
        返回列表
      </router-link>
    </div>

    <div 
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
        <h3 class="text-lg font-semibold text-primary-900 mb-2">确认删除</h3>
        <p class="text-primary-600 mb-6">确定要删除这篇笔记吗？此操作不可撤销。</p>
        <div class="flex justify-end gap-3">
          <AppButton variant="secondary" @click="cancelDelete">取消</AppButton>
          <AppButton variant="danger" :loading="deleting" @click="executeDelete">删除</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
