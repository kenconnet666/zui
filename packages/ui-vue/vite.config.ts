// 用 vitest/config 的 defineConfig：合并 vite + vitest 类型，
// 让本配置在 `test` 字段与 `build` 共存时不报 TS2769。
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

// 仅用于 vitest：把 @kenconnet666/zui-core 解析到 core 源码，
// 改 core/src 后 ui-vue 测试即时生效，无需先 build core。
// 注意：不能放到顶层 resolve.alias，否则 build 时会绕过下面的 external、
// 把 core 源码打进发布产物。test.alias 只在测试运行时附加，构建不受影响。
const coreSrc = fileURLToPath(new URL('../core/src/index.ts', import.meta.url))

/**
 * ui-vue 打包配置 —— 参考 core 的 preserveModules 风格：
 *
 * - 多 subpath 入口（. / provider / locale / composables），让用户精确 tree-shake。
 * - 关 minify，保留 JSDoc 与变量名。
 * - 所有 peer 依赖 external，不进 bundle。
 * - .vue SFC 走 vite-plugin-dts 输出 .d.ts（rollupTypes: false 保留目录结构）。
 */
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: [
        'vue',
        '@vue/shared',
        '@vue/runtime-core',
        '@vue/runtime-dom',
        '@kenconnet666/zui-core',
        /^@kenconnet666\/zui-core\//,
        '@emotion/css',
        '@emotion/unitless',
        '@floating-ui/vue',
        '@vueuse/core',
        '@vueuse/integrations',
        /^@vueuse\/integrations\//,
        'async-validator',
        'color2k',
        'date-fns',
        /^date-fns\//,
        'date-fns-tz',
        /^date-fns-tz\//,
        '@vicons/material',
        'qrcode',
        'shiki',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
    },
    sourcemap: true,
    target: 'es2022',
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      rollupTypes: false,
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      outDir: 'dist',
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    alias: {
      '@kenconnet666/zui-core': coreSrc,
    },
  },
})
