<script lang="ts">
/**
 * `ZRadioGroup` —— 单选组。`v-model:value` 为选中值。
 *
 * - `buttonStyle: boolean` —— 子 `ZRadio` 渲染为按钮组形态(默认 `false` 走圆点)
 * - `options?: Array<{ value, label, disabled? }>` —— 快捷写法
 * - `direction: 'horizontal' | 'vertical'`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZRadioValue = string | number | boolean

export interface ZRadioOption {
  value: ZRadioValue
  label: string
  disabled?: boolean
}

export interface ZRadioGroupProps {
  value?: ZRadioValue | null
  disabled?: boolean
  buttonStyle?: boolean
  options?: ZRadioOption[]
  direction?: 'horizontal' | 'vertical'
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZRadioGroupEmits {
  (e: 'update:value', value: ZRadioValue): void
  (e: 'change', value: ZRadioValue): void
}
</script>

<script lang="ts" setup>
import { computed, provide, toRef } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import ZRadio from './ZRadio.vue'
import { Z_RADIO_GROUP_KEY, type RadioGroupCtx } from './_radio-group'

const props = withDefaults(defineProps<ZRadioGroupProps>(), {
  value: null,
  disabled: false,
  buttonStyle: false,
  direction: 'horizontal',
})

const emit = defineEmits<ZRadioGroupEmits>()

const theme = useZTheme()

const valueRef = computed<ZRadioValue | null>(() => props.value ?? null)

const ctx: RadioGroupCtx = {
  value: valueRef,
  disabled: toRef(props, 'disabled'),
  buttonStyle: toRef(props, 'buttonStyle'),
  select(val: ZRadioValue) {
    emit('update:value', val)
    emit('change', val)
  },
}

provide(Z_RADIO_GROUP_KEY, ctx)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.flexDirection(props.direction === 'vertical' ? 'column' : 'row')
    s.gap(props.buttonStyle ? '0' : 'calc(0.5 * var(--zui-iem, 16px))')
    s.flexWrap.wrap
    if (props.buttonStyle) {
      // button 模式下子按钮间不留 gap,但首尾圆角处理通过 css 自定义,这里仅基础
      s.borderRadius.iem(0.5)
      s.overflow.hidden
    }
    props.css?.(s)
  }),
)

</script>

<template>
  <div :class="rootClass" role="radiogroup">
    <template v-if="options && options.length > 0">
      <ZRadio
        v-for="opt in options"
        :key="String(opt.value)"
        :value="opt.value"
        :label="opt.label"
        :disabled="opt.disabled ?? false"
      />
    </template>
    <slot v-else />
  </div>
</template>
