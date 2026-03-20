<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()
const notesStore = useNotesStore()

const fileName = ref('')
const content = ref('')
const saving = ref(false)
const error = ref('')

const createNote = async () => {
  error.value = ''
  
  if (!fileName.value.trim()) {
    error.value = '请输入文件名'
    return
  }
  
  if (!content.value.trim()) {
    error.value = '请输入笔记内容'
    return
  }

  const name = fileName.value.trim().endsWith('.md') 
    ? fileName.value.trim() 
    : `${fileName.value.trim()}.md`

  saving.value = true
  try {
    await notesStore.createNote(name, content.value)
    router.push('/notes')
  } catch (e) {
    error.value = e instanceof Error ? e.message : '创建失败'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center gap-4 mb-6">
      <router-link 
        to="/notes"
        class="p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold text-primary-900 font-mono">新建笔记</h1>
    </div>

    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
      {{ error }}
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-primary-700 mb-1">
          文件名
        </label>
        <div class="flex items-center">
          <input
            v-model="fileName"
            type="text"
            placeholder="note-name"
            class="flex-1 px-4 py-3 border border-primary-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-primary-900 font-mono"
          />
          <span class="px-4 py-3 bg-primary-100 text-primary-600 border border-l-0 border-primary-200 rounded-r-xl font-mono">
            .md
          </span>
        </div>
      </div>

      <MarkdownEditor v-model="content" placeholder="输入 Markdown 内容..." />

      <div class="flex justify-end gap-3">
        <router-link to="/notes">
          <AppButton variant="secondary">取消</AppButton>
        </router-link>
        <AppButton :loading="saving" @click="createNote">创建</AppButton>
      </div>
    </div>
  </div>
</template>
