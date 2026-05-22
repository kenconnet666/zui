<script lang="ts">
/**
 * `ZList` —— 简单数据列表(类 antd List 简化版)。
 *
 * **API**:
 * - `items: T[]` —— 数据数组
 * - `bordered?: boolean` —— 外框 + 内部分割线
 * - `size?: 'small' | 'middle' | 'large'`
 * - `header?: string` / `footer?: string` —— 头尾文字(slot `#header` / `#footer` 优先)
 * - slot `default`:scope `{ item, index }` 自定义渲染每行
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZListSize = 'small' | 'middle' | 'large'

export interface ZListProps<T = unknown> {
  items: T[]
  bordered?: boolean
  size?: ZListSize
  header?: string
  footer?: string
  emptyText?: string
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup generic="T">
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZListProps<T>>(), {
  bordered: false,
  size: 'middle',
  emptyText: '暂无数据',
})

const theme = useZTheme()

const SIZE_PADDING: Record<ZListSize, 'small' | 'middle' | 'large'> = {
  small: 'small',
  middle: 'middle',
  large: 'large',
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

const headerClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding[`_${SIZE_PADDING[props.size]}`]
    s.fontWeight._semibold
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
  }),
)

const footerClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding[`_${SIZE_PADDING[props.size]}`]
    s.color._textSecondary
    s.fontSize._small
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
  }),
)

const itemClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding[`_${SIZE_PADDING[props.size]}`]
  }),
)

const itemWithDivider = computed(() =>
  icss(theme.value, (s) => {
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
  }),
)

const emptyClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._large
    s.color._textSecondary
    s.fontSize._small
    s._prop('textAlign', 'center')
  }),
)
</script>

<template>
  <div :class="rootClass" role="list">
    <div v-if="header || $slots.header" :class="headerClass">
      <slot name="header">{{ header }}</slot>
    </div>
    <template v-if="items.length > 0">
      <div
        v-for="(item, i) in items"
        :key="i"
        :class="[itemClass, i > 0 ? itemWithDivider : '']"
        role="listitem"
      >
        <slot :item="item" :index="i" />
      </div>
    </template>
    <div v-else :class="emptyClass">{{ emptyText }}</div>
    <div v-if="footer || $slots.footer" :class="footerClass">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
