<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1.5 text-sm'
    case 'lg': return 'px-6 py-3 text-lg'
    default: return 'px-4 py-2'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary': 
      return 'bg-primary-100 text-primary-700 hover:bg-primary-200 border-primary-200'
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 border-red-500'
    default:
      return 'bg-primary-700 text-white hover:bg-primary-600 border-primary-700'
  }
})
</script>

<template>
  <button
    :class="[
      'rounded-lg font-medium transition-colors border cursor-pointer inline-flex items-center justify-center gap-2',
      sizeClasses,
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled || loading }
    ]"
    :disabled="disabled || loading"
  >
    <svg 
      v-if="loading" 
      class="w-4 h-4 animate-spin" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
    <slot />
  </button>
</template>
