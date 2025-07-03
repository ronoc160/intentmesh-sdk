// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    apiKey: '' as string,
    userId: '' as string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.apiKey,
    getToken: (state) => state.token,
    getApiKey: (state) => state.apiKey,
  },

  actions: {
    async signup(email: string, password: string) {
      // 1) call your signup endpoint
      const { data } = await axios.post('/auth/signup', { email, password })
      // 2) store token & apiKey
      this.token  = data.token
      this.apiKey = data.apiKey
      // 3) apply to axios for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      axios.defaults.headers.common['x-api-key']   = this.apiKey
      // 4) optionally save to localStorage
      localStorage.setItem('token', this.token)
      localStorage.setItem('apiKey', this.apiKey)
      // 5) redirect into the dashboard
      router.push('/dashboard')
    },

    async login(email: string, password: string) {
      const { data } = await axios.post('/auth/login', { email, password })
      this.token  = data.token
      this.apiKey = data.apiKey
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      axios.defaults.headers.common['x-api-key']   = this.apiKey
      localStorage.setItem('token', this.token)
      localStorage.setItem('apiKey', this.apiKey)
      router.push('/dashboard')
    },

    logout() {
      this.token = ''
      this.apiKey = ''
      delete axios.defaults.headers.common['Authorization']
      delete axios.defaults.headers.common['x-api-key']
      localStorage.removeItem('token')
      localStorage.removeItem('apiKey')
      router.push('/login')
    },

    // call on app startup to rehydrate from storage
    initializeFromStorage() {
      const t = localStorage.getItem('token')
      const k = localStorage.getItem('apiKey')
      if (t && k) {
        this.token = t
        this.apiKey = k
        axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
        axios.defaults.headers.common['x-api-key']   = k
      }
    },
  },
    persist: true,
})
