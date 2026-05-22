<script lang="ts">
/**
 * `ZAvatar` —— 头像(image / text / icon fallback)。
 *
 * **优先级**:default slot > `src`(img) > `text`(首字母 / 缩写) > 默认占位。
 *
 * **API**:
 * - `src?: string` —— 图片地址
 * - `alt?: string` —— 图片 alt(默认空)
 * - `text?: string` —— 文字 fallback(可以是 "AB" 缩写)
 * - `size?: number | 'small' | 'middle' | 'large'` —— 尺寸(数字按 px / 档位走 iem)
 * - `shape?: 'circle' | 'square'` —— 形状,默认 `'circle'`
 * - `color` carrier factory —— 文字模式背景色,默认 `_textSecondary`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZAvatarSize = number | 'small' | 'middle' | 'large'

export interface ZAvatarProps {
  src?: string
  alt?: string
  text?: string
  size?: ZAvatarSize
  shape?: 'circle' | 'square'
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZAvatarProps>(), {
  alt: '',
  size: 'middle',
  shape: 'circle',
})

const theme = useZTheme()

const imgFailed = ref(false)

const SIZE_IEM: Record<'small' | 'middle' | 'large', number> = {
  small: 2,
  middle: 2.5,
  large: 3,
}

const sizeValue = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  const n = SIZE_IEM[props.size]
  return `calc(${n} * var(--zui-iem, 16px))`
})

const showImage = computed(() => !!props.src && !imgFailed.value)
const showText = computed(() => !showImage.value && !!props.text)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    s._prop('width', sizeValue.value)
    s._prop('height', sizeValue.value)
    s._prop('overflow', 'hidden')
    s._prop('verticalAlign', 'middle')
    s._prop('userSelect', 'none')
    s.borderRadius(props.shape === 'circle' ? '9999px' : 'calc(0.375 * var(--zui-iem, 16px))')
    if (!showImage.value) {
      if (props.color) s.backgroundColor(props.color)
      else s.backgroundColor._textSecondary
      s.color._bg
      s.fontWeight._semibold
      s.fontSize.iem(0.875)
    }
    props.css?.(s)
  }),
)

const imgClass = computed(() =>
  icss(theme.value, (s) => {
    s._prop('width', '100%')
    s._prop('height', '100%')
    s._prop('objectFit', 'cover')
  }),
)

function onImgError(): void {
  imgFailed.value = true
}
</script>

<template>
  <span :class="rootClass" role="img" :aria-label="alt || text || 'avatar'">
    <slot>
      <img v-if="showImage" :class="imgClass" :src="src" :alt="alt" @error="onImgError" />
      <template v-else-if="showText">{{ text }}</template>
    </slot>
  </span>
</template>
