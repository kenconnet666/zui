<script lang="ts">
/**
 * `ZDescriptions` —— 描述列表(key-value 网格,类 antd Descriptions)。
 *
 * **API**:
 * - `items: Array<{ label, value }>` —— 配置式
 * - `title?: string` —— 顶部标题
 * - `column?: number` —— 列数,默认 3
 * - `bordered?: boolean` —— 边框
 * - `size?: number` —— 字号尺寸(px 倍数,1 单位 = 16px),默认 1(= 16px)
 *
 * slot:`title` / 每个 item 的 `value` 走 `#item-{label}`(本 v1 简化:仅配置式)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZDescriptionsItem {
  label: string
  value: string | number
  /** 跨列数,默认 1。 */
  span?: number
}

export interface ZDescriptionsProps {
  items: ZDescriptionsItem[]
  title?: string
  column?: number
  bordered?: boolean
  /**
   * 字号尺寸 —— `number`(px 倍数,1 单位 = 16px,默认 1)。2026-05-24 B7。
   *
   * label/value padding = `size * 0.5`(偏紧表格风)。
   */
  size?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(纯 px,1 单位 = 16px):
 *
 *   ┌────────────────────────────────────────────────────┐
 *   │ ZDescriptions root  flex column                    │   bordered=true:
 *   │   color: _text  fontSize: _middle                  │     border _thin solid _border
 *   │                                                    │     border-radius _small
 *   │  ┌──────────────────────────────────────────────┐  │     overflow hidden
 *   │  │ title(条件渲染)                            │  │
 *   │  │   pad-y _middle/_small  pad-x _middle        │  │   title:
 *   │  │   fontSize _large  fontWeight _semibold      │  │     bordered → bg _bgMuted
 *   │  └──────────────────────────────────────────────┘  │     border-b _thin
 *   │  ┌──────────────────────────────────────────────┐  │
 *   │  │ grid  display: grid  column 列(默认 3)    │  │   每格 padding(size 档):
 *   │  │   gridTemplateColumns: repeat(N, minmax(0,1fr))│   small  → _tiny
 *   │  │  ┌──────┐┌──────┐┌──────┐┌──────┐...        │  │   middle → _small
 *   │  │  │ label││ value││ label││ value│            │  │   large  → _middle
 *   │  │  │ _textSecondary │  _text │                 │  │
 *   │  │  │ _medium    bordered: 单元格 border-r _thin│  │
 *   │  │  │   bordered: bg _bgMuted │                 │  │
 *   │  │  └──────┘└──────┘└──────┘└──────┘...        │  │
 *   │  └──────────────────────────────────────────────┘  │
 *   └────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZDescriptionsProps>(), {
  column: 3,
  bordered: false,
  size: 1,
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize.px(sizePx(props.size ?? 1))
    if (props.bordered) {
      s.borderWidth._thin
      s.borderStyle.solid
      s.borderColor._border
      s.borderRadius._small
      s.overflow.hidden
    }
    props.css?.(s)
  }),
)

const titleClass = computed(() =>
  icss(theme.value, s => {
    s.fontSize._large
    s.fontWeight._semibold
    s.color._text
    s.paddingTop._middle
    s.paddingBottom._small
    s.paddingLeft._middle
    s.paddingRight._middle
    if (props.bordered) {
      s.borderBottomWidth._thin
      s.borderBottomStyle.solid
      s.borderBottomColor._border
      s.backgroundColor._bgMuted
    }
  }),
)

const gridClass = computed(() =>
  icss(theme.value, s => {
    s.display.grid
    s.gridTemplateColumns(`repeat(${props.column}, minmax(0, 1fr))`)
    if (props.bordered) {
      s.borderTopWidth._thin
      s.borderTopStyle.solid
      s.borderTopColor._border
    }
  }),
)

const labelClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.fontWeight._medium
    s.padding.px(sizePx((props.size ?? 1) * 0.5))
    if (props.bordered) {
      s.backgroundColor._bgMuted
      s.borderRightWidth._thin
      s.borderRightStyle.solid
      s.borderRightColor._border
    }
  }),
)

const valueClass = computed(() =>
  icss(theme.value, s => {
    s.color._text
    s.padding.px(sizePx((props.size ?? 1) * 0.5))
    if (props.bordered) {
      s.borderRightWidth._thin
      s.borderRightStyle.solid
      s.borderRightColor._border
    }
  }),
)

/**
 * 最右列 value 格子专用 class —— 去掉右边框，避免容器外侧出现多余竖线。
 * 仅 bordered 时有效。
 */
const valueLastColClass = computed(() =>
  icss(theme.value, s => {
    s.color._text
    s.padding.px(sizePx((props.size ?? 1) * 0.5))
  }),
)

/**
 * 计算每个 item 的 value 是否处于该行最右列（used in template）。
 *
 * 逐项追踪已占用列数，超出 column 则换行计算。
 * label 占 1 格，value 占 `span ?? 1` 格（但 gridColumn span 是 span*2-1，
 * 因为每列分 label+value 两格；这里我们按"几个 item 一行"来算，
 * 所以只算 item 位置而非 DOM 格子数）。
 */
const isLastColPerItem = computed<boolean[]>(() => {
  const col = props.column
  const result: boolean[] = []
  let pos = 0 // 当前行已占 item 数（不计 span，这里简化：每个 item 占 1 列逻辑位置）
  for (let i = 0; i < props.items.length; i++) {
    const span = props.items[i]!.span ?? 1
    pos += span
    const isLast = pos >= col || i === props.items.length - 1
    result.push(isLast)
    if (pos >= col) pos = 0
  }
  return result
})
</script>

<template>
  <div :class="rootClass">
    <div v-if="title || $slots.title" :class="titleClass">
      <slot name="title">{{ title }}</slot>
    </div>
    <div :class="gridClass">
      <template v-for="(item, i) in items" :key="i">
        <div :class="labelClass">{{ item.label }}</div>
        <div
          :class="bordered && isLastColPerItem[i] ? valueLastColClass : valueClass"
          :style="item.span && item.span > 1 ? { gridColumn: `span ${item.span * 2 - 1}` } : {}"
        >
          {{ item.value }}
        </div>
      </template>
    </div>
  </div>
</template>
