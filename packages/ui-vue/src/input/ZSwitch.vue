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
import type { SizePropMulti } from '../_internal/size-prop'

export interface ZSwitchProps {
  value?: boolean
  /**
   * 尺寸 —— **纯 chain factory**(2026-05-23 撤销 Size5 union)。
   *
   * **默认**:`(s) => { s.height.iem(1.25); s.width.iem(2.5) }`(等价旧 middle 档位)。
   *
   * **参考档位**(width 总是 2*height):tiny(0.875iem) / small(1iem) / middle(1.25iem) /
   * large(1.5iem) / huge(1.75iem)。
   *
   * **注意**:factory 只控制 rail 的 width/height,thumb 位置按 middle 档位(1.25iem)兜底
   * 计算(thumb 想差异化定位走 `sxThumb` 覆盖)。
   *
   * @example
   * <ZSwitch :size="(s) => { s.height.iem(1.5); s.width.iem(3) }" />
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

const props = withDefaults(defineProps<ZSwitchProps>(), {
  value: false,
  // 默认等价旧 middle 档位:height=1.25iem,width=2.5iem(rail 宽高比 2:1)
  size: (s: Chain<ZuiSchema>) => {
    s.height.iem(1.25)
    s.width.iem(2.5)
  },
  disabled: false,
  loading: false,
})

const emit = defineEmits<ZSwitchEmits>()

const theme = useZTheme()

/**
 * thumb / label 位置计算用的 height iem 数字 —— **factory 模式无法读出实际尺寸**,
 * 统一按 middle(1.25iem)兜底,thumb 想差异化定位走 `sxThumb` 覆盖。
 */
const sizeIemRef = computed<number>(() => 1.25)

const railClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.position.relative
    // size(纯 factory,多 carrier):user factory 接整个 chain 自行写 width + height
    props.size?.(s)
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
  icss(theme.value, (s) => {
    const h = sizeIemRef.value
    const thumb = h * 0.8
    s.position.absolute
    s.top.iem((h - thumb) / 2)
    s.left.iem(
      props.value
        ? h * 2 - thumb - (h - thumb) / 2
        : (h - thumb) / 2,
    )
    s.width.iem(thumb)
    s.height.iem(thumb)
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
    s.position.absolute
    const offset = sizeIemRef.value * 0.25
    if (props.value) s.left.iem(offset)
    else s.right.iem(offset)
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
