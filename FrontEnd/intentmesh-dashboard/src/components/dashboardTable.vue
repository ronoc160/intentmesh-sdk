<template>
  <div class="bg-white rounded-xl shadow p-4 mt-6">
    <h3 class="text-lg font-semibold mb-3">Buyer Tier & Intent Level Breakdown</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-sm">
            <th class="py-2 px-4 text-left">Buyer Tier</th>
            <th class="py-2 px-4 text-center">High Intent</th>
            <th class="py-2 px-4 text-center">Medium Intent</th>
            <th class="py-2 px-4 text-center">Low Intent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tier in tiers" :key="tier" class="hover:bg-gray-100 transition">
            <td class="py-2 px-4 font-medium text-gray-900">{{ tier }}</td>
            <td class="py-2 px-4 text-center text-purple-600 font-bold">{{ breakdown[tier]?.high || 0 }}</td>
            <td class="py-2 px-4 text-center text-blue-600 font-bold">{{ breakdown[tier]?.medium || 0 }}</td>
            <td class="py-2 px-4 text-center text-yellow-500 font-bold">{{ breakdown[tier]?.low || 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import axios from "axios"

const breakdown = ref<Record<string, any>>({})
const tiers = ["Budget", "Mid", "Premium"]

// onMounted(async () => {
//   const { data } = await axios.get("/api/breakdown") // or your actual endpoint!
//   breakdown.value = data
// })
</script>
