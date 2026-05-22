/**
 * `_form-ctx` —— ZForm <-> ZFormItem 之间通过 provide/inject 共享的 ctx 类型。
 */
import type { InjectionKey, Ref } from 'vue'
import type { Rules, RuleItem } from 'async-validator'

export interface FormItemContext {
  prop: string
  label: string
  validate: () => Promise<void>
  reset: () => void
}

export interface FormContext {
  /** 表单数据 model(reactive 对象)。 */
  model: Ref<Record<string, unknown>>
  /** 表单字段 rules map。 */
  rules: Ref<Rules | undefined>
  /** label 位置。 */
  labelPlacement: Ref<'top' | 'left'>
  /** 校验触发时机(`change` / `blur` / `submit`)。 */
  validateTrigger: Ref<'change' | 'blur' | 'submit'>
  /** 全局 disabled(子组件可继承)。 */
  disabled: Ref<boolean>
  /** 注册 / 注销 FormItem(供 ZForm.validate() 全表单校验)。 */
  registerItem: (item: FormItemContext) => void
  unregisterItem: (item: FormItemContext) => void
}

export const Z_FORM_KEY: InjectionKey<FormContext> = Symbol('zui:form')

export type ZFormRule = RuleItem
export type ZFormRules = Rules
