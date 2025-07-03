<template>
  <div class="relative">
    <canvas ref="cvs" class="w-36 h-36"></canvas>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-2xl font-bold">{{ centerPercent }}</span>
      <span class="text-sm text-gray-600">{{ centerLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, ArcElement, Tooltip } from 'chart.js'

Chart.register(ArcElement, Tooltip)

const props = defineProps<{
  data: number[]
  labels: string[]
  centerLabel?: string
}>()

const cvs = ref<HTMLCanvasElement>()
let chart: Chart

const total = computed(() => props.data.reduce((sum, n) => sum + n, 0))
const centerIndex = computed(() => props.data.findIndex(n => n === Math.max(...props.data)))
const centerPercent = computed(() => total.value
  ? `${Math.round((props.data[centerIndex.value] / total.value) * 100)}%`
  : '0%'
)

onMounted(() => {
  chart = new Chart(cvs.value!, {
    type: 'doughnut',
    data: { labels: props.labels, datasets: [{ data: props.data, backgroundColor: ['#7C3AED','#38BDF8','#22D3EE'] }] },
    options: { cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
  })
})

watch(() => props.data, v => {
  chart.data.datasets![0].data = v
  chart.update()
})
</script>
