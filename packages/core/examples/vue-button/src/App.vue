<script setup lang="ts">
import { ref, computed } from 'vue'
import { Chain, defaultLight, defaultDark, toClassName } from '@kenconnet666/zui-core'

const dark = ref(false)

// 主题切换：dark / light
const theme = computed(() => (dark.value ? defaultDark : defaultLight))

// 主按钮（filled）
const primaryCls = computed(() => {
  const c = new Chain(theme.value)
  c.color.white
  c.backgroundColor._primary
  c.padding.px(12)
  c.borderRadius._middle
  c.fontWeight._bold
  c.borderStyle('none')
  c.transitionDuration.ms(150)
  c.transitionProperty('background-color')
  c._hover((h) => {
    h.backgroundColor._primary.alpha(85)
  })
  c._focusVisible((f) => {
    f.outlineColor._primary
    f.outlineStyle.solid
    f.outlineWidth.px(2)
    f.outlineOffset.px(2)
  })
  return toClassName(c)
})

// Ghost 按钮（边框 + alpha 背景）
const ghostCls = computed(() => {
  const c = new Chain(theme.value)
  c.color._primary
  c.backgroundColor._primary.alpha(10)
  c.padding.px(12)
  c.borderRadius._middle
  c.fontWeight._bold
  c.borderWidth.px(1)
  c.borderStyle.solid
  c.borderColor._primary.alpha(30)
  c._hover((h) => {
    h.backgroundColor._primary.alpha(20)
  })
  return toClassName(c)
})

// Danger 按钮
const dangerCls = computed(() => {
  const c = new Chain(theme.value)
  c.color.white
  c.backgroundColor._danger
  c.padding.px(12)
  c.borderRadius._middle
  c.fontWeight._bold
  c.borderStyle.none
  c._hover((h) => {
    h.backgroundColor._danger.alpha(85)
  })
  return toClassName(c)
})
</script>

<template>
  <h1>zui-core · Vue 3 button demo</h1>
  <p>主题切换演示：computed 包 chain → className 自动响应主题切换。</p>

  <button @click="dark = !dark">Toggle {{ dark ? 'light' : 'dark' }} mode</button>

  <div style="display: flex; gap: 12px">
    <button :class="primaryCls">Primary</button>
    <button :class="ghostCls">Ghost</button>
    <button :class="dangerCls">Danger</button>
  </div>
</template>
