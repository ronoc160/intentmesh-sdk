<template>
  <div
    class="inline-flex items-center px-3 py-1 rounded-full font-medium text-white"
    :class="bgClass"
  >
    <span class="mr-2">{{ label }}</span>
    <span>{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string
  value: string | number
  color: 'green' | 'blue' | 'purple'
}>()

const bgClass = computed(() => {
  switch (props.color) {
    case 'green':  return 'bg-green-500'
    case 'blue':   return 'bg-blue-500'
    case 'purple': return 'bg-purple-500'
    default:       return 'bg-gray-500'
  }
})
</script>
