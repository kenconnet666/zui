<script lang="ts">
/**
 * `ZImage` —— 增强 `<img>`(原生 lazy + 错误 fallback + 占位)。
 *
 * **API**:
 * - `src: string`
 * - `alt?: string`
 * - `lazy?: boolean` —— 默认 true(走 `loading="lazy"`)
 * - `fallback?: string` —— 加载失败时显示的图(也可走 `#error` slot)
 * - `width?: number | string` / `height?: number | string` —— 尺寸：number 为 px 倍数
 *   (1 单位 = 16px，走 `sizePx`)，string 为原样 CSS（'100%' / '50vh'）
 * - `fit?: factory` —— objectFit carrier factory
 *
 * 数值尺寸 1 单位 = 16px（`_internal/sizing.ts` 的 `sizePx`）；百分比 / 视口等非 px 用字符串。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZImageProps {
  src: string
  alt?: string
  lazy?: boolean
  fallback?: string
  /**
   * 宽度 —— `number` 为 px 倍数（1 单位 = 16px，如 `8` = 128px），`string` 为原样 CSS。
   *
   * @example
   * <ZImage :width="8" />            <!-- 128px -->
   * <ZImage width="100%" />          <!-- 百分比 -->
   */
  width?: number | string | undefined
  /**
   * 高度 —— `number` 为 px 倍数（1 单位 = 16px），`string` 为原样 CSS。
   *
   * @example
   * <ZImage :height="5" />           <!-- 80px -->
   */
  height?: number | string | undefined
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

export interface ZImageEmits {
  (e: 'load', evt: Event): void
  (e: 'error', evt: Event): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

/** 数值 → px 倍数（1 单位 = 16px）；字符串原样透传给 CSS。 */
function dim(v: number | string): string {
  return typeof v === 'number' ? `${sizePx(v)}px` : v
}

const props = withDefaults(defineProps<ZImageProps>(), {
  alt: '',
  lazy: true,
})
const emit = defineEmits<ZImageEmits>()

const theme = useZTheme()

const status = ref<'loading' | 'loaded' | 'error'>('loading')

const showFallback = computed(() => status.value === 'error' && props.fallback)
const showError = computed(() => status.value === 'error' && !props.fallback)

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineBlock
    s.position.relative
    s.backgroundColor._bgMuted
    s.overflow.hidden
    s.borderRadius._tiny
    if (props.width !== undefined) s.width(dim(props.width))
    if (props.height !== undefined) s.height(dim(props.height))
    props.css?.(s)
  }),
)

const imgClass = computed(() =>
  icss(theme.value, s => {
    // objectFit 默认 'cover',用户传 factory 覆盖
    if (props.fit) s.objectFit(props.fit)
    else s.objectFit.cover
    if (props.width !== undefined) s.width(dim(props.width))
    if (props.height !== undefined) s.height(dim(props.height))
  }),
)

const errorClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.center
    s.color._textSecondary
    s.fontSize._small
    s.width.pct(100)
    s.height.pct(100)
  }),
)

function onLoad(evt: Event): void {
  status.value = 'loaded'
  emit('load', evt)
}
function onError(evt: Event): void {
  status.value = 'error'
  emit('error', evt)
}
</script>

<template>
  <span :class="rootClass" :aria-busy="status === 'loading' ? 'true' : undefined">
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
