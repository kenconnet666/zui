import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * docs 站点 vite 配置 —— 直接走 workspace symlink 到 zui-core / zui-vue 的 `src`，
 * 而不是 dist。这样改组件源码即时热更，无需先 build。
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@kenconnet666/zui-core': fileURLToPath(
        new URL('../core/src/index.ts', import.meta.url),
      ),
      '@kenconnet666/zui-vue': fileURLToPath(
        new URL('../ui-vue/src/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    port: 5174,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
})
