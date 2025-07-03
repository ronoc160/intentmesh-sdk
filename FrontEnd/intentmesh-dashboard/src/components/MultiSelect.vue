<template>
  <div ref="root" class="relative inline-block w-64">
    <!-- Toggle button -->
    <button
      @click="toggleOpen"
      type="button"
      class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <span>
        <!-- custom label: if none selected, fallback to placeholder -->
        <template v-if="selectedLabels.length">
          {{ selectedLabels.join(', ') }}
        </template>
        <template v-else>
          {{ placeholder }}
        </template>
      </span>
      <svg
        class="w-4 h-4 transform transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown panel -->
    <transition name="fade">
      <ul
        v-show="isOpen"
        class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto"
      >
        <li
          v-for="opt in options"
          :key="opt"
          class="px-3 py-2 hover:bg-purple-50 flex items-center"
        >
          <input
            type="checkbox"
            :value="opt"
            v-model="localValue"
            class="form-checkbox h-4 w-4 text-purple-600"
            @change="onChange"
          />
          <label class="ml-2 text-gray-700">{{ opt }}</label>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string[]
  options: string[]
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void
}>()

// local copy of v-model
const localValue = ref<string[]>([...props.modelValue])

// open/closed state
const isOpen = ref(false)

// button label
const placeholder = props.placeholder || 'Select…'
const selectedLabels = computed(() => localValue.value)

// emit outwards when changed
function onChange() {
  emit('update:modelValue', [...localValue.value])
}

// toggle panel
function toggleOpen() {
  isOpen.value = !isOpen.value
}

// detect clicks outside to close panel
const root = ref<HTMLElement|null>(null)
function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})

// keep localValue in sync if parent changes it
watch(() => props.modelValue, v => {
  localValue.value = [...v]
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
