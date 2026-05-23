<script lang="ts">
/**
 * `ZImage` —— 增强 `<img>`(原生 lazy + 错误 fallback + 占位)。
 *
 * - `src: string`
 * - `alt?: string`
 * - `lazy?: boolean` —— 默认 true(走 `loading="lazy"`)
 * - `fallback?: string` —— 加载失败时显示的图(也可走 `#error` slot)
 * - `width?: string | number` / `height?: string | number`
 * - `fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'` —— object-fit
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZImageProps {
  src: string
  alt?: string
  lazy?: boolean
  fallback?: string
  width?: string | number
  height?: string | number
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZImageProps>(), {
  alt: '',
  lazy: true,
  fit: 'cover',
})

const theme = useZTheme()

const status = ref<'loading' | 'loaded' | 'error'>('loading')

const showFallback = computed(() => status.value === 'error' && props.fallback)
const showError = computed(() => status.value === 'error' && !props.fallback)

const sizeStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.width !== undefined) s.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height !== undefined) s.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  s.objectFit = props.fit
  return s
})

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineBlock
    s.position.relative
    s.backgroundColor._bgMuted
    s.overflow.hidden
    s.borderRadius._tiny
    props.css?.(s)
  }),
)

const errorClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.center
    s.color._textSecondary
    s.fontSize._small
    s.width.pct(100)
    s.height.pct(100)
  }),
)

function onLoad(): void {
  status.value = 'loaded'
}
function onError(): void {
  status.value = 'error'
}
</script>

<template>
  <span :class="rootClass" :style="sizeStyle">
    <template v-if="showFallback">
      <img :src="fallback" :alt="alt" :style="sizeStyle" />
    </template>
    <template v-else-if="showError">
      <slot name="error">
        <span :class="errorClass">加载失败</span>
      </slot>
    </template>
    <template v-else>
      <img
        :src="src"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        :style="sizeStyle"
        @load="onLoad"
        @error="onError"
      />
    </template>
  </span>
</template>
