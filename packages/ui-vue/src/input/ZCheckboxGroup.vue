<script lang="ts">
/**
 * `ZCheckboxGroup` —— 复选框组。`v-model:value` 为已选项数组。
 *
 * 子 `<ZCheckbox :value>` 通过 inject 拿到 group ctx,自动联动。
 *
 * **API**:
 * - `v-model:value`:`(string | number | boolean)[]`
 * - `disabled`:统一禁用所有子项
 * - `options?: Array<{ value, label, disabled? }>` —— 替代手写子 `<ZCheckbox>` 的快捷方式
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZCheckboxValue = string | number | boolean

export interface ZCheckboxOption {
  value: ZCheckboxValue
  label: string
  disabled?: boolean
}

export interface ZCheckboxGroupProps {
  value?: ZCheckboxValue[]
  disabled?: boolean
  options?: ZCheckboxOption[]
  /** 排列方向 carrier factory(`flexDirection`)。默认不写 = 浏览器原生 `row`(横排)。 */
  direction?: ((c: Chain<ZuiSchema>['flexDirection']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCheckboxGroupEmits {
  (e: 'update:value', value: ZCheckboxValue[]): void
  (e: 'change', value: ZCheckboxValue[]): void
}
</script>

<script lang="ts" setup>
import { computed, provide, toRef } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import ZCheckbox from './ZCheckbox.vue'
import { Z_CHECKBOX_GROUP_KEY, type CheckboxGroupCtx } from './_checkbox-group'

const props = withDefaults(defineProps<ZCheckboxGroupProps>(), {
  disabled: false,
})

const emit = defineEmits<ZCheckboxGroupEmits>()

const theme = useZTheme()

const valuesRef = computed<ZCheckboxValue[]>(() => props.value ?? [])
const disabledRef = toRef(props, 'disabled')

const ctx: CheckboxGroupCtx = {
  values: valuesRef,
  disabled: disabledRef,
  toggle(val: ZCheckboxValue, checked: boolean) {
    const cur = valuesRef.value
    let next: ZCheckboxValue[]
    if (checked) {
      next = cur.includes(val) ? [...cur] : [...cur, val]
    } else {
      next = cur.filter(v => v !== val)
    }
    emit('update:value', next)
    emit('change', next)
  },
}

provide(Z_CHECKBOX_GROUP_KEY, ctx)

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    if (props.direction) s.flexDirection(props.direction)
    s.gap._small
    s.flexWrap.wrap
    props.css?.(s)
  }),
)
</script>

<template>
  <div :class="rootClass" role="group">
    <template v-if="options && options.length > 0">
      <ZCheckbox
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
