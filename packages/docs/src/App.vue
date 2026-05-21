<script setup lang="ts">
/**
 * docs 站点根 —— 顶层挂 ZConfigProvider。
 *
 * 用 `zuiLight.extend({ ... })` 在运行时叠加 brand 色，类型层由 `zui.d.ts` 的
 * `UserColorExt` augmentation 同步扩展 `ZuiSchema.color` —— 任意组件 `:css` 回调
 * `(s) => { s.color._brandRoyal }` 即获得 IDE 补全 + 编译期校验。
 */
import { ZConfigProvider, zuiLight } from '@kenconnet666/zui-vue'

const myLight = zuiLight.extend({
  color: {
    brandRoyal: '#1a3a8f',
    brandSunset: '#ff7849',
    brandForest: '#1f7a3c',
  },
})
</script>

<template>
  <ZConfigProvider :theme="myLight">
    <div class="app-shell">
      <aside class="sidebar">
        <h1 class="brand">zui docs</h1>
        <nav>
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          <RouterLink to="/icon" class="nav-link">ZIcon</RouterLink>
        </nav>
      </aside>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </ZConfigProvider>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
}
.sidebar {
  background: #1f2937;
  color: #f9fafb;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.brand {
  font-size: 18px;
  margin: 0;
  letter-spacing: 0.04em;
}
.nav-link {
  display: block;
  padding: 8px 12px;
  color: #d1d5db;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
}
.nav-link:hover {
  background: #374151;
  color: #fff;
}
.nav-link.router-link-active {
  background: #2563eb;
  color: #fff;
}
.content {
  padding: 32px 40px;
  max-width: 1100px;
}
</style>
