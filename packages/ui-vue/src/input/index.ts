/**
 * `input/` —— 数据录入组件。
 */
export { default as ZInput } from './ZInput.vue'
export type { ZInputProps, ZInputEmits } from './ZInput.vue'

export { default as ZTextarea } from './ZTextarea.vue'
export type { ZTextareaProps, ZTextareaEmits } from './ZTextarea.vue'

export { default as ZInputNumber } from './ZInputNumber.vue'
export type { ZInputNumberProps, ZInputNumberEmits } from './ZInputNumber.vue'

export { default as ZSwitch } from './ZSwitch.vue'
export type { ZSwitchProps, ZSwitchEmits } from './ZSwitch.vue'

export { default as ZCheckbox } from './ZCheckbox.vue'
export type { ZCheckboxProps, ZCheckboxEmits } from './ZCheckbox.vue'

export { default as ZCheckboxGroup } from './ZCheckboxGroup.vue'
export type {
  ZCheckboxGroupProps,
  ZCheckboxGroupEmits,
  ZCheckboxValue,
  ZCheckboxOption,
} from './ZCheckboxGroup.vue'

export { default as ZRadio } from './ZRadio.vue'
export type { ZRadioProps } from './ZRadio.vue'

export { default as ZRadioGroup } from './ZRadioGroup.vue'
export type {
  ZRadioGroupProps,
  ZRadioGroupEmits,
  ZRadioValue,
  ZRadioOption,
} from './ZRadioGroup.vue'

export { default as ZSelect } from './ZSelect.vue'
export type { ZSelectProps, ZSelectEmits, ZSelectValue, ZSelectOption } from './ZSelect.vue'

export { default as ZForm } from './ZForm.vue'
export type { ZFormProps, ZFormExpose, ZFormLabelPlacement, ZFormValidateTrigger } from './ZForm.vue'

export { default as ZFormItem } from './ZFormItem.vue'
export type { ZFormItemProps } from './ZFormItem.vue'

export type { ZFormRule, ZFormRules } from './_form-ctx'

// ─── Phase β input 补全 ───
export { default as ZSlider } from './ZSlider.vue'
export type { ZSliderProps, ZSliderEmits } from './ZSlider.vue'

export { default as ZRate } from './ZRate.vue'
export type { ZRateProps, ZRateEmits } from './ZRate.vue'

export { default as ZAutoComplete } from './ZAutoComplete.vue'
export type { ZAutoCompleteProps, ZAutoCompleteEmits } from './ZAutoComplete.vue'

export { default as ZUpload } from './ZUpload.vue'
export type { ZUploadProps, ZUploadEmits, ZUploadedFile } from './ZUpload.vue'

export { default as ZDatePicker } from './ZDatePicker.vue'
export type { ZDatePickerProps, ZDatePickerEmits } from './ZDatePicker.vue'

export { default as ZTimePicker } from './ZTimePicker.vue'
export type { ZTimePickerProps, ZTimePickerEmits } from './ZTimePicker.vue'

export { default as ZColorPicker } from './ZColorPicker.vue'
export type { ZColorPickerProps, ZColorPickerEmits } from './ZColorPicker.vue'

// ─── Phase γ ───
export { default as ZDynamicTags } from './ZDynamicTags.vue'
export type { ZDynamicTagsProps, ZDynamicTagsEmits } from './ZDynamicTags.vue'

export { default as ZTransfer } from './ZTransfer.vue'
export type { ZTransferProps, ZTransferEmits, ZTransferItem } from './ZTransfer.vue'

export { default as ZMention } from './ZMention.vue'
export type { ZMentionProps, ZMentionEmits } from './ZMention.vue'

export { default as ZCascader } from './ZCascader.vue'
export type { ZCascaderProps, ZCascaderEmits, ZCascaderOption, ZCascaderExpandTrigger } from './ZCascader.vue'

export { default as ZTreeSelect } from './ZTreeSelect.vue'
export type { ZTreeSelectProps, ZTreeSelectEmits } from './ZTreeSelect.vue'

// ─── Phase δ input 补全(2026-06)───
export { default as ZInputOTP } from './ZInputOTP.vue'
export type { ZInputOTPProps, ZInputOTPEmits, ZInputOTPType } from './ZInputOTP.vue'

export { default as ZDateRangePicker } from './ZDateRangePicker.vue'
export type { ZDateRangePickerProps, ZDateRangePickerEmits } from './ZDateRangePicker.vue'
