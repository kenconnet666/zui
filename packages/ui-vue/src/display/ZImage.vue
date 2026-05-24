<script lang="ts">
/**
 * `ZImage` —— 增强 `<img>`(原生 lazy + 错误 fallback + 占位)。
 *
 * **API**:
 * - `src: string`
 * - `alt?: string`
 * - `lazy?: boolean` —— 默认 true(走 `loading="lazy"`)
 * - `fallback?: string` —— 加载失败时显示的图(也可走 `#error` slot)
 * - `width?: factory` / `height?: factory` —— 尺寸 carrier factory(2026-05-24 B7:数字尺寸 → factory)
 * - `fit?: factory` —— objectFit carrier factory(2026-05-24 B7:enum → factory)
 *
 * **iem 单位默认**:走 chain `s.width(...)` / `s.height(...)`,用户可用 `.iem(N)` / `.px(N)` /
 * `.pct(N)` 等任意 carrier 方法,Provider 字号联动。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZImageProps {
  src: string
  alt?: string
  lazy?: boolean
  fallback?: string
  /**
   * 宽度 factory —— 接 `width` carrier。
   *
   * @example
   * <ZImage :width="(w) => w.px(120)" />
   * <ZImage :width="(w) => w.iem(8)" />
   * <ZImage :width="(w) => w.pct(100)" />
   */
  width?: ((c: Chain<ZuiSchema>['width']) => void) | undefined
  /**
   * 高度 factory —— 接 `height` carrier。
   *
   * @example
   * <ZImage :height="(h) => h.px(80)" />
   */
  height?: ((c: Chain<ZuiSchema>['height']) => void) | undefined
  /**
   * objectFit factory —— 接 `objectFit` carrier。
   *
   * @example
   * <ZImage :fit="(f) => f.cover" />     <!-- 默认行为(原 'cover')-->
   * <ZImage :fit="(f) => f.contain" />
   * <ZImage :fit="(f) => f.scaleDown" />
   */
  fit?: ((c: Chain<ZuiSchema>['objectFit']) => void) | undefined
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
})

const theme = useZTheme()

const status = ref<'loading' | 'loaded' | 'error'>('loading')

const showFallback = computed(() => status.value === 'error' && props.fallback)
const showError = computed(() => status.value === 'error' && !props.fallback)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineBlock
    s.position.relative
    s.backgroundColor._bgMuted
    s.overflow.hidden
    s.borderRadius._tiny
    if (props.width) s.width(props.width)
    if (props.height) s.height(props.height)
    props.css?.(s)
  }),
)

const imgClass = computed(() =>
  icss(theme.value, (s) => {
    // objectFit 默认 'cover',用户传 factory 覆盖
    if (props.fit) s.objectFit(props.fit)
    else s.objectFit.cover
    if (props.width) s.width(props.width)
    if (props.height) s.height(props.height)
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
  <span :class="rootClass">
    <template v-if="showFallback">
      <img :src="fallback" :alt="alt" :class="imgClass" />
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
        :class="imgClass"
        @load="onLoad"
        @error="onError"
      />
    </template>
  </span>
</template>
