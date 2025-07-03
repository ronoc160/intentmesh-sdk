// main.ts
import { createApp }     from 'vue'
import { createPinia }   from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App               from './App.vue'
import router            from './router'
import axios             from 'axios'
import { useAuthStore }  from '@/stores/auth'

import './assets/main.css'

// 1) configure Axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
axios.defaults.headers.post['Content-Type'] = 'application/json'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)

// 2) **Re-apply** any persisted auth headers before the first navigation
const auth = useAuthStore()
if (auth.apiKey) {
  axios.defaults.headers.common['x-api-key']   = auth.apiKey
  axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
}

app.use(router)
app.mount('#app')
