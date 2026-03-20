<script setup lang="ts">
</script>

<template>
  <div class="max-w-md mx-auto text-center py-12">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 mx-auto text-primary-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <h1 class="text-2xl font-bold text-primary-900 mt-6">页面未找到</h1>
    <p class="text-primary-600 mt-2">您访问的页面不存在</p>
    <router-link 
      to="/" 
      class="mt-6 inline-block px-6 py-3 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors cursor-pointer font-medium"
    >
      返回首页
    </router-link>
  </div>
</template>
