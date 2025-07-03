<template>
  <div class="p-6 space-y-6">
    <!-- 1) Metrics Cards -->
    <h1 class="text-3xl font-bold mb-6">Sessions</h1>

    <div class="grid grid-cols-3 lg:grid-cols-5 gap-6">
      <DashboardCard :value="stats.total" label="Total Sessions" iconBg="bg-indigo-100">
        <template #icon>
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M4 12l6 6L20 6"></path>
          </svg>
        </template>
      </DashboardCard>

      <DashboardCard :value="stats.high" label="High Intent" iconBg="bg-green-100">
        <template #icon>
          <CheckBadgeIcon class="w-6 h-6 text-green-600" />
        </template>
      </DashboardCard>

      <DashboardCard :value="stats.medium" label="Medium Intent" iconBg="bg-yellow-100">
        <template #icon>
          <AdjustmentsHorizontalIcon class="w-6 h-6 text-yellow-600" />
        </template>
      </DashboardCard>

      <!-- KPI pill in sticky header instead? you can omit this if you move pills below -->
    </div>

    <!-- 2) Sticky Filters + Pills -->
    <div class="sticky top-0 bg-white z-20 p-4 shadow-sm rounded-md">
      <div class="flex flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
        <!-- date pickers -->
        <div class="flex space-x-2">
          <input type="date" v-model="filters.from" class="border rounded px-3 py-2" />
          <input type="date" v-model="filters.to" class="border rounded px-3 py-2" />
        </div>

        <!-- intent level multi-select (could be a dropdown) -->
        <MultiSelect v-model="filters.intentLevels" :options="['high', 'medium', 'low']" placeholder="Intent Level"
          class="w-40" />

        <!-- buyer tier multi-select -->
        <MultiSelect v-model="filters.buyerTiers" :options="['budget', 'mid', 'premium']" placeholder="Buyer Tier"
          class="w-40" />
        <!-- search -->
        <input v-model="filters.q" type="text" placeholder="Session or user…" class="flex-1 border rounded px-3 py-2" />

        <!-- KPI pills -->
        <!-- <div class="flex space-x-4">
          <KPIPill label="Avg Intent" :value="stats.avgIntent.toFixed(2)" color="green" />
          <KPIPill label="Avg Time (s)" :value="stats.avgTimeSec" color="blue" />
        </div> -->
      </div>
    </div>

    <!-- 3) Sessions Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Session</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">User</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Start</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Last</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Intent</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Tier</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Activity Trend</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="s in sessions" :key="s.sessionId" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-purple-600 underline">
              <RouterLink :to="`/sessions/${s.sessionId}`">
                {{ (s.sessionId ?? '').slice(0, 8) || '—' }}
              </RouterLink>
            </td>
            <td class="px-4 py-3 text-gray-700">{{ s.userId }}</td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(s.startTime) }}</td>
            <td class="px-4 py-3 text-gray-700">{{ formatDate(s.lastTime) }}</td>
            <td class="px-4 py-3">
              <Badge :type="s.intentLevel" />
            </td>
            <td class="px-4 py-3">
              <Badge :type="s.buyerTier" />
            </td>

            <td class="px-4 py-3 w-32 h-12">
              <!-- make sure each `session` object has an `activityCounts: number[]` -->
              <SessionSparkline :data="s.activityCounts" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- 4) Detail Cards Below -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <!-- <SessionSparkline :data="sessionsPerDay" label="Sessions / Day" /> -->
      <DonutChart :data="intentBreakdown" :labels="['High', 'Med', 'Low']" center-label="Intent" />
      <DonutChart :data="tierBreakdown" :labels="['Budget', 'Mid', 'Premium']" center-label="Tier" />
      <DashboardCard :value="sessions.length" label="Filtered Sessions" iconBg="bg-purple-100">
        <template #icon>
          <UsersIcon class="w-6 h-6 text-purple-600" />
        </template>
      </DashboardCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'
import DashboardCard from '@/components/DashboardCard.vue'
import KPIPill from '@/components/KPIPill.vue'
import MultiSelect from '@/components/MultiSelect.vue'
import SessionSparkline from '@/components/SessionSparkline.vue'
import DonutChart from '@/components/DonutChart.vue'
import Badge from '@/components/Badge.vue'



const sessions = ref<any[]>([])
const sessionsPerDay = ref<number[]>([])
const intentBreakdown = ref<number[]>([])
const tierBreakdown = ref<number[]>([])
const stats = ref<any>({ total: 0, high: 0, medium: 0, low: 0, avgIntent: 0, avgTimeSec: 0 })
const loading = ref(false)
const filters = ref({
  from: '',
  to: '',
  intentLevels: [] as string[],
  buyerTiers: [] as string[],
  q: '',
})

function formatDate(ts: string) {
  return new Date(ts).toLocaleString()
}

async function loadData() {
  try {
    loading.value = true
    const params = { ...filters.value }
    const { data } = await axios.get('/api/sessions', { params })

    sessions.value = data.sessions
    stats.value = data.stats
    sessionsPerDay.value = data.chart.sessionsPerDay
    intentBreakdown.value = data.chart.intent
    tierBreakdown.value = data.chart.tier
  } catch (error) {
    console.error('Failed to load sessions:', error)
  } finally {
    loading.value = false
  }

}

onMounted(loadData)
watch(
  () => filters.value,
  () => {
    loading.value = true
    loadData().finally(() => (loading.value = false))
  },
  { deep: true }
)
</script>
