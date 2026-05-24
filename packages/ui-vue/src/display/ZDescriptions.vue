<script lang="ts">
/**
 * `ZDescriptions` —— 描述列表(key-value 网格,类 antd Descriptions)。
 *
 * **API**:
 * - `items: Array<{ label, value }>` —— 配置式
 * - `title?: string` —— 顶部标题
 * - `column?: number` —— 列数,默认 3
 * - `bordered?: boolean` —— 边框
 * - `size?: SizePropMulti` —— 尺寸 factory(默认等价 `DESC_SIZE_MAP.middle`)
 *
 * slot:`title` / 每个 item 的 `value` 走 `#item-{label}`(本 v1 简化:仅配置式)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SizePropMulti } from '../_internal/size-prop'
import { makeSizeMap } from '../_internal/size-prop'

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
  /** 尺寸 —— 纯 factory(默认等价 `DESC_SIZE_MAP.middle`,影响 label / value 内边距,偏紧)。 */
  size?: SizePropMulti
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

/** ZDescriptions 偏紧 padding(label/value 表格风),3 阶 + tiny/huge fallback。 */
const DESC_SIZE_MAP = makeSizeMap<Chain<ZuiSchema>>({
  small: (s) => {
    s.padding._tiny
  },
  middle: (s) => {
    s.padding._small
  },
  large: (s) => {
    s.padding._middle
  },
})
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySizeProp } from '../_internal/size-prop'

/**
 * 盒子模型(iem,Provider 控制基准):
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
  size: DESC_SIZE_MAP.middle,
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize._middle
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
  icss(theme.value, (s) => {
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
  icss(theme.value, (s) => {
    s.display.grid
    s.gridTemplateColumns(`repeat(${props.column}, minmax(0, 1fr))`)
    if (props.bordered) {
      s.borderTopWidth.px(1)
      s.borderTopStyle.solid
      s.borderTopColor._border
    }
  }),
)

const labelClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontWeight._medium
    applySizeProp(props.size, s)
    if (props.bordered) {
      s.backgroundColor._bgMuted
      s.borderRightWidth._thin
      s.borderRightStyle.solid
      s.borderRightColor._border
    }
  }),
)

const valueClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._text
    applySizeProp(props.size, s)
    if (props.bordered) {
      s.borderRightWidth._thin
      s.borderRightStyle.solid
      s.borderRightColor._border
    }
  }),
)
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
          :class="valueClass"
          :style="item.span && item.span > 1 ? { gridColumn: `span ${item.span * 2 - 1}` } : {}"
        >
          {{ item.value }}
        </div>
      </template>
    </div>
  </div>
</template>
