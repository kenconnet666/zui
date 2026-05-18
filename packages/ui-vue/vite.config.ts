import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@kenconnet666/zui-core', '@emotion/css'],
    },
    sourcemap: true,
    target: 'es2022',
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  test: {
    environment: 'happy-dom',
  },
})
