<!-- <template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
        <div v-if="loading" class="text-center py-12">Loading…</div>
        <div v-else-if="error" class="text-red-600 text-center py-12">{{ error }}</div>
        <div v-else>

            <div class="max-w-7xl mx-auto px-4 py-8">
                <div class="grid grid-cols-3 gap-6 mb-8"> 
                    <div
                        class="relative bg-white rounded-xl shadow group p-6 overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                        <span class="absolute left-0 top-0 h-full w-1 bg-[#7400e0]"></span>
                        <div class="text-xs uppercase text-gray-400 mb-1">Total Sessions</div>
                        <div class="text-4xl font-bold text-gray-900">{{ stats.total }}</div>
                    </div>
                    <div
                        class="relative bg-white rounded-xl shadow group p-6 overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                        <span class="absolute left-0 top-0 h-full w-1 bg-[#00b4d8]"></span>
                        <div class="text-xs uppercase text-gray-400 mb-1">Intent Levels</div>
                        <div class="mt-2 space-y-1 text-gray-700">
                            <div><span class="inline-block w-2 h-2 rounded-full bg-[#7400e0] mr-2"></span>High: {{
                                stats.intentLevel.high }}</div>
                            <div><span class="inline-block w-2 h-2 rounded-full bg-[#00b4d8] mr-2"></span>Medium: {{
                                stats.intentLevel.medium }}</div>
                            <div><span class="inline-block w-2 h-2 rounded-full bg-gray-300 mr-2"></span>Low: {{
                                stats.intentLevel.low }}</div>
                        </div>
                    </div>
                    <div
                        class="relative bg-white rounded-xl shadow group p-6 overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                        <span class="absolute left-0 top-0 h-full w-1 bg-[#00d09c]"></span>
                        <div class="text-xs uppercase text-gray-400 mb-1">Buyer Tiers</div>
                        <div class="mt-2 space-y-1 text-gray-700">
                            <div><span class="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>Budget: {{
                                stats.buyerTier.budget }}</div>
                            <div><span class="inline-block w-2 h-2 rounded-full bg-[#00b4d8] mr-2"></span>Mid: {{
                                stats.buyerTier.mid }}</div>
                            <div><span class="inline-block w-2 h-2 rounded-full bg-[#7400e0] mr-2"></span>Premium: {{
                                stats.buyerTier.premium }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <UsersList :users="users" />

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import UsersList from '@/components/UserList.vue' 
interface Stats {
    total: number
    intentLevel: { high: number; medium: number; low: number }
    buyerTier: { premium: number; mid: number; budget: number }
}

const stats = ref<Stats>({
    total: 0,
    intentLevel: { high: 0, medium: 0, low: 0 },
    buyerTier: { premium: 0, mid: 0, budget: 0 },
})

const loading = ref(true)
const error = ref('')

// Users data
const users = ref<string[]>([])
const usersLoading = ref(true)
const usersError = ref('')

onMounted(async () => {
    // 1) fetch stats
    try {
        const { data } = await axios.get<Stats>('/api/stats')
        stats.value = data
    } catch (e: any) {
        error.value = e.response?.data?.error || e.message || 'Unable to load stats'
    } finally {
        loading.value = false
    }

    // 2) fetch users
    try {
        const { data } = await axios.get<{ users: string[] }>('/api/users')
        users.value = data.users
    } catch (e: any) {
        usersError.value = e.response?.data?.error || e.message || 'Unable to load users'
    } finally {
        usersLoading.value = false
    }
})
</script> -->

<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
        <div class="grid md:grid-cols-3 gap-6 mb-8">

            <!-- Total Sessions -->
            <DashboardCard :value="stats.total" label="Total Sessions" iconBg="bg-purple-100">
                <template #icon>
                    <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path d="M3 7h18M3 12h18M3 17h18"></path>
                    </svg>
                </template>
                <template #tooltip>
                    <Tooltip text="Total number of tracked user sessions in your application." />
                </template>
            </DashboardCard>

            <!-- Intent Level Breakdown -->
            <DashboardCard :value="intentPercent" label="Intent Level Breakdown" iconBg="bg-indigo-100">
                <template #icon>
                    <svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path d="M4 12l6 6L20 6"></path>
                    </svg>
                </template>
                <template #tooltip>
                    <Tooltip text="Current count of users who have been active in the last 24 hours." />
                </template>
                <ul class="flex justify-between mt-2 space-y-1 text-sm">
                    <li class="flex justify-between mr-[5px]" v-for="(count, key) in stats.intentLevel" :key="key">
                        <span class="capitalize text-gray-500">{{ key }}:</span>
                        <span class="ml-1 font-semibold text-gray-700">{{ count }}</span>
                    </li>
                </ul>
            </DashboardCard>

            <!-- Active Users -->
            <DashboardCard :value="activeUsers" label="Active Users" iconBg="bg-cyan-100">
                <template #icon>
                    <svg class="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M6 21v-2a4 4 0 014-4h0a4 4 0 014 4v2"></path>
                    </svg>
                </template>
                <template #tooltip>
                    <Tooltip text="Shows the breakdown of session intent levels based on user actions." />
                </template>
            </DashboardCard>
        </div>
        <div class="grid md:grid-cols-2 gap-8 mt-8">
            <IntentLineChart />
            <!-- You can add another chart or summary card here -->
            <BuyerTierPie />
        </div>
        <!-- You can add more cards or chart components here! -->
    </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import IntentLineChart from '@/components/IntentLineChart.vue'
import BuyerTierPie from '@/components/BuyerTierPie.vue'
import Tooltip from '@/components/ToolTip.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const stats = ref({
    total: 0,
    intentLevel: { high: 0, medium: 0, low: 0 }
})

const activeUsers = ref(0) // Replace with real data if available

const intentPercent = computed(() => {
    const total = stats.value.intentLevel.high + stats.value.intentLevel.medium + stats.value.intentLevel.low
    if (!total) return "0%"
    return Math.round((stats.value.intentLevel.high / total) * 100) + "%"
})

onMounted(async () => {
    const { data } = await axios.get('/api/stats')
    stats.value = data
    // Example: Fetch active users (update to your API)
    // const { data: users } = await axios.get('/api/active-users')
    // activeUsers.value = users.count
})
</script>
