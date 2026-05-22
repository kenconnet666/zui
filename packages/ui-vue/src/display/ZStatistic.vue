<script lang="ts">
/**
 * `ZStatistic` —— 数字统计展示。
 *
 * - `value: number | string` —— 主数值
 * - `title?: string`
 * - `prefix?: string` / `suffix?: string` —— 前后缀(也可 slot)
 * - `precision?: number` —— 数字小数位
 * - `separator?: string` —— 千分位分隔符(默认 `,`)
 * - `color` carrier factory —— 数值颜色
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZStatisticProps {
  value: number | string
  title?: string
  prefix?: string
  suffix?: string
  precision?: number
  separator?: string
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZStatisticProps>(), {
  separator: ',',
})

const theme = useZTheme()

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  let v = props.value
  if (props.precision !== undefined) v = Number(v.toFixed(props.precision))
  const [intPart, decPart] = String(v).split('.')
  const intFormatted = intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)
  return decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted
})

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
    props.css?.(s)
  }),
)

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._small
    s.color._textSecondary
  }),
)

const valueClass = computed(() =>
  icss(theme.value, (s) => {
    if (props.color) s.color(props.color)
    else s.color._text
    s.fontSize._huge
    s.fontWeight._semibold
    s.lineHeight._tight
    s.display.flex
    s.alignItems.baseline
    s.gap._tiny
  }),
)

const fixClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._middle
    s.color._textSecondary
    s.fontWeight._normal
  }),
)
</script>

<template>
  <div :class="rootClass" role="group">
    <div v-if="title || $slots.title" :class="titleClass">
      <slot name="title">{{ title }}</slot>
    </div>
    <div :class="valueClass">
      <span v-if="prefix || $slots.prefix" :class="fixClass">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <span>{{ formattedValue }}</span>
      <span v-if="suffix || $slots.suffix" :class="fixClass">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </div>
</template>
