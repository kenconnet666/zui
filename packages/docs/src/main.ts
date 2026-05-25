import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import IconPage from './pages/IconPage.vue'
import ZButtonPage from './pages/components/ZButtonPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/components/icon', name: 'icon', component: IconPage },
    { path: '/components/button', name: 'button', component: ZButtonPage },
    // 兼容旧链接
    { path: '/icon', redirect: '/components/icon' },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
