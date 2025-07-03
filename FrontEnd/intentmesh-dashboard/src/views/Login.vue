<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <!-- Logo / Title -->
      <div class="flex justify-center mb-6">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 shadow-inner" />
          <span class="text-2xl font-semibold text-gray-800">Intent<span class="font-bold">Mesh</span></span>
        </div>
      </div>

      <!-- Welcome -->
      <h2 class="text-center text-2xl font-bold text-gray-700 mb-1">Sign in to your account</h2>
      <p class="text-center text-sm text-gray-500 mb-6">Start understanding your customers today</p>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Sign In
        </button>

        <p v-if="error" class="text-sm text-red-500 text-center mt-2">{{ error }}</p>
      </form>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-500">
        Don’t have an account?
        <RouterLink to="/signup" class="text-purple-600 hover:underline">Sign up</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const auth = useAuthStore();

const submit = async () => {
  error.value = "";
  try {
    await auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch (err: any) {
    error.value = err;
  }
};
</script>
