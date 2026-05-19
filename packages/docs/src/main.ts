import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/Home.vue'
import IconPage from './pages/Icon.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/icon', name: 'icon', component: IconPage },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
