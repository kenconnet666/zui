<script lang="ts" setup>
/**
 * docs 站点根 —— 顶层 `ZBox`(注入 theme + iem)+ `DocLayout`(三栏布局)。
 *
 * **主题状态**:
 * - `colorScheme: 'light' | 'dark'` —— 这里持有,通过 `v-model:colorScheme` 与 `DocLayout`
 *   header 内的 `ZSegmented` 双向绑定
 * - `currentTheme` —— 根据 colorScheme 选 zuiLight / zuiDark,再 `.extend(...)` 叠加 brand 色
 *
 * **类型层 brand 扩展**:见 `src/zui.d.ts`(`UserColorExt` augmentation)。
 */
import { computed, ref } from 'vue'
import { ZBox, ZIemPreset, zuiDark, zuiLight } from '@kenconnet666/zui-vue'
import DocLayout, { type ColorScheme } from './layouts/DocLayout.vue'

const colorScheme = ref<ColorScheme>('light')

const brandExt = {
  brandRoyal: '#1a3a8f',
  brandSunset: '#ff7849',
  brandForest: '#1f7a3c',
}

const currentTheme = computed(() => {
  const base = colorScheme.value === 'dark' ? zuiDark : zuiLight
  return base.extend({ color: brandExt })
})
</script>

<template>
  <ZBox :theme="currentTheme" :iem="ZIemPreset.default">
    <DocLayout v-model:colorScheme="colorScheme">
      <RouterView />
    </DocLayout>
  </ZBox>
</template>
