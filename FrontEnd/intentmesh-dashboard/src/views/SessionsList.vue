<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Recent Sessions for {{ userId }}</h2>

    <div v-if="loading" class="py-8 text-center">Loading…</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <table v-else class="w-full bg-white shadow rounded-lg">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">Session ID</th>
          <th class="p-3 text-left">Last Active</th>
          <th class="p-3 text-left">Intent Level</th>
          <th class="p-3 text-left">Buyer Tier</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sessions" :key="s.sessionId" class="border-t hover:bg-gray-50">
          <td class="p-3 text-sm">{{ s.sessionId }}</td>
          <td class="p-3 text-sm">{{ s.timestamp }}</td>
          <td class="p-3 text-sm capitalize">{{ s.intentLevel }}</td>
          <td class="p-3 text-sm capitalize">{{ s.buyerTier }}</td>
          <td class="p-3 text-right">
            <RouterLink 
              :to="`/heatmap/${userId}/${s.sessionId}`" 
              class="text-purple-700 hover:underline text-sm"
            >
              View Heatmap
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route     = useRoute()
const userId    = route.params.id as string
const sessions  = ref<Array<any>>([])
const loading   = ref(true)
const error     = ref('')

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/users/${userId}/events`)
    sessions.value = data.sessions
  } catch (e: any) {
    error.value = e.response?.data?.error || e.message
  } finally {
    loading.value = false
  }
})
</script>
