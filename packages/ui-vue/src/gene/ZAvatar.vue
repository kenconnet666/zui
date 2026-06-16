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

export interface ZAvatarProps {
  src?: string
  alt?: string
  text?: string
  /**
   * 头像尺寸 —— `number`(px 倍数,默认 2.5 = 40px,1 单位 = 16px)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   *
   * **参考档位**:1.5(24px tiny) / 2(32px small) / 2.5(40px middle) / 3(48px large) / 4(64px huge)。
   *
   * height 自动镜像 width(头像始终正方形)。
   *
   * @example
   * <ZAvatar :size="3" />        <!-- 3 × 16 = 48px 大头像 -->
   * <ZAvatar :size="1.5" />      <!-- 1.5 × 16 = 24px 小 -->
   */
  size?: number
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
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(number 是 px 倍数,1 单位 = 16px,sizePx(n) = n × 16):
 *
 *   ┌──────────────────┐
 *   │ ZAvatar          │   inline-flex
 *   │   width: `size`  │   默认 size=2.5(40px)
 *   │   height: `size` │   镜像 width,正方形
 *   │   border-radius:                          round 模式: _full(圆形,默认)
 *   │     square=true → sizePx(size*0.15)      ≈ 6px @ size=2.5
 *   │   font-size: sizePx(size*0.35)(text 模式)≈ 14px
 *   │   bg: _textSecondary(text/icon 模式)
 *   │   overflow: hidden
 *   └──────────────────┘
 *
 * 用户改 size 数字 → width / height / 文字字号 / 方形圆角等比缩(整体比例不变)。
 * 内容优先级:default slot > img(src) > text(首字母缩写) > 占位。
 * 非 px 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZAvatarProps>(), {
  alt: '',
  size: 2.5,
  square: false,
  // 文字 / icon 模式背景色默认 `_textSecondary`
  color: (c: Chain<ZuiSchema>['color']) => {
    c._textSecondary
  },
})

const theme = useZTheme()

const imgFailed = ref(false)

const showImage = computed(() => !!props.src && !imgFailed.value)
const showText = computed(() => !showImage.value && !!props.text)

const rootClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 2.5
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    // size(number):px 倍数(1 单位 = 16px),width + height 镜像保证正方形
    s.width.px(sizePx(size))
    s.height.px(sizePx(size))
    s.overflow.hidden
    s.verticalAlign('middle')
    s.userSelect.none
    if (props.square) s.borderRadius.px(sizePx(size * 0.15))
    else s.borderRadius._full
    if (!showImage.value) {
      // color factory(默认 `_textSecondary`,从 withDefaults 提供)桥接到 backgroundColor carrier
      s.backgroundColor(props.color)
      s.color._bg
      s.fontWeight._semibold
      // 文字字号按头像尺寸缩放(原先 14px 是为 2.5 × 16 = 40px 头像设计,比例 0.35)
      s.fontSize.px(sizePx(size * 0.35))
    }
    props.css?.(s)
  }),
)

const imgClass = computed(() =>
  icss(theme.value, s => {
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
