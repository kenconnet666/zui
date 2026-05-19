// 用 vitest/config 的 defineConfig：它合并了 vite + vitest 的类型，
// 让本配置文件里同时含 `build` / `plugins` / `test` / `benchmark` 字段时
// TypeScript 不报 TS2769（vite 自己的 defineConfig 不识别 test 字段）。
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

/**
 * 0.7.0 改造：preserveModules + 关 minify + 多 subpath exports。
 *
 * 旧版（单 bundle minified 75kB）→ 新版（多目录、保留 JSDoc、subpath 友好）：
 * - 用户 Ctrl+Click 跳转直接看到原结构 + 完整 JSDoc
 * - subpath import：`import { ... } from '@kenconnet666/zui-core/variants'`
 * - tree-shake 更精确（ESM 静态分析）
 *
 * 多入口：
 * - `src/index.ts`          → `dist/index.js`（主入口）
 * - `src/variants/index.ts` → `dist/variants/index.js`
 * - `src/preset/index.ts`   → `dist/preset/index.js`
 * - `src/dev/index.ts`      → `dist/dev/index.js`
 *
 * 配 `preserveModules` 让其它非入口文件按原结构平铺到 dist/ 下，
 * 让 IDE go-to-definition / 阅读源码体验完整。
 */
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'variants/index': 'src/variants/index.ts',
        'preset/index': 'src/preset/index.ts',
        'dev/index': 'src/dev/index.ts',
      },
      formats: ['es'],
    },
    // ★ 关 minify：保留 JSDoc + 变量名，让 dist 可读
    minify: false,
    rollupOptions: {
      // peer 与 runtime dep 都不打进 bundle
      external: ['@emotion/css', '@emotion/css/create-instance', 'csstype', 'color2k'],
      output: {
        // ★ preserveModules：每个源文件独立 chunk，保留 src/ 目录结构
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
    dts({
      // ★ 不再 rollup 成单文件；每个 src/*.ts 输出对应的 .d.ts
      rollupTypes: false,
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*.ts'],
      outDir: 'dist',
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    benchmark: {
      include: ['bench/**/*.bench.ts'],
      // 注：vitest 4 的 BenchmarkUserOptions 移除了 environment 字段；
      // bench 默认就是 node 环境（不走 test.environment 的 happy-dom），无需配置。
    },
  },
})
