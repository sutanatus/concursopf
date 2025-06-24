import { createApp } from 'vue'
import App from './App.vue'
import axiosPlugin from './plugins/axios'
import router from './router' 

const app = createApp(App)

app.use(router) 

app.use(axiosPlugin, {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://seu-backend-producao.com/api' 
    : '/api',
  timeout: 15000
})

app.mount('#app')
