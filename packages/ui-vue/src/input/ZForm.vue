<script lang="ts">
/**
 * `ZForm` —— 表单容器(基于 `async-validator`)。
 *
 * **API**:
 * - `model: object` —— 表单数据(reactive)
 * - `rules?: Rules` —— `async-validator` 规则字典(以字段名为 key)
 * - `labelPlacement?: 'top' | 'left'` —— 默认 `'left'`
 * - `validateTrigger?: 'change' | 'blur' | 'submit'` —— 全局触发时机(子 FormItem 可覆盖)
 * - `disabled?: boolean` —— 整表禁用(子组件按需读取)
 *
 * **方法**(`defineExpose`):
 * - `validate(): Promise<void>` —— 校验所有字段,reject `{ errors, fields }`
 * - `reset(): void` —— 重置错误状态(不重置 model)
 *
 * **a11y**:`<form>` 原生即可。
 */
import type { Rules } from 'async-validator'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZFormProps {
  model: Record<string, unknown>
  rules?: Rules
  labelPlacement?: 'top' | 'left'
  validateTrigger?: 'change' | 'blur' | 'submit'
  disabled?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZFormExpose {
  validate: () => Promise<void>
  reset: () => void
}
</script>

<script lang="ts" setup>
import { computed, provide, ref, toRef } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import {
  Z_FORM_KEY,
  type FormContext,
  type FormItemContext,
} from './_form-ctx'

const props = withDefaults(defineProps<ZFormProps>(), {
  labelPlacement: 'left',
  validateTrigger: 'change',
  disabled: false,
})

const theme = useZTheme()

const items = ref<FormItemContext[]>([])

const ctx: FormContext = {
  model: computed(() => props.model) as unknown as FormContext['model'],
  rules: computed(() => props.rules) as unknown as FormContext['rules'],
  labelPlacement: toRef(props, 'labelPlacement'),
  validateTrigger: toRef(props, 'validateTrigger'),
  disabled: toRef(props, 'disabled'),
  registerItem(item) {
    items.value.push(item)
  },
  unregisterItem(item) {
    const idx = items.value.indexOf(item)
    if (idx >= 0) items.value.splice(idx, 1)
  },
}

provide(Z_FORM_KEY, ctx)

async function validate(): Promise<void> {
  await Promise.all(items.value.map((i) => i.validate()))
}

function reset(): void {
  items.value.forEach((i) => i.reset())
}

const rootRef = ref<HTMLFormElement | null>(null)
defineExpose<ZFormExpose & { rootRef: typeof rootRef }>({ validate, reset, rootRef })

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.gap._middle
    s.color._text
    props.css?.(s)
  }),
)
</script>

<template>
  <form ref="rootRef" :class="rootClass" @submit.prevent>
    <slot />
  </form>
</template>
