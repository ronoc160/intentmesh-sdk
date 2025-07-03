<template>
  <canvas ref="canvasRef" class="w-full h-6"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js'

// Register only what we need
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale)

// Props may be undefined, default to empty array
const props = defineProps<{
  data?: number[]
}>()

// Local reactive array
const dataArray = ref<number[]>(props.data ?? [])

// Canvas reference
const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// (Re)render the sparkline
function renderChart() {
  if (!canvasRef.value) return

  const labels = dataArray.value.map((_, i) => i.toString())

  if (chart) {
    // Update existing chart
    chart.data.labels = labels
    chart.data.datasets[0].data = dataArray.value
    chart.update()
  } else {
    // Initial render
    chart = new Chart(canvasRef.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: dataArray.value,
          borderColor: '#7C3AED',  // violet-600
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        elements: { line: { tension: 0.4 } }
      }
    })
  }
}

// Render on mount
onMounted(renderChart)

// Watch for prop changes
watch(
  () => props.data,
  (newData) => {
    dataArray.value = newData ?? []
    renderChart()
  }
)
</script>
