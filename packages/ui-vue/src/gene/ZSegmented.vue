<script lang="ts">
/**
 * `ZSegmented` —— 分段控制器(类 iOS Segmented Control / antd Segmented)。
 *
 * - `v-model:value` —— 选中的 key
 * - `options: Array<{ value, label, disabled? }>`
 * - `size?: 'small' | 'middle' | 'large'`
 * - `block?: boolean` —— 满宽
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SizePropMulti } from '../_internal/size-prop'

export interface ZSegmentedOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface ZSegmentedProps {
  value?: string | number
  options: ZSegmentedOption[]
  /**
   * 尺寸 —— **纯 chain factory**(2026-05-23 撤销 Size5 union),影响每项的 padding-y。
   *
   * **默认**:`(s) => { s.paddingTop.iem(0.25); s.paddingBottom.iem(0.25) }`(等价旧 middle)。
   *
   * **参考档位**:small(0.125iem) / middle(0.25iem) / large(0.375iem)。
   *
   * @example
   * <ZSegmented :size="(s) => { s.paddingTop.iem(0.5); s.paddingBottom.iem(0.5) }" />
   */
  size?: SizePropMulti
  block?: boolean
  disabled?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZSegmentedEmits {
  (e: 'update:value', value: string | number): void
  (e: 'change', value: string | number): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZSegmentedProps>(), {
  // 默认等价旧 middle 档位:paddingTop/Bottom 0.25iem
  size: (s: Chain<ZuiSchema>) => {
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
  },
  block: false,
  disabled: false,
})

const emit = defineEmits<ZSegmentedEmits>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.padding._tiny
    s.backgroundColor._bgMuted
    s.borderRadius._small
    s.gap._tiny
    if (props.block) s.width.pct(100)
    if (props.disabled) s.opacity._dim
    props.css?.(s)
  }),
)

const itemClass = (opt: ZSegmentedOption): string => {
  const isActive = props.value === opt.value
  const isDisabled = opt.disabled || props.disabled
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.borderStyle.none
    s.cursor(isDisabled ? 'not-allowed' : 'pointer')
    s.borderRadius._tiny
    s.fontSize._middle
    s.fontWeight._medium
    s.paddingLeft._middle
    s.paddingRight._middle
    // size(纯 factory,多 carrier):user factory 接整个 chain 自行写 padding
    props.size?.(s)
    s.transitionProperty._colors
    s.transitionDuration._small
    if (props.block) s.flexGrow(1)
    if (isActive) {
      s.backgroundColor._bg
      s.color._text
      s.boxShadow._tiny
    } else {
      s.backgroundColor.transparent
      s.color._textSecondary
      s._hover((h) => {
        if (!isDisabled) h.color._text
      })
    }
    if (isDisabled) s.opacity._dim
  })
}

function select(opt: ZSegmentedOption): void {
  if (opt.disabled || props.disabled) return
  if (props.value === opt.value) return
  emit('update:value', opt.value)
  emit('change', opt.value)
}
</script>

<template>
  <div :class="rootClass" role="radiogroup">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      :class="itemClass(opt)"
      role="radio"
      :aria-checked="value === opt.value"
      :disabled="opt.disabled || disabled"
      @click="select(opt)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
