<script setup lang="ts">
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

const renderedContent = computed(() => {
  const rawHtml = marked.parse(props.content) as string
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <article 
    class="prose prose-lg max-w-none markdown-body"
    v-html="renderedContent"
  />
</template>
