<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textarea = ref<HTMLTextAreaElement | null>(null)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  localValue.value = target.value
  emit('update:modelValue', target.value)
}

const insertAtCursor = (before: string, after: string = '') => {
  if (!textarea.value) return
  const start = textarea.value.selectionStart
  const end = textarea.value.selectionEnd
  const selected = localValue.value.substring(start, end)
  const replacement = before + selected + after
  localValue.value = localValue.value.substring(0, start) + replacement + localValue.value.substring(end)
  emit('update:modelValue', localValue.value)
  setTimeout(() => {
    textarea.value?.setSelectionRange(start + before.length, start + before.length + selected.length)
    textarea.value?.focus()
  }, 0)
}

const formatBold = () => insertAtCursor('**', '**')
const formatItalic = () => insertAtCursor('*', '*')
const formatCode = () => insertAtCursor('`', '`')
const formatLink = () => insertAtCursor('[', '](url)')
const formatHeading = () => insertAtCursor('## ')
const formatList = () => insertAtCursor('- ')
const formatCodeBlock = () => insertAtCursor('\n```\n', '\n```\n')
</script>

<template>
  <div class="border border-primary-200 rounded-xl overflow-hidden bg-white">
    <div class="flex items-center gap-1 p-2 border-b border-primary-100 bg-primary-50">
      <button 
        @click="formatBold" 
        class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
        title="粗体"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
        </svg>
      </button>
      <button 
        @click="formatItalic" 
        class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
        title="斜体"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="4" x2="10" y2="4"/>
          <line x1="14" y1="20" x2="5" y2="20"/>
          <line x1="15" y1="4" x2="9" y2="20"/>
        </svg>
      </button>
      <button 
        @click="formatHeading" 
        class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
        title="标题"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12h8"/>
          <path d="M4 18V6"/>
          <path d="M12 18V6"/>
          <path d="m17 12 3-2v8"/>
        </svg>
      </button>
      <div class="w-px h-5 bg-primary-200 mx-1"></div>
      <button 
        @click="formatLink" 
        class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
        title="链接"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </button>
      <button 
        @click="formatCode" 
        class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
        title="行内代码"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      </button>
      <button 
        @click="formatCodeBlock" 
        class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
        title="代码块"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <polyline points="9 8 4 12 9 16"/>
          <polyline points="15 8 20 12 15 16"/>
        </svg>
      </button>
      <button 
        @click="formatList" 
        class="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
        title="列表"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      </button>
    </div>
    <textarea
      ref="textarea"
      :value="localValue"
      @input="handleInput"
      :placeholder="placeholder"
      class="w-full h-96 p-4 font-mono text-sm text-primary-900 resize-none focus:outline-none"
    />
  </div>
</template>
