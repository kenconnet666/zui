<script lang="ts">
/**
 * `ZCountdown` —— 倒计时(每秒刷新)。
 *
 * - `value: number | Date` —— 目标时间戳(ms)或 Date
 * - `format?: string` —— 输出格式,支持占位符 `{d}` / `{h}` / `{m}` / `{s}`(默认 `'{h}:{m}:{s}'`)
 * - `precision?: 'second' | 'ms'` —— 刷新精度(默认 second)
 *
 * emit:`finish` (倒计时归零)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCountdownProps {
  value: number | Date
  format?: string
  precision?: 'second' | 'ms'
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCountdownEmits {
  (e: 'finish'): void
}
</script>

<script lang="ts" setup>
import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

/**
 * 盒子模型(px,固定 token 间距):
 *
 *   ┌──────────────────────────┐
 *   │ <span> root  inline      │   fontFamily: _mono(等宽)
 *   │   fontFamily: _mono      │   fontWeight: _semibold
 *   │   fontWeight: _semibold  │   color: _text
 *   │   fontSize: _large       │   fontSize: _large
 *   │   color: _text           │
 *   │                          │
 *   │   {h}:{m}:{s} 等显示文本 │   format 默认 '{h}:{m}:{s}'
 *   │   每秒(或每 50ms)刷新  │   占位: {d} 天 / {h} 时 / {m} 分 / {s} 秒
 *   └──────────────────────────┘
 *
 * precision: 'second' → 1s 刷新一次;'ms' → 50ms 刷新一次。归零 emit('finish')。
 */
const props = withDefaults(defineProps<ZCountdownProps>(), {
  format: '{h}:{m}:{s}',
  precision: 'second',
})

const emit = defineEmits<ZCountdownEmits>()

const theme = useZTheme()

const remaining = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
let finished = false

function getTarget(): number {
  return typeof props.value === 'number' ? props.value : props.value.getTime()
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function tick(): void {
  const left = getTarget() - Date.now()
  remaining.value = Math.max(0, left)
  if (left <= 0 && !finished) {
    finished = true
    emit('finish')
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

watch(
  () => props.value,
  () => {
    finished = false
    tick()
  },
)

onMounted(() => {
  tick()
  const interval = props.precision === 'ms' ? 50 : 1000
  timer = setInterval(tick, interval)
})
onScopeDispose(() => {
  if (timer) clearInterval(timer)
})

const displayText = computed(() => {
  const ms = remaining.value
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const mins = Math.floor((ms % 3600000) / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  return props.format
    .replace('{d}', String(days))
    .replace('{h}', pad(hours))
    .replace('{m}', pad(mins))
    .replace('{s}', pad(secs))
})

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.fontFamily._mono
    s.fontWeight._semibold
    s.color._text
    s.fontSize._large
    props.css?.(s)
  }),
)
</script>

<template>
  <span :class="rootClass">{{ displayText }}</span>
</template>
