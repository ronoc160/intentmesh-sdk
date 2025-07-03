<template>
  <header class="h-16 flex items-center px-8 shadow bg-white sticky top-0 z-10">
    <div class="flex-1" />
    <!-- Optional: Search, Notification, Profile, etc. -->
    <div class="flex items-center space-x-4">
      <!-- <button class="focus:outline-none"><span class="material-symbols-outlined">search</span></button>
      <button class="focus:outline-none"><span class="material-symbols-outlined">notifications</span></button> -->
      <!-- <button @click="logout" class="focus:outline-none cursor-pointer"><span class="material-symbols-outlined">logout</span></button> -->
      <User class="w-8 h-8 text-gray-400" />

    </div>
  </header>
</template>

<script setup>
import { User } from 'lucide-vue-next'

</script>
