<script lang="ts">
/**
 * `ZSwitch` —— 开关组件。
 *
 * - `v-model:value`(boolean)
 * - `size?: 'small' | 'middle' | 'large'`
 * - `disabled` / `loading`
 * - `checkedLabel?: string` / `uncheckedLabel?: string` —— 内嵌文字
 * - sx:sxRail / sxThumb
 *
 * **a11y**:`role="switch"` + `aria-checked`,键盘 Space 切换。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZSwitchProps {
  value?: boolean
  /**
   * 尺寸 —— `number`(iem 倍数,默认 2.5 = rail width)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   *
   * 内部按比例:
   * - `width` = `size`(iem)
   * - `height` = `size * 0.6`(rail 宽高比 1.67:1)
   * - thumb / label 位置自动按 height 计算
   *
   * @example
   * <ZSwitch :size="3" />        <!-- 3iem 宽 -->
   * <ZSwitch :size="2" />        <!-- 2iem 宽小开关 -->
   */
  size?: number
  disabled?: boolean
  loading?: boolean
  checkedLabel?: string
  uncheckedLabel?: string
  sxRail?: SxObject
  sxThumb?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSwitchEmits {
  /** 状态变化(支持 `v-model:value`)。v0.2 删除等价的 `change`。 */
  (e: 'update:value', value: boolean): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────────────────┐
 *   │ rail  inline-flex / center / relative│
 *   │   width: `size` iem                  │   默认 size=2.5(40px @ 1080p)
 *   │   height: size*0.6 iem               │   = 1.5iem(24px),宽高比 1.67:1
 *   │   border-radius: _full(胶囊)       │   value=true → bg _primary
 *   │   bg: _primary(开) / _border(关)  │   value=false → bg _border
 *   │                                      │
 *   │  ┌────────┐ ┌──────┐                 │   thumb(value 切换位置):
 *   │  │label   │ │thumb │                 │     width/height: height*0.8 iem
 *   │  │( inset)│ │圆形  │                 │       = size*0.48 iem(1.2iem,19.2px)
 *   │  │ _tiny  │ │_full │                 │     border-radius: _full / bg _bg
 *   │  └────────┘ │_small│                 │     top: (height-thumb)/2
 *   │             └──────┘                 │     left: 切换时滑动
 *   │                                      │
 *   │  label(选填,inset 在 thumb 外侧)  │   fontSize _tiny  color _bg
 *   └──────────────────────────────────────┘
 *
 * 用户改 size 数字 → rail 宽度 + height(0.6 倍) + thumb 位置等比缩(整体比例不变)。
 * disabled / loading 时 opacity _dim,cursor not-allowed。非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZSwitchProps>(), {
  value: false,
  size: 2.5,
  disabled: false,
  loading: false,
})

const emit = defineEmits<ZSwitchEmits>()

const theme = useZTheme()

/** rail 高度 iem 数字(= size * 0.6,宽高比 1.67:1 接近旧 middle 1.25 / 2.5)。 */
const railHeightIem = computed<number>(() => (props.size ?? 2.5) * 0.6)
const railWidthIem = computed<number>(() => props.size ?? 2.5)

const railClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.position.relative
    s.width.px(sizePx(railWidthIem.value))
    s.height.px(sizePx(railHeightIem.value))
    s.borderRadius._full
    s.transitionProperty._colors
    s.transitionDuration._small
    s.cursor.pointer
    s.borderStyle.none
    s.padding.px(0)
    s.outline('none')
    if (props.value) s.backgroundColor._primary
    else s.backgroundColor._border
    if (props.disabled || props.loading) {
      s.opacity._dim
      s.cursor.notAllowed
    }
    applySx(s, props.sxRail)
    props.css?.(s)
  }),
)
const sxRailAttrs = computed(() => extractSxAttrs(props.sxRail))

const thumbClass = computed(() =>
  icss(theme.value, s => {
    const h = railHeightIem.value
    const w = railWidthIem.value
    const thumb = h * 0.8
    s.position.absolute
    s.top.px(sizePx((h - thumb) / 2))
    s.left.px(sizePx(props.value ? w - thumb - (h - thumb) / 2 : (h - thumb) / 2))
    s.width.px(sizePx(thumb))
    s.height.px(sizePx(thumb))
    s.borderRadius._full
    s.backgroundColor._bg
    s.boxShadow._small
    s.transitionProperty._default
    s.transitionDuration._small
    applySx(s, props.sxThumb)
  }),
)
const sxThumbAttrs = computed(() => extractSxAttrs(props.sxThumb))

const labelClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    const offset = railHeightIem.value * 0.25
    if (props.value) s.left.px(sizePx(offset))
    else s.right.px(sizePx(offset))
    s.color._bg
    s.fontSize._tiny
    s.pointerEvents.none
  }),
)

function toggle(): void {
  if (props.disabled || props.loading) return
  const next = !props.value
  emit('update:value', next)
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <button
    type="button"
    :ref="sxRailAttrs.ref"
    :class="[railClass, sxRailAttrs.class]"
    :style="sxRailAttrs.style"
    role="switch"
    :aria-checked="value"
    :aria-disabled="disabled || loading"
    :tabindex="disabled ? -1 : 0"
    v-bind="sxRailAttrs.attrs"
    @click="toggle"
    @keydown="onKeydown"
  >
    <span v-if="value && checkedLabel" :class="labelClass">{{ checkedLabel }}</span>
    <span v-else-if="!value && uncheckedLabel" :class="labelClass">{{ uncheckedLabel }}</span>
    <span
      :ref="sxThumbAttrs.ref"
      :class="[thumbClass, sxThumbAttrs.class]"
      :style="sxThumbAttrs.style"
      v-bind="sxThumbAttrs.attrs"
    />
  </button>
</template>
