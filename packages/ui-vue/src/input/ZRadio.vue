<script lang="ts">
/**
 * `ZRadio` —— 单选(配合 `ZRadioGroup` 使用)。
 *
 * `ZRadioGroup buttonStyle=true` → 渲染按钮组形态;默认走经典单选圆点。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZRadioValue = string | number | boolean

export interface ZRadioProps {
  value: ZRadioValue
  label?: string
  disabled?: boolean
  sxDot?: SxObject
  sxLabel?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { Z_RADIO_GROUP_KEY, type RadioGroupCtx } from './_radio-group'

const props = withDefaults(defineProps<ZRadioProps>(), {
  disabled: false,
})

const theme = useZTheme()

const group = inject<RadioGroupCtx | null>(Z_RADIO_GROUP_KEY, null)

const isChecked = computed(() => group?.value.value === props.value)
const isDisabled = computed(() => props.disabled || group?.disabled.value === true)
const isButton = computed(() => group?.buttonStyle.value === true)

const dotRootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.cursor.pointer
    s.color._text
    s.fontSize._middle
    if (isDisabled.value) {
      s.opacity._dim
      s.cursor.notAllowed
    }
    props.css?.(s)
  }),
)

/**
 * 单选外圈盒子模型(iem):
 * - width/height: 1iem,正圆(borderRadius._full)
 * - border: _thin
 */
const dotClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.iem(1)
    s.height.iem(1)
    s.borderRadius._full
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.transitionProperty._colors
    s.transitionDuration._small
    if (isChecked.value) {
      s.borderColor._primary
    }
    applySx(s, props.sxDot)
  }),
)
const sxDotAttrs = computed(() => extractSxAttrs(props.sxDot))

/**
 * 单选内圆点盒子模型(iem):
 * - width/height: 0.5iem(外圈一半),正圆
 * - 选中时 scale(1),否则 scale(0)折叠
 */
const innerDotClass = computed(() =>
  icss(theme.value, (s) => {
    s.width.iem(0.5)
    s.height.iem(0.5)
    s.borderRadius._full
    s.backgroundColor._primary
    s.transform(isChecked.value ? 'scale(1)' : 'scale(0)')
    s.transitionProperty._transform
    s.transitionDuration._small
  }),
)

const buttonClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.padding._small
    s.paddingLeft._middle
    s.paddingRight._middle
    s.cursor.pointer
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.fontSize._middle
    s.transitionProperty._colors
    s.transitionDuration._small
    if (isChecked.value) {
      s.borderColor._primary
      s.color._primary
      s.backgroundColor._primary.alpha(8)
    }
    if (isDisabled.value) {
      s.opacity._dim
      s.cursor.notAllowed
    }
    props.css?.(s)
  }),
)

const sxLabelAttrs = computed(() => extractSxAttrs(props.sxLabel))

function onSelect(): void {
  if (isDisabled.value || !group) return
  group.select(props.value)
}
</script>

<template>
  <template v-if="isButton">
    <button
      type="button"
      :class="buttonClass"
      :aria-checked="isChecked"
      role="radio"
      :disabled="isDisabled"
      :tabindex="isChecked ? 0 : -1"
      @click="onSelect"
    >
      <slot>{{ label }}</slot>
    </button>
  </template>
  <template v-else>
    <label :class="dotRootClass">
      <span
        :class="[dotClass, sxDotAttrs.class]"
        :style="sxDotAttrs.style"
        v-bind="sxDotAttrs.attrs"
      >
        <span :class="innerDotClass" />
      </span>
      <input
        type="radio"
        :checked="isChecked"
        :disabled="isDisabled"
        :value="String(value)"
        style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0"
        @change="onSelect"
      />
      <span
        v-if="label || $slots.default"
        :style="sxLabelAttrs.style"
        v-bind="sxLabelAttrs.attrs"
      >
        <slot>{{ label }}</slot>
      </span>
    </label>
  </template>
</template>
