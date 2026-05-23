<script lang="ts">
/**
 * `ZSplit` —— 可拖拽分隔的两栏布局。
 *
 * - `direction?: 'horizontal' | 'vertical'` —— 默认 horizontal(左右分)
 * - `v-model:size` —— 第一栏尺寸百分比(0~1,默认 0.5)
 * - `min?: number` / `max?: number` —— 第一栏百分比限制
 * - `disabled?: boolean`
 *
 * slot `first` / `second` 或 `default`(逗号分隔不行;改成两个具名 slot)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZSplitProps {
  direction?: 'horizontal' | 'vertical'
  size?: number
  min?: number
  max?: number
  disabled?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSplitEmits {
  (e: 'update:size', value: number): void
}
</script>

<script lang="ts" setup>
import { computed, onScopeDispose, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZSplitProps>(), {
  direction: 'horizontal',
  size: 0.5,
  min: 0.1,
  max: 0.9,
  disabled: false,
})

const emit = defineEmits<ZSplitEmits>()

const theme = useZTheme()

const containerRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

function clamp(v: number): number {
  return Math.max(props.min, Math.min(props.max, v))
}

function onPointerDown(e: PointerEvent): void {
  if (props.disabled) return
  e.preventDefault()
  dragging.value = true
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent): void {
  if (!dragging.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const local =
    props.direction === 'horizontal'
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height
  emit('update:size', clamp(local))
}

function onPointerUp(): void {
  dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

onScopeDispose(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

const containerClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection(props.direction === 'vertical' ? 'column' : 'row')
    s.width.pct(100)
    s.height.pct(100)
    s.overflow.hidden
    props.css?.(s)
  }),
)

const firstClass = computed(() =>
  icss(theme.value, (s) => {
    const pct = props.size * 100
    if (props.direction === 'horizontal') {
      s.width.pct(pct)
      s.height.pct(100)
    } else {
      s.height.pct(pct)
      s.width.pct(100)
    }
    s.flexShrink(0)
    s.overflow.auto
  }),
)

const secondClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.overflow.auto
  }),
)

const dividerClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexShrink(0)
    s.backgroundColor._border
    s.transitionProperty._colors
    s.transitionDuration._small
    if (props.direction === 'horizontal') {
      s.width.px(4)
      s.cursor(props.disabled ? 'default' : 'col-resize')
    } else {
      s.height.px(4)
      s.cursor(props.disabled ? 'default' : 'row-resize')
    }
    if (!props.disabled) {
      s._hover((h) => {
        h.backgroundColor._primary
      })
    }
  }),
)
</script>

<template>
  <div ref="containerRef" :class="containerClass">
    <div :class="firstClass">
      <slot name="first" />
    </div>
    <div :class="dividerClass" @pointerdown="onPointerDown" role="separator" :aria-orientation="direction === 'vertical' ? 'horizontal' : 'vertical'" />
    <div :class="secondClass">
      <slot name="second" />
    </div>
  </div>
</template>
