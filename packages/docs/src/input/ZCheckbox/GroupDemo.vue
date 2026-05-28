<script setup lang="ts">
import { computed, ref } from 'vue'
import { ZCheckbox, ZCheckboxGroup, ZSpace, ZText } from '@kenconnet666/zui-vue'

const checked = ref<string[]>(['apple'])
const fruits = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]

const all = fruits.map(f => f.value)
const checkAll = computed({
  get: () => checked.value.length === all.length,
  set: (v: boolean) => {
    checked.value = v ? [...all] : []
  },
})
const indeterminate = computed(() => checked.value.length > 0 && checked.value.length < all.length)
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >全选 + indeterminate 半选态</ZText
    >
    <ZCheckbox v-model:checked="checkAll" :indeterminate="indeterminate" label="全选" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >CheckboxGroup options 配置</ZText
    >
    <ZCheckboxGroup v-model:value="checked" :options="fruits" />

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >已选:{{ checked.join(', ') || '空' }}</ZText
    >
  </ZSpace>
</template>
