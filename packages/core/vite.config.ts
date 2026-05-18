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
      external: ['@emotion/css', 'csstype'],
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
