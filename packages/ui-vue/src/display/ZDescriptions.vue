<script lang="ts">
/**
 * `ZDescriptions` —— 描述列表(key-value 网格,类 antd Descriptions)。
 *
 * **API**:
 * - `items: Array<{ label, value }>` —— 配置式
 * - `title?: string` —— 顶部标题
 * - `column?: number` —— 列数,默认 3
 * - `bordered?: boolean` —— 边框
 * - `size?: 'small' | 'middle' | 'large'`
 *
 * slot:`title` / 每个 item 的 `value` 走 `#item-{label}`(本 v1 简化:仅配置式)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZDescriptionsSize = 'small' | 'middle' | 'large'

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
  size?: ZDescriptionsSize
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZDescriptionsProps>(), {
  column: 3,
  bordered: false,
  size: 'middle',
})

const theme = useZTheme()

const SIZE_PADDING: Record<ZDescriptionsSize, 'tiny' | 'small' | 'middle'> = {
  small: 'tiny',
  middle: 'small',
  large: 'middle',
}

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
      s._prop('overflow', 'hidden')
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
    s._prop('gridTemplateColumns', `repeat(${props.column}, minmax(0, 1fr))`)
    if (props.bordered) {
      s._prop('borderTop', `1px solid var(--zui-color-border, transparent)`)
    }
  }),
)

const labelClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontWeight._medium
    s.padding[`_${SIZE_PADDING[props.size]}`]
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
    s.padding[`_${SIZE_PADDING[props.size]}`]
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
