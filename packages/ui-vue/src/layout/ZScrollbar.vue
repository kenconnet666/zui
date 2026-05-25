<script lang="ts">
/**
 * `ZScrollbar` —— 统一 overlay 自动隐藏滚动条容器。
 *
 * **行为**：
 * - 滚动条默认透明隐藏，鼠标进入或容器内有焦点时显示半透明细滚动条
 * - Chrome/Edge：走 `overflow: overlay`，滚动条浮在内容上方，**不占布局空间**
 * - Firefox：`scrollbar-width: thin` + `scrollbar-color`，始终占 ~6px 但尽量细
 * - 暗色/亮色主题自动适配（暗色用浅色半透明，亮色用深色半透明）
 *
 * **API**：
 * - `maxHeight?: number` —— 容器最大高度（iem 倍数）
 * - `css?: factory` —— 根元素覆盖
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZScrollbarProps {
  /**
   * 最大高度 —— `number`（iem 倍数，默认 undefined = 由父级决定）。
   * 非 iem 单位走 `css` 兜底：`(s) => s.maxHeight.px(200)`。
   */
  maxHeight?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyScrollbarStyles } from '../_internal/scrollbarStyles'

/**
 * 盒子模型（iem，Provider 控制基准）：
 *
 *   ┌────────────────────────────────────┐
 *   │ ZScrollbar（div，overflow auto/overlay）│
 *   │   max-height: `maxHeight` iem      │
 *   │                                    │
 *   │  ┌──────────────────────────────┐  │
 *   │  │ slot 内容（子元素自然撑高）  │  │  滚动条：6px 细，hover 显，overlay 不占位
 *   │  └──────────────────────────────┘  │
 *   └────────────────────────────────────┘
 */
const props = defineProps<ZScrollbarProps>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.overflow.auto
    if (props.maxHeight !== undefined) s.maxHeight.iem(props.maxHeight)
    applyScrollbarStyles(s, theme.value)
    props.css?.(s)
  }),
)
</script>

<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>
