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
import type { Size5, SizePropMulti } from '../_internal/size-prop'

export interface ZSwitchProps {
  value?: boolean
  /**
   * 尺寸 —— `factory | Size5 | undefined` union。
   *
   * **注意**:`factory` 路径只控制 rail 的 width/height,thumb 位置走 `'middle'` 兜底
   * 计算(thumb 想差异化定位走 `sxThumb` 覆盖)。
   */
  size?: SizePropMulti
  disabled?: boolean
  loading?: boolean
  checkedLabel?: string
  uncheckedLabel?: string
  sxRail?: SxObject
  sxThumb?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSwitchEmits {
  (e: 'update:value', value: boolean): void
  (e: 'change', value: boolean): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { applySizeProp, makeSizeMap } from '../_internal/size-prop'

const props = withDefaults(defineProps<ZSwitchProps>(), {
  value: false,
  size: 'middle',
  disabled: false,
  loading: false,
})

const emit = defineEmits<ZSwitchEmits>()

const theme = useZTheme()

/** rail iem 倍率(height,width 总是 height*2)。 */
const SIZE_HEIGHT_IEM: Record<Size5, number> = {
  tiny: 0.875,
  small: 1,
  middle: 1.25,
  large: 1.5,
  huge: 1.75,
}

/** ZSwitch rail size 档位 —— width=2*height(rail 宽高比)。 */
const SIZE_MAP = makeSizeMap<Chain<ZuiSchema>>({
  tiny: (s) => {
    s._prop('height', `calc(${SIZE_HEIGHT_IEM.tiny} * var(--zui-iem, 16px))`)
    s._prop('width', `calc(${SIZE_HEIGHT_IEM.tiny * 2} * var(--zui-iem, 16px))`)
  },
  small: (s) => {
    s._prop('height', `calc(${SIZE_HEIGHT_IEM.small} * var(--zui-iem, 16px))`)
    s._prop('width', `calc(${SIZE_HEIGHT_IEM.small * 2} * var(--zui-iem, 16px))`)
  },
  middle: (s) => {
    s._prop('height', `calc(${SIZE_HEIGHT_IEM.middle} * var(--zui-iem, 16px))`)
    s._prop('width', `calc(${SIZE_HEIGHT_IEM.middle * 2} * var(--zui-iem, 16px))`)
  },
  large: (s) => {
    s._prop('height', `calc(${SIZE_HEIGHT_IEM.large} * var(--zui-iem, 16px))`)
    s._prop('width', `calc(${SIZE_HEIGHT_IEM.large * 2} * var(--zui-iem, 16px))`)
  },
  huge: (s) => {
    s._prop('height', `calc(${SIZE_HEIGHT_IEM.huge} * var(--zui-iem, 16px))`)
    s._prop('width', `calc(${SIZE_HEIGHT_IEM.huge * 2} * var(--zui-iem, 16px))`)
  },
})

/** thumb / label 位置计算用的 height iem 数字(factory 模式兜底用 middle)。 */
const sizeIemRef = computed<number>(() => {
  if (typeof props.size === 'string') return SIZE_HEIGHT_IEM[props.size]
  return SIZE_HEIGHT_IEM.middle
})

const railClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s._prop('position', 'relative')
    applySizeProp(props.size, SIZE_MAP, s)
    s.borderRadius._full
    s.transitionProperty._colors
    s.transitionDuration._small
    s.cursor.pointer
    s._prop('borderStyle', 'none')
    s._prop('padding', '0')
    s._prop('outline', 'none')
    if (props.value) s.backgroundColor._primary
    else s.backgroundColor._border
    if (props.disabled || props.loading) {
      s.opacity._dim
      s._prop('cursor', 'not-allowed')
    }
    applySx(s, props.sxRail)
    props.css?.(s)
  }),
)
const sxRailAttrs = computed(() => extractSxAttrs(props.sxRail))

const thumbClass = computed(() =>
  icss(theme.value, (s) => {
    const h = sizeIemRef.value
    const thumb = h * 0.8
    s._prop('position', 'absolute')
    s._prop('top', `calc(${(h - thumb) / 2} * var(--zui-iem, 16px))`)
    s._prop(
      'left',
      props.value
        ? `calc(${h * 2 - thumb - (h - thumb) / 2} * var(--zui-iem, 16px))`
        : `calc(${(h - thumb) / 2} * var(--zui-iem, 16px))`,
    )
    s._prop('width', `calc(${thumb} * var(--zui-iem, 16px))`)
    s._prop('height', `calc(${thumb} * var(--zui-iem, 16px))`)
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
  icss(theme.value, (s) => {
    s._prop('position', 'absolute')
    s._prop(
      props.value ? 'left' : 'right',
      `calc(${sizeIemRef.value * 0.25} * var(--zui-iem, 16px))`,
    )
    s.color._bg
    s.fontSize._tiny
    s.pointerEvents.none
  }),
)

function toggle(): void {
  if (props.disabled || props.loading) return
  const next = !props.value
  emit('update:value', next)
  emit('change', next)
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
    <span
      v-if="value && checkedLabel"
      :class="labelClass"
    >{{ checkedLabel }}</span>
    <span
      v-else-if="!value && uncheckedLabel"
      :class="labelClass"
    >{{ uncheckedLabel }}</span>
    <span
      :class="[thumbClass, sxThumbAttrs.class]"
      :style="sxThumbAttrs.style"
      v-bind="sxThumbAttrs.attrs"
    />
  </button>
</template>
