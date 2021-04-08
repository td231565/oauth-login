import { createApp } from 'vue'
import App from './App.vue'
import store from '@/common/store'

const app = createApp(App)
app.use(store)
app.mount('#app')