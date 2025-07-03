<template>
  <div class="p-6 space-y-6">
    <!-- Title & Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold">Heatmap</h1>
      <div class="flex flex-wrap gap-3">
        <!-- Session selector -->
        <select v-model="mode" class="border rounded-lg px-3 py-2 focus:ring-purple-500 focus:outline-none">
          <option value="session">By Session</option>
          <option disabled value="aggregate">Aggregate</option>
        </select>

        <!-- Date-range inputs (for future aggregate) -->
        <input v-model="startDate" type="date" class="border rounded-lg px-3 py-2 focus:ring-purple-500 focus:outline-none"/>
        <span class="self-center">–</span>
        <input v-model="endDate"   type="date" class="border rounded-lg px-3 py-2 focus:ring-purple-500 focus:outline-none"/>

        <button @click="loadHeatmap" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
          Apply
        </button>
      </div>
    </div>

    <!-- Heatmap canvas panel -->
    <div class="bg-white rounded-2xl shadow h-96 p-4">
 selectedSession     {{ mode}}
      <HeatmapCanvas
        :mode="mode"
        :session-id="selectedSession"
        :user-id="selectedUser"
        :start-date="startDate"
        :end-date="endDate"
        class="w-full h-full"
      />
    </div>

    <!-- Sessions list -->
    <div class="bg-white rounded-2xl shadow p-6 overflow-x-auto">
      <h2 class="text-xl font-semibold mb-4">Sessions</h2>
      <table class="min-w-full table-auto">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Session</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Intent</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Tier</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Last Activity</th>
            <th class="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="sess in sessions"
            :key="sess.sessionId"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3 text-purple-600 underline">
              <RouterLink :to="`/sessions/${sess.sessionId}`">
                {{ sess.sessionId?.slice(0, 12) }}…
              </RouterLink>
            </td>
            <td class="px-4 py-3">{{ sess.intentLevel }}</td>
            <td class="px-4 py-3">{{ sess.buyerTier }}</td>
            <td class="px-4 py-3">{{ formatDate(sess.lastTime) }}</td>
            <td class="px-4 py-3 text-right">
              <button
                @click="selectSession(sess.sessionId, sess.userId)"
                class="text-sm text-purple-600 hover:underline"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'
import HeatmapCanvas from '@/components/HeatmapCanvas.vue'
import { RouterLink } from 'vue-router'

interface Session {
  sessionId: string
  userId:    string
  lastTime:  string
  intentLevel: string
  buyerTier:   string
}

const mode            = ref<'session'|'aggregate'>('session')
const sessions        = ref<Session[]>([])
const selectedSession = ref<string|null>(null)
const selectedUser    = ref<string|null>(null)
const startDate       = ref(new Date(Date.now() - 6*86400e3).toISOString().slice(0,10))
const endDate         = ref(new Date().toISOString().slice(0,10))

/** Fetch your list of sessions */
async function loadSessions() {
  const { data } = await axios.get('/api/sessions')
  sessions.value = data.sessions
  if (sessions.value.length) {
    selectSession(sessions.value[0].sessionId, sessions.value[0].userId)
  }
}

/** Set current session + user, then reload heatmap */
function selectSession(sid: string, uid: string) {
  selectedSession.value = sid
  selectedUser.value    = uid
  loadHeatmap()
}

/** Just triggers the canvas to reload */
function loadHeatmap() {
  // HeatmapCanvas is watching props, so it will fetch + redraw
}

/** Friendly date formatting */
function formatDate(iso: string) {
  return format(new Date(iso), 'Pp')
}

onMounted(async () => {
  await loadSessions()
  loadHeatmap()
})
</script>
