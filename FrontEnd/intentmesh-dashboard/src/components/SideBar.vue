<template>
  <aside class="bg-white w-67 h-screen fixed top-0 left-0 flex flex-col z-20">
    <!-- Brand -->
    <div class="p-6 flex items-center text-2xl font-bold text-purple-700 tracking-tight">
      <Cube class="w-6 h-6 mr-2" />
      <span>IntentMesh</span>
    </div>

    <nav class="flex-1 flex flex-col px-4 py-2">
      <!-- Main navigation -->
      <div class="space-y-1">
        <template v-for="item in mainNav" :key="item.label">
          <!-- Enabled item -->
          <RouterLink
            v-if="!item.comingSoon"
            :to="item.to"
            v-slot="{ isActive }"
          >
            <div
              :class="[
                'flex items-center py-3 px-3 rounded-lg font-medium transition cursor-pointer',
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.label }}</span>
            </div>
          </RouterLink>

          <!-- Coming Soon badge -->
          <div
            v-else
            class="flex items-center justify-between py-3 px-3 rounded-lg bg-gray-50 text-gray-400 cursor-default"
          >
            <div class="flex items-center opacity-60">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.label }}</span>
            </div>
            <span class="ml-2 text-xs font-semibold uppercase bg-purple-100 text-purple-700 rounded-full px-2 py-0.5">
              Coming Soon
            </span>
          </div>
        </template>
      </div>

      <!-- Logout pinned at bottom -->
      <div class="mt-auto pt-4">
        <template v-for="item in bottomNav" :key="item.label">
          <RouterLink
            :to="item.to"
            v-slot="{ isActive }"
            @click.native="item.to === '/logout' ? logout() : null"
          >
            <div
              :class="[
                'flex items-center py-3 px-3 rounded-lg font-medium transition cursor-pointer',
                isActive
                  ? 'bg-red-100 text-red-600'
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.label }}</span>
            </div>
          </RouterLink>
        </template>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Home, BarChart, Flame, Key, LogOut, Box } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// Main navigation items
const mainNav = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Sessions', to: '/sessions', icon: BarChart },
  { label: 'Heatmap', to: '/heatmap', icon: Flame, comingSoon: true },
  { label: 'API Keys', to: '/apikeys', icon: Key },
]


// Bottom (logout) navigation
const bottomNav = [
  { label: 'Logout', to: '/logout', icon: LogOut },
]

const logout = () => {
  authStore.logout()
}
</script>
