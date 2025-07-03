<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import WelcomeItem from '@/components/WelcomeItem.vue'
import { useAuthStore } from '@/stores/auth'
import Sidebar from './components/SideBar.vue'
import HeaderBar from './components/Header.vue'
</script>

<template>
  <div>
    <Sidebar v-if="useAuthStore().isAuthenticated"></Sidebar>
    <div class="ml-64 min-h-screen flex flex-col bg-gray-50" >
      <HeaderBar v-if="useAuthStore().isAuthenticated"></HeaderBar>
      <main class=" flex-1 px-8 py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* if you have any global body padding/margin, reset it */
html,
body {
  margin: 0;
  padding: 0;
}
</style>
