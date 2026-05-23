<script lang="ts">
/**
 * `ZFormItem` —— 表单项,渲染 label + control(slot)+ 错误信息。
 *
 * **API**:
 * - `prop: string` —— 对应 `ZForm.model[prop]` 字段名
 * - `label?: string` —— 字段显示名
 * - `rule?: Rule | Rule[]` —— 单字段规则(优先于 `ZForm.rules[prop]`)
 * - `required?: boolean` —— 必填标记(渲染 *,可独立于 rule)
 * - `validateTrigger?: 'change' | 'blur' | 'submit'` —— 覆盖 form 级
 * - `labelWidth?: string | number` —— 左对齐模式 label 宽度
 *
 * **slots**:`default` —— 表单控件;`label`(自定义 label)/ `error`(自定义错误信息)
 *
 * **a11y**:`<label>` + 关联控件 + `role="alert"` 错误。
 */
import type { RuleItem } from 'async-validator'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZFormItemProps {
  prop: string
  label?: string
  rule?: RuleItem | RuleItem[]
  required?: boolean
  validateTrigger?: 'change' | 'blur' | 'submit'
  labelWidth?: string | number
  /** label 节点 sx 配置(class/style/attrs/css)。 */
  sxLabel?: SxObject
  /** 控件包裹节点 sx 配置(slot 容器)。 */
  sxControl?: SxObject
  /** 错误信息节点 sx 配置。 */
  sxError?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import Schema from 'async-validator'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { Z_FORM_KEY } from './_form-ctx'

const props = withDefaults(defineProps<ZFormItemProps>(), {
  required: false,
})

const theme = useZTheme()

const form = inject(Z_FORM_KEY, null)

const errorMsg = ref<string | null>(null)

const effectiveLabelPlacement = computed(() => form?.labelPlacement.value ?? 'left')
const effectiveTrigger = computed(
  () => props.validateTrigger ?? form?.validateTrigger.value ?? 'change',
)

const resolvedRules = computed<RuleItem[]>(() => {
  const list: RuleItem[] = []
  if (props.required) list.push({ required: true, message: `${props.label ?? props.prop} 必填` })
  if (props.rule) {
    if (Array.isArray(props.rule)) list.push(...props.rule)
    else list.push(props.rule)
  }
  const fromForm = form?.rules.value?.[props.prop]
  if (fromForm) {
    if (Array.isArray(fromForm)) list.push(...(fromForm as RuleItem[]))
    else list.push(fromForm as RuleItem)
  }
  return list
})

async function validate(): Promise<void> {
  const rules = resolvedRules.value
  if (rules.length === 0 || !form) {
    errorMsg.value = null
    return
  }
  const value = form.model.value?.[props.prop]
  const validator = new Schema({ [props.prop]: rules })
  try {
    await validator.validate({ [props.prop]: value })
    errorMsg.value = null
  } catch (err: unknown) {
    const e = err as { errors?: { message?: string }[] }
    errorMsg.value = e.errors?.[0]?.message ?? '校验失败'
    throw err
  }
}

function reset(): void {
  errorMsg.value = null
}

// 跟随 trigger 自动校验:change/blur 在 model 字段变化时触发(简化:统一监听 model[prop])
watch(
  () => form?.model.value?.[props.prop],
  () => {
    if (effectiveTrigger.value === 'change') {
      validate().catch(() => {
        /* swallow,errorMsg 已写 */
      })
    }
  },
)

onMounted(() => {
  if (form) {
    form.registerItem({ prop: props.prop, label: props.label ?? '', validate, reset })
  }
})
onUnmounted(() => {
  if (form) {
    form.unregisterItem({ prop: props.prop, label: props.label ?? '', validate, reset })
  }
})

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    if (effectiveLabelPlacement.value === 'top') {
      s.flexDirection.column
      s.gap._tiny
    } else {
      s.flexDirection.row
      s.gap._small
      s.alignItems.flexStart
    }
    props.css?.(s)
  }),
)

const labelClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._text
    s.fontSize._middle
    s.lineHeight._normal
    s.fontWeight._medium
    if (effectiveLabelPlacement.value === 'left') {
      s.flexShrink(0)
      if (props.labelWidth !== undefined) {
        const w = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth
        s.width(w)
        s.textAlign.right
      }
      s.paddingTop.iem(0.375)
    }
    applySx(s, props.sxLabel)
  }),
)
const sxLabelAttrs = computed(() => extractSxAttrs(props.sxLabel))

const requiredMarkClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._danger
    s.marginRight._tiny
  }),
)

const controlClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
    applySx(s, props.sxControl)
  }),
)
const sxControlAttrs = computed(() => extractSxAttrs(props.sxControl))

const errorClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._danger
    s.fontSize._small
    s.lineHeight._normal
    applySx(s, props.sxError)
  }),
)
const sxErrorAttrs = computed(() => extractSxAttrs(props.sxError))

defineExpose({ validate, reset })
</script>

<template>
  <div :class="rootClass">
    <label
      v-if="label || $slots.label || required"
      :class="[labelClass, sxLabelAttrs.class]"
      :style="sxLabelAttrs.style"
      v-bind="sxLabelAttrs.attrs"
    >
      <span v-if="required" :class="requiredMarkClass">*</span>
      <slot name="label">{{ label }}</slot>
    </label>
    <div
      :class="[controlClass, sxControlAttrs.class]"
      :style="sxControlAttrs.style"
      v-bind="sxControlAttrs.attrs"
    >
      <slot />
      <div
        v-if="errorMsg"
        :class="[errorClass, sxErrorAttrs.class]"
        :style="sxErrorAttrs.style"
        role="alert"
        v-bind="sxErrorAttrs.attrs"
      >
        <slot name="error" :error="errorMsg">{{ errorMsg }}</slot>
      </div>
    </div>
  </div>
</template>
