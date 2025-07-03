<template>
    <div class="bg-white rounded-2xl shadow group p-6 flex flex-col transition hover:shadow-xl">
        <div class="flex items-center justify-between w-full mb-4">
            <div class="flex items-center gap-2">
                <div :class="['flex items-center justify-center w-12 h-12 rounded-xl', iconBg]">
                    <slot name="icon" />
                </div>
                <span class="text-lg font-bold text-gray-800">{{ label }}</span>
            </div>
            <slot name="tooltip" />
        </div>
        <span class="text-2xl font-bold text-gray-800 mb-1">{{ value }}</span>
        <slot />
    </div>
</template>
<script setup lang="ts">
defineProps<{
    value?: string | number
    label?: string
    iconBg?: string // eg. "bg-indigo-50"
}>()
</script>
