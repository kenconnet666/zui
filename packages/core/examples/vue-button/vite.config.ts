import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

/** dev 时直吃 core 源码（无需先 build）。 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@kenconnet666/zui-core': resolve(__dirname, '../../src/index.ts'),
    },
  },
  server: {
    open: true,
  },
})
