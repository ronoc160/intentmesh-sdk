<template>
  <div class="w-full h-24">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement, PointElement,
  LinearScale, CategoryScale,
  Tooltip
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

const props = defineProps<{
  data: number[]
  label?: string
}>()

// build chartjs dataset
const chartData = {
  labels: props.data.map((_, i) => i.toString()),
  datasets: [
    {
      data: props.data,
      borderColor: '#7C3AED',
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      pointRadius: 0,
      tension: 0.3,
      fill: true,
    }
  ]
}

// sparkline options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { display: false },
    y: { display: false }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: false
    }
  },
  elements: {
    line: { borderWidth: 2 }
  }
}

// if `data` changes, re-render
watch(() => props.data, (newData) => {
  chartData.datasets[0].data = newData
})
</script>

<style scoped>
/* full bleed sparkline */
</style>
