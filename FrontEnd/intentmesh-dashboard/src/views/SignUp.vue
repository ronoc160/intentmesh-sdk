<!-- src/views/SignUp.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Create your account</h2>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label for="confirm" class="block text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            id="confirm"
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 rounded-lg transition duration-150"
        >
          Sign Up
        </button>
        <p v-if="error" class="mt-2 text-center text-sm text-red-600">{{ error }}</p>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-purple-700 hover:underline">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

const submit = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords don't match"
    return
  }

  try {
    await auth.signup(email.value, password.value)
    // after signup, redirect to dashboard (or login page)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Sign up failed'
  }
}
</script>

