<script setup lang="ts">
import { ref, computed } from 'vue'
import { Chain, FLAT_PALETTE, Theme, toClassName, tw } from '@kenconnet666/zui-core'
import type { BaseSchema } from '@kenconnet666/zui-core'

// ─── 0. 自定义主题（含 light / dark 两套语义色） ───
// core 只暴露 palette；语义色由用户自家组合。
// 真实业务请用 `zuiLight`（来自 @kenconnet666/zui-vue）。
interface MySchema extends BaseSchema {
  color: BaseSchema['color'] & {
    primary: string
    danger: string
  }
  spacing: { middle: string }
  radius: { middle: string }
  fontWeight: { bold: number }
}

const myLight = new Theme<MySchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '600'),
    danger: tw('red', '600'),
  },
  spacing: { middle: '16px' },
  radius: { middle: '12px' },
  fontWeight: { bold: 700 },
})

const myDark = new Theme<MySchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '500'),
    danger: tw('red', '500'),
  },
  spacing: { middle: '16px' },
  radius: { middle: '12px' },
  fontWeight: { bold: 700 },
})

const dark = ref(false)

// 主题切换：dark / light
const theme = computed(() => (dark.value ? myDark : myLight))

// 主按钮（filled）
const primaryCls = computed(() => {
  const c = new Chain<MySchema>(theme.value)
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
  const c = new Chain<MySchema>(theme.value)
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
  const c = new Chain<MySchema>(theme.value)
  c.color.white
  c.backgroundColor._danger
  c.padding.px(12)
  c.borderRadius._middle
  c.fontWeight._bold
  c.borderStyle('none')
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
