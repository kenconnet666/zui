<script lang="ts">
/**
 * `ZEmpty` —— 空状态占位(图标 / 插图 + 描述 + actions)。
 *
 * - `description?: string` —— 默认 "暂无数据"
 * - `image?: Component` —— 自定义图标(默认走 inline 占位 SVG)
 * - `size?: number` —— 图标尺寸 px 倍数(1 单位 = 16px),默认 4(= 64px)
 * - slot:`#image`(自定义图)/ `#description`(自定义文)/ default(操作按钮)
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZEmptyProps {
  description?: string
  image?: Component
  /** 图标尺寸 px 倍数(1 单位 = 16px),默认 4(= 64px)。 */
  size?: number
  /**
   * 紧凑模式:**隐藏占位图标** + 收紧 padding,只居中显示描述文字。用于下拉浮层 /
   * 穿梭框面板等小容器空态(默认 64px 图标在这些场景过大)。默认 `false`。
   */
  compact?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

const props = withDefaults(defineProps<ZEmptyProps>(), {
  description: '暂无数据',
  size: 4,
  compact: false,
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.justifyContent.center
    s.gap._small
    if (props.compact) {
      s.padding._small
    } else {
      s.padding._large
    }
    s.color._textSecondary
    s.fontSize._small
    props.css?.(s)
  }),
)

const imgClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    // 用三级文本色代替边框色：图标作为内容元素，语义上应跟随文本色，而非边框色
    s.color._textTertiary
    s.width.px(sizePx(props.size))
    s.height.px(sizePx(props.size))
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
  <div :class="rootClass" role="status" :aria-label="description || '暂无数据'">
    <span v-if="!compact" :class="imgClass">
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
