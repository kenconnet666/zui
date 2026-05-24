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
 * - `size?: factory` —— 尺寸(走 width carrier;height 镜像)
 * - `square?: boolean` —— 方形,默认 `false`(圆形)
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
   * 头像尺寸 —— **纯 chain factory**(2026-05-23 撤销 Size5 union)。
   *
   * **默认**:`(w) => w.iem(2.5)`(等价旧 middle 档位,40px,iem 联动)。
   *
   * **参考档位**:tiny(1.5iem/24px) / small(2iem/32px) / middle(2.5iem/40px) /
   * large(3iem/48px) / huge(4iem/64px)。
   *
   * height 自动镜像 width(头像始终正方形)。
   *
   * @example
   * <ZAvatar :size="(w) => w.iem(3)" />       <!-- 等价 large -->
   * <ZAvatar :size="(w) => w.px(48)" />       <!-- 字面量 -->
   */
  size?: SizeProp<'width'>
  /** 方形头像,默认 `false`(圆形)。 */
  square?: boolean
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
  // 默认等价旧 middle 档位:2.5iem(40px,iem 联动)
  size: (w: Chain<ZuiSchema>['width']) => {
    w.iem(2.5)
  },
  square: false,
})

const theme = useZTheme()

const imgFailed = ref(false)

const showImage = computed(() => !!props.src && !imgFailed.value)
const showText = computed(() => !showImage.value && !!props.text)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    // size(Type C):同一 factory 应用到 width + height,保证正方形头像
    s.width(props.size)
    s.height(props.size)
    s.overflow.hidden
    s.verticalAlign('middle')
    s.userSelect.none
    if (props.square) s.borderRadius.iem(0.375)
    else s.borderRadius._full
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
    s.width.pct(100)
    s.height.pct(100)
    s.objectFit.cover
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
