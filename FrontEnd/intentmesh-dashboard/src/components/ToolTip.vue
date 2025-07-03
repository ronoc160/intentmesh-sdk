<template>
  <div class="relative group">
    <svg class="w-5 h-5 text-gray-400 cursor-pointer ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="13" fill="#888">?</text>
    </svg>
    <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 min-w-[180px] bg-gray-900 text-white text-xs rounded shadow-lg p-2 z-50 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-normal">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>
