<template>
  <span
    class="inline-block px-2 py-0.5 text-sm font-medium rounded-full"
    :class="badgeClass"
  >{{ type }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ type: string }>()

const badgeClass = computed(() => {
  switch (props.type.toLowerCase()) {
    case 'high':   return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low':    return 'bg-blue-100 text-blue-800'
    case 'budget': return 'bg-teal-100 text-teal-800'
    case 'mid':    return 'bg-indigo-100 text-indigo-800'
    case 'premium':return 'bg-purple-100 text-purple-800'
    default:       return 'bg-gray-100 text-gray-800'
  }
})
</script>
