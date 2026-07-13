import { createApp } from 'vue'
import App from './app-root.vue'
import { router } from './router'
import './styles/main.css'

createApp(App).use(router).mount('#app')
