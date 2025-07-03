<!-- src/components/UsersTable.vue -->
<template>
  <div class="bg-white rounded-xl shadow p-6 overflow-x-auto">
    <h2 class="text-lg font-semibold mb-4">Users</h2>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">API Key</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="user in users" :key="user.id">
          <td class="px-4 py-2 font-medium text-gray-800">{{ user.email }}</td>
          <td class="px-4 py-2 font-mono text-xs text-purple-700 break-all">{{ user.apiKey }}</td>
        </tr>
        <tr v-if="!users.length">
          <td colspan="2" class="text-gray-400 text-center py-6">No users found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: string
  email: string
  apiKey: string
}
const props = defineProps<{ users: User[] }>()
</script>
