<script lang="ts">
/**
 * `ZColorPicker` —— 颜色选择器(原生 `input[type=color]` + 显示当前色块 + 16 进制文字)。
 *
 * - `v-model:value` —— `#rrggbb` 格式
 * - `showText?: boolean` —— 显示色值文字,默认 true
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZColorPickerProps {
  value?: string
  disabled?: boolean
  showText?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZColorPickerEmits {
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZColorPickerProps>(), {
  value: '#000000',
  disabled: false,
  showText: true,
})

const emit = defineEmits<ZColorPickerEmits>()

const theme = useZTheme()

const wrapperClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._small
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.fontSize._middle
    if (props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    } else {
      s.cursor.pointer
      s._hover(h => {
        h.borderColor._primary
      })
    }
    props.css?.(s)
  }),
)

/**
 * 色块预览盒子模型(iem):
 * - width/height: 1.25iem,正方形(略大于复选框)
 * - border: _thin,圆角 _tiny
 */
const swatchClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineBlock
    s.width.iem(1.25)
    s.height.iem(1.25)
    s.borderRadius._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.flexShrink(0)
  }),
)

const valueTextClass = computed(() =>
  icss(theme.value, s => {
    s.color._text
    s.fontSize._small
    s.fontFamily._mono
  }),
)

const hiddenInputClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.opacity._none
    s.pointerEvents.none
    s.width.px(0)
    s.height.px(0)
  }),
)

function onInput(e: Event): void {
  const t = e.target as HTMLInputElement
  emit('update:value', t.value)
}
function onChange(e: Event): void {
  const t = e.target as HTMLInputElement
  emit('change', t.value)
}
</script>

<template>
  <label :class="wrapperClass">
    <span :class="swatchClass" :style="{ backgroundColor: value }" />
    <input
      type="color"
      :value="value"
      :disabled="disabled"
      :class="hiddenInputClass"
      @input="onInput"
      @change="onChange"
    />
    <span v-if="showText" :class="valueTextClass">{{ value }}</span>
  </label>
</template>
