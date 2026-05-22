/**
 * `_checkbox-group` —— ZCheckboxGroup 上下文 inject key + 类型(供 ZCheckbox 用)。
 */
import type { InjectionKey, Ref } from 'vue'

export interface CheckboxGroupCtx {
  values: Ref<(string | number | boolean)[]>
  disabled: Ref<boolean>
  toggle: (val: string | number | boolean, checked: boolean) => void
}

export const Z_CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupCtx> = Symbol('zui:checkbox-group')
