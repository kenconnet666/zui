/**
 * `_radio-group` —— ZRadioGroup 上下文 inject key + 类型。
 */
import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupCtx {
  value: Ref<string | number | boolean | null>
  disabled: Ref<boolean>
  buttonStyle: Ref<boolean>
  select: (val: string | number | boolean) => void
}

export const Z_RADIO_GROUP_KEY: InjectionKey<RadioGroupCtx> = Symbol('zui:radio-group')
