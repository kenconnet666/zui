<script lang="ts">
/**
 * `ZAvatarGroup` —— 头像组：多个头像重叠排列,超出 `max` 折叠为 `+N`。
 * 数据驱动(`items`),每个头像带 `_bg` 圆环以区分重叠边界。
 *
 * **API**:
 * - `items: ZAvatarGroupItem[]` —— 头像数据(src / text / alt)
 * - `max?: number` —— 最多显示个数,其余折叠为 `+N`(默认全显)
 * - `size?: number` —— 统一尺寸(px 倍数,1 单位 = 16px,默认 `2.5` = 40px)
 * - `overlap?: number` —— 相邻重叠比例(占 size 的比例,默认 `0.3`)
 * - `square?: boolean` —— 方形(默认圆形)
 * - `color?` —— `+N` 余量头像背景色 factory
 * - `css?` —— 根元素兜底
 *
 * @example
 * <ZAvatarGroup :items="[{ text: 'A' }, { text: 'B' }, { src: '...' }]" :max="3" />
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZAvatarGroupItem {
  src?: string
  text?: string
  alt?: string
}

export interface ZAvatarGroupProps {
  items: ZAvatarGroupItem[]
  max?: number
  size?: number
  overlap?: number
  square?: boolean
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'
import ZAvatar from './ZAvatar.vue'

const props = withDefaults(defineProps<ZAvatarGroupProps>(), {
  size: 2.5,
  overlap: 0.3,
  square: false,
})

const theme = useZTheme()

const sizeVal = computed(() => props.size ?? 2.5)
const overlapPx = computed(() => sizePx(sizeVal.value * (props.overlap ?? 0.3)))
const visible = computed(() =>
  props.max !== undefined ? props.items.slice(0, props.max) : props.items,
)
const restCount = computed(() =>
  props.max !== undefined ? Math.max(0, props.items.length - props.max) : 0,
)

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    props.css?.(s)
  }),
)

/** 每个头像:`_bg` 圆环 + 非首个负 margin 形成重叠。 */
function avatarCss(index: number): (s: Chain<ZuiSchema>) => void {
  return s => {
    s.borderWidth._middle
    s.borderStyle.solid
    s.borderColor._bg
    if (index > 0) s.marginLeft.px(-overlapPx.value)
  }
}
</script>

<template>
  <div :class="rootClass" role="group" :aria-label="`头像组，共 ${items.length} 个`">
    <ZAvatar
      v-for="(it, i) in visible"
      :key="i"
      :src="it.src"
      :text="it.text"
      :alt="it.alt"
      :size="sizeVal"
      :square="square"
      :css="avatarCss(i)"
    />
    <ZAvatar
      v-if="restCount > 0"
      :text="`+${restCount}`"
      :size="sizeVal"
      :square="square"
      :color="color"
      :css="avatarCss(visible.length)"
    />
  </div>
</template>
