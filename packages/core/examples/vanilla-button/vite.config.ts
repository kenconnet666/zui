import { defineConfig } from 'vite'
import { resolve } from 'node:path'

/**
 * 让 example 直接消费同 workspace 里的 core 源码（不需要先 build），保证 demo 跟 src 实时同步。
 */
export default defineConfig({
  resolve: {
    alias: {
      '@kenconnet666/zui-core': resolve(__dirname, '../../src/index.ts'),
    },
  },
  server: {
    open: true,
  },
})
