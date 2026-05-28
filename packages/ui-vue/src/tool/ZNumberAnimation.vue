<script lang="ts">
/**
 * `ZNumberAnimation` —— 数字滚动动画(从 from 滚到 to)。
 *
 * - `from?: number` —— 起始,默认 0
 * - `to: number` —— 目标
 * - `duration?: number` —— ms,默认 1500
 * - `precision?: number` —— 小数位
 * - `separator?: string` —— 千分位
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZNumberAnimationProps {
  from?: number
  to: number
  duration?: number
  precision?: number
  separator?: string
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZNumberAnimationProps>(), {
  from: 0,
  duration: 1500,
  separator: ',',
})

const theme = useZTheme()

const current = ref(props.from)
let raf: number | null = null
let startTs = 0

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animate(): void {
  function step(ts: number): void {
    if (!startTs) startTs = ts
    const elapsed = ts - startTs
    const t = Math.min(1, elapsed / props.duration)
    current.value = props.from + (props.to - props.from) * easeOutCubic(t)
    if (t < 1) {
      raf = requestAnimationFrame(step)
    } else {
      current.value = props.to
      raf = null
    }
  }
  startTs = 0
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(step)
}

watch(() => props.to, animate)

onMounted(() => {
  animate()
})
onScopeDispose(() => {
  if (raf) cancelAnimationFrame(raf)
})

const formatted = computed(() => {
  let v = current.value
  if (props.precision !== undefined) v = Number(v.toFixed(props.precision))
  const [intPart, decPart] = String(v).split('.')
  const intFmt = intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)
  return decPart !== undefined ? `${intFmt}.${decPart}` : intFmt
})

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.fontWeight._semibold
    s.color._text
    s.display.inlineBlock
    s.fontVariantNumeric('tabular-nums')
    props.css?.(s)
  }),
)
</script>

<template>
  <span :class="rootClass">{{ formatted }}</span>
</template>
