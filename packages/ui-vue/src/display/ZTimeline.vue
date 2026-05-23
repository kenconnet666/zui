<script lang="ts">
/**
 * `ZTimeline` —— 时间轴。`items` 配置式,每项支持自定义 status / icon / title / description。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZTimelineStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export interface ZTimelineItem {
  title?: string
  description?: string
  status?: ZTimelineStatus
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

const props = defineProps<ZTimelineProps>()

const theme = useZTheme()

const STATUS_COLOR: Record<ZTimelineStatus, 'primary' | 'success' | 'warning' | 'danger' | 'textSecondary'> = {
  default: 'textSecondary',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize._small
    props.css?.(s)
  }),
)

function itemClass(): string {
  return icss(theme.value, (s) => {
    s.position.relative
    s.paddingLeft._huge
    s.paddingBottom._middle
    s.minHeight.iem(2)
  })
}

function dotClass(status: ZTimelineStatus): string {
  return icss(theme.value, (s) => {
    s.position.absolute
    s.left.px(0)
    s.top.iem(0.25)
    s.width.iem(0.625)
    s.height.iem(0.625)
    s.borderRadius._full
    s.backgroundColor[`_${STATUS_COLOR[status]}` as const]
  })
}

function lineClass(): string {
  return icss(theme.value, (s) => {
    // 线宽 0.125iem(2px @ 默认 iem=16px),left 取 dot 中心(0.3125iem)- 线宽半值(0.0625iem)= 0.25iem
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
      <span :class="dotClass(item.status ?? 'default')" />
      <div v-if="item.title" :class="titleClass">{{ item.title }}</div>
      <div v-if="item.description" :class="descClass">{{ item.description }}</div>
    </div>
  </div>
</template>
