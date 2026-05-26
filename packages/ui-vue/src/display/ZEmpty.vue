<script lang="ts">
/**
 * `ZEmpty` —— 空状态占位(图标 / 插图 + 描述 + actions)。
 *
 * - `description?: string` —— 默认 "暂无数据"
 * - `image?: Component` —— 自定义图标(默认走 inline 占位 SVG)
 * - `size?: number` —— 图标尺寸 iem 倍数,默认 4(= 64px @ 16px base)
 * - slot:`#image`(自定义图)/ `#description`(自定义文)/ default(操作按钮)
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZEmptyProps {
  description?: string
  image?: Component
  /** 图标尺寸 iem 倍数，默认 4（= 64px @ default iem）。 */
  size?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZEmptyProps>(), {
  description: '暂无数据',
  size: 4,
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.justifyContent.center
    s.gap._small
    s.padding._large
    s.color._textSecondary
    s.fontSize._small
    props.css?.(s)
  }),
)

const imgClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.color._border
    s.width.iem(props.size)
    s.height.iem(props.size)
  }),
)

// 默认 inline 占位 SVG —— "空盒子" 简笔
const defaultSvg = `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">
  <path d="M8 24 L32 12 L56 24 L56 52 L8 52 Z" />
  <path d="M8 24 L32 36 L56 24" />
  <path d="M32 36 L32 52" />
</svg>`
</script>

<template>
  <div :class="rootClass" role="status">
    <span :class="imgClass">
      <slot name="image">
        <component v-if="image" :is="image" />
        <span v-else v-html="defaultSvg" />
      </slot>
    </span>
    <div>
      <slot name="description">{{ description }}</slot>
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
