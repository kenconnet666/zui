import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // peer 与 runtime dep 都不打进 bundle；用户装包时 pnpm 会自动拉 color2k / csstype
      external: ['@emotion/css', '@emotion/css/create-instance', 'csstype', 'color2k'],
    },
    sourcemap: true,
    target: 'es2022',
  },
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
  },
})
