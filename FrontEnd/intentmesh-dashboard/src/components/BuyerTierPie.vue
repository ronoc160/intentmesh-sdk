<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip)

// — API data structure example: { labels: ['Evaluating', 'Ready To Buy'], data: [51, 17] }
const chartData = ref({ labels: [], data: [] })
const backgroundColors = ['#5D5FEF', '#6FE3E6']

// Fetch on mount
onMounted(async () => {
  const res = await axios.get('/api/buyer-tier-pie')
  chartData.value = res.data
})

// Prepare chart.js data format
const data = computed(() => ({
  labels: chartData.value.labels,
  datasets: [{
    data: chartData.value.data,
    backgroundColor: backgroundColors,
    borderWidth: 0,
  }]
}))

const options = {
  cutout: '72%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  }
}

// Calculate total and percent for each label
const total = computed(() =>
  chartData.value.data.reduce((a, b) => a + b, 0)
)
const percents = computed(() =>
  chartData.value.data.map(v =>
    total.value ? Math.round((v / total.value) * 100) : 0
  )
)
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6 flex flex-col items-center min-w-[240px] w-full max-w-xs">
    <h3 class="font-semibold text-xl mb-4 self-start">Buyer Tier Breakdown</h3>
    <div class="relative w-44 h-44 sm:w-52 sm:h-52 mb-6">
      <Doughnut :data="data" :options="options" />
      <!-- Center Label Overlay -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span class="text-4xl font-bold text-gray-900">
          {{ percents[0] || 0 }}%
        </span>
        <span class="text-lg text-gray-600 font-medium">
          {{ chartData.labels[0] || '' }}
        </span>
      </div>
    </div>
    <!-- Legend & Percentages -->
    <div class="w-full flex flex-col gap-2">
      <div v-for="(label, i) in chartData.labels" :key="i" class="flex items-center justify-between">
        <span class="flex items-center gap-2">
          <span class="w-4 h-4 rounded-full inline-block" :style="{ background: backgroundColors[i] }"></span>
          <span class="font-medium text-lg text-gray-800">{{ label }}</span>
        </span>
        <span class="font-semibold text-lg text-gray-900">{{ percents[i] || 0 }}%</span>
      </div>
    </div>
  </div>
</template>
