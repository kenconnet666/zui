// 用 vitest/config 的 defineConfig：它合并了 vite + vitest 的类型，
// 让本配置文件里同时含 `build` / `plugins` / `test` / `benchmark` 字段时
// TypeScript 不报 TS2769（vite 自己的 defineConfig 不识别 test 字段）。
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

/**
 * preserveModules + 关 minify + 单一入口。
 *
 * 单 bundle minified → 多目录、保留 JSDoc：
 * - 用户 Ctrl+Click 跳转直接看到原结构 + 完整 JSDoc
 * - tree-shake 精确（ESM 静态分析 + preserveModules 文件级 chunk）
 *
 * 单入口：`src/index.ts` → `dist/index.js`（preset / dev 等 API 全部经主入口 re-export）。
 *
 * 配 `preserveModules` 让其它非入口文件按原结构平铺到 dist/ 下，
 * 让 IDE go-to-definition / 阅读源码体验完整。
 */
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
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
