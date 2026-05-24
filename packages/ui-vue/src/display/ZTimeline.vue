<script lang="ts">
/**
 * `ZTimeline` —— 时间轴。
 *
 * **API**(B6:删 status 业务语义字符串映射,改 chain color factory):
 * - `items: ZTimelineItem[]` —— 每项配置 `title?` / `description?` / `color?: factory`
 * - `item.color?: factory` —— 每个 item 的 dot 颜色 carrier factory,默认 `_textSecondary`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZTimelineItem {
  title?: string
  description?: string
  /** dot 颜色 carrier factory,默认 `_textSecondary`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
}

export interface ZTimelineProps {
  items: ZTimelineItem[]
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyAsBg } from '../_internal/color-bridge'

const props = defineProps<ZTimelineProps>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize._small
    props.css?.(s)
  }),
)

/**
 * 节点行盒子模型(iem):
 * - min-height: 2iem(保证连接线有最小高度)
 */
function itemClass(): string {
  return icss(theme.value, (s) => {
    s.position.relative
    s.paddingLeft._huge
    s.paddingBottom._middle
    s.minHeight.iem(2)
  })
}

/**
 * 节点圆点盒子模型(iem):
 * - width/height: 0.625iem,正圆
 * - top: 0.25iem(对齐文字基线)
 *
 * 颜色:用户传 `item.color` factory → 应用到 backgroundColor;否则默认 `_textSecondary`。
 */
function dotClass(color?: ZTimelineItem['color']): string {
  return icss(theme.value, (s) => {
    s.position.absolute
    s.left.px(0)
    s.top.iem(0.25)
    s.width.iem(0.625)
    s.height.iem(0.625)
    s.borderRadius._full
    if (!applyAsBg(s, color)) {
      s.backgroundColor._textSecondary
    }
  })
}

/**
 * 连接线盒子模型(iem):
 * - width: 0.125iem(线宽)
 * - left: 0.25iem(dot 中心 0.3125iem 减去线宽半值 0.0625iem,使连接线对齐圆点中心)
 * - top: 0.75iem(从 dot 下沿延伸)
 */
function lineClass(): string {
  return icss(theme.value, (s) => {
    s.position.absolute
    s.left.iem(0.25)
    s.top.iem(0.75)
    s.bottom.px(0)
    s.width.iem(0.125)
    s.backgroundColor._border
  })
}

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontWeight._semibold
    s.color._text
  }),
)
const descClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
    s.marginTop._tiny
  }),
)
</script>

<template>
  <div :class="rootClass" role="list">
    <div v-for="(item, i) in items" :key="i" :class="itemClass()" role="listitem">
      <span v-if="i < items.length - 1" :class="lineClass()" />
      <span :class="dotClass(item.color)" />
      <div v-if="item.title" :class="titleClass">{{ item.title }}</div>
      <div v-if="item.description" :class="descClass">{{ item.description }}</div>
    </div>
  </div>
</template>
