<!-- src/views/ApiKeysView.vue -->
<template>
    <div class="p-6">
        <!-- Title / Header -->
        <div class="flex  sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 class="text-3xl font-bold">API Key Management</h1>
            <div class="mt-4 sm:mt-0">

                <button @click="regenerateKey" title="feature not currently available" :disabled="!loading"
                    class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition">
                    Regenerate
                </button>
            </div>
        </div>
        <!-- Key input + Copy button -->
        <div class="flex flex-row space-x-4 mb-8">
            <div class="relative flex-1">
                <input readonly :value="apiKey"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-32 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                <button @click="copyKey" :class="[
                    'absolute right-2 cursor-pointer top-1/2 transform -translate-y-1/2 border rounded-lg px-4 py-2 transition',
                    copied
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                ]">
                    {{ copied ? 'Copied!' : 'Copy' }}
                </button>
            </div>
        </div>

        <!-- Info panels -->
        <div class="grid grid-cols-2 gap-6 mb-8">
            <!-- What is an API key? -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-2">What is an API key?</h2>
                <p class="text-gray-600">
                    An API key is a unique identifier used to authenticate requests to the IntentMesh SDK.
                    Include it in your integration to securely track user interactions and intent on your site.
                </p>
            </div>
            <!-- Docs panel -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between">
                <h2 class="text-xl font-semibold mb-4">Read Integration Docs</h2>
                <a href="https://docs.intentmesh.com" target="_blank"
                    class="mt-auto inline-block bg-white border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition text-center">
                    View Docs →
                </a>
            </div>
        </div>
        <h1 class="text-3xl font-bold mb-4">Setup</h1>

        <!-- Code snippet -->
        <div class="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm overflow-auto">
            <pre><code>
            $ npm install intentmesh-sdk
            $ yarn add intentmesh-sdk

            import { init } from 'intentmesh-sdk'

            init({
            apiKey: 'sk_your_public_key_here',
            priceSelectors: ['.price'],
            clickSelectors: ['.add-to-cart', '.btn-cta'],
            userId: window.CURRENT_USER_ID
            })
        </code></pre>
        </div>

    </div>



</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Tooltip from '@/components/ToolTip.vue'

const apiKey = ref<string>('')
const loading = ref(false)
const copied = ref(false)
function maskedKey(): string {
    // keep first 6 & last 4 chars, ellipsis in between
    if (apiKey.value.length > 10) {
        return apiKey.value.slice(0, 6) + '…' + apiKey.value.slice(-4)
    }
    return apiKey.value
}

async function loadKey() {
    loading.value = true
    try {
        const { data } = await axios.get<{ apiKey: string }>('/api/apikey')
        apiKey.value = data.apiKey
        console.log('API Key loaded:', apiKey.value)
    } finally {
        loading.value = false
    }
}

async function copyKey() {
    await navigator.clipboard.writeText(apiKey.value)
    copied.value = true
    // reset after a bit
    setTimeout(() => (copied.value = false), 2000)
}

async function regenerateKey() {
    if (!confirm('Are you sure you want to regenerate your API key?')) return
    loading.value = true
    try {
        const { data } = await axios.post<{ apiKey: string }>('/api/apikey/regenerate')
        apiKey.value = data.apiKey
    } finally {
        loading.value = false
    }
}

onMounted(loadKey)
</script>

<style scoped>
/* nothing extra – all via Tailwind */
</style>
