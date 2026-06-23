import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 开发期直连 zadmin（context-path = /api/admin），统一经 Vite proxy 转发，规避 CORS 边界问题。
const ZADMIN_TARGET = 'http://localhost:19991'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      {
        find: '@kenconnet666/zui-core',
        replacement: fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
      },
      {
        find: '@kenconnet666/zui-vue',
        replacement: fileURLToPath(new URL('../ui-vue/src/index.ts', import.meta.url)),
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 5175, // 避开 docs(5174)
    open: false,
    proxy: {
      '/api/admin': { target: ZADMIN_TARGET, changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false, target: 'es2022' },
})
