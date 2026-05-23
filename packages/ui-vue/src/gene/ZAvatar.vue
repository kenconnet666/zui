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
import type { SizeProp } from '../_internal/size-prop'

export interface ZAvatarProps {
  src?: string
  alt?: string
  text?: string
  /**
   * 头像尺寸 —— `factory | Size5 | undefined` union(2026-05-22 修订)。
   *
   * **默认**:`'middle'`(2.5iem,默认 40px,iem 联动)。
   *
   * **5 阶档位**:tiny(1.5iem/24px) / small(2iem/32px) / middle(2.5iem/40px) /
   * large(3iem/48px) / huge(4iem/64px)。
   *
   * **BREAKING**(v0.3 移除):不再支持 `number` 字面量;用 factory 表达 `:size="(w) => w.px(N)"`。
   */
  size?: SizeProp<'width'> | undefined
  shape?: 'circle' | 'square'
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySizeProp, type SizeMap } from '../_internal/size-prop'

const props = withDefaults(defineProps<ZAvatarProps>(), {
  alt: '',
  size: 'middle',
  shape: 'circle',
})

const theme = useZTheme()

const imgFailed = ref(false)

/** ZAvatar size 档位 → iem 倍率(width carrier;height 自动镜像)。 */
const SIZE_MAP: SizeMap<Chain<ZuiSchema>['width']> = {
  tiny: (w) => {
    w.iem(1.5)
  },
  small: (w) => {
    w.iem(2)
  },
  middle: (w) => {
    w.iem(2.5)
  },
  large: (w) => {
    w.iem(3)
  },
  huge: (w) => {
    w.iem(4)
  },
}

const showImage = computed(() => !!props.src && !imgFailed.value)
const showText = computed(() => !showImage.value && !!props.text)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    // size:union(width carrier;height 镜像 width 保证正方形头像)
    applySizeProp(props.size, SIZE_MAP, s.width)
    if (s._node.width !== undefined) s._node.height = s._node.width
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
