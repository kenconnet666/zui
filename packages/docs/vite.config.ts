import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@kenconnet666/zui-core',
        replacement: fileURLToPath(new URL('../core/src/index.ts', import.meta.url)),
      },
      {
        find: '@kenconnet666/zui-vue',
        replacement: fileURLToPath(new URL('../ui-vue/src/index.ts', import.meta.url)),
      },
      // 只打包 web 常用语言（vue/ts/js/json/bash/html/css/tsx 等 ~15 种），
      // 去掉 fortran、qmldir、shellsession 等 200+ 个无用语法文件。
      // 精确匹配 `import('shiki')`，不影响 `shiki/themes/*` 等子路径导入。
      {
        find: /^shiki$/,
        replacement: 'shiki/bundle/web',
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
  },
})
