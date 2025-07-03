<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  LineElement, PointElement,
  LinearScale, CategoryScale,
  Filler
} from 'chart.js'
import axios from 'axios'

ChartJS.register(
  Title, Tooltip, Legend,
  LineElement, PointElement,
  LinearScale, CategoryScale,
  Filler
)

const rawData = ref<any>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await axios.get('/api/intent-timeseries')
    rawData.value = res.data
  } catch (e: any) {
    error.value = e.message || 'Error loading intent trend'
  } finally {
    loading.value = false
  }
})

const chartData = computed(() => {
  if (!rawData.value) return {
    labels: [],
    datasets: []
  }
  return {
    labels: rawData.value.dates,
    datasets: [
      {
        label: 'High Intent',
        data: rawData.value.high,
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124,58,237,0.09)',
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Medium Intent',
        data: rawData.value.medium,
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56,189,248,0.09)',
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Low Intent',
        data: rawData.value.low,
        borderColor: '#F59E42',
        backgroundColor: 'rgba(245,158,66,0.08)',
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#fff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      titleColor: '#111827',
      bodyColor: '#4B5563'
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6B7280', font: { size: 14 } }
    },
    y: {
      grid: { color: '#F3F4F6' },
      beginAtZero: true,
      ticks: { color: '#6B7280', font: { size: 14 } }
    }
  },
  elements: { line: { borderWidth: 4 } }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6 w-full min-w-[340px]">
    <h3 class="text-xl font-bold mb-3">Intent Level Over Time</h3>
    <div class="w-full h-[240px] sm:h-[320px]">
      <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
      <div v-else class="text-gray-400 flex items-center justify-center h-full">No data yet</div>
    </div>
    <!-- Custom Legend -->
    <div class="flex flex-col sm:flex-row sm:space-x-8 mt-6 space-y-2 sm:space-y-0">
      <div class="flex items-center space-x-2">
        <span class="inline-block w-6 h-1 rounded bg-violet-600"></span>
        <span class="text-gray-700 text-lg">High</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-block w-6 h-1 rounded bg-sky-400"></span>
        <span class="text-gray-700 text-lg">Medium</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-block w-6 h-1 rounded bg-orange-400"></span>
        <span class="text-gray-700 text-lg">Low</span>
      </div>
    </div>
  </div>
</template>
