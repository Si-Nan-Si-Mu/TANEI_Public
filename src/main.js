import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

import './libs/loader.js'
import './libs/sakura.js'
import './libs/cursor.js'

import './styles/styles.css'
import './styles/login.css'
import './styles/agreement.css'
import './styles/theme-overrides.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const authStore = useAuthStore(pinia)
await authStore.hydrateSession()

app.use(router)
app.mount('#app')
