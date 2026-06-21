<script setup lang="ts">
import { ref } from 'vue'
import { ZSelect, ZFlex } from '@kenconnet666/zui-vue'

const v = ref<string | null>(null)

const options = [
  { value: 'vue', label: 'Vue 3' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- sxTrigger：自定义触发器边框颜色 -->
    <ZSelect
      v-model:value="v"
      :options="options"
      placeholder="sxTrigger 自定义触发器"
      :sx-trigger="{
        css: s => {
          s.borderColor._primary
          s.borderRadius.px(20)
        },
      }"
    />

    <!-- sxDropdown：自定义下拉框背景 -->
    <ZSelect
      v-model:value="v"
      :options="options"
      placeholder="sxDropdown 自定义下拉"
      :sx-dropdown="{
        css: s => {
          s.borderColor._primary
        },
      }"
    />

    <!-- sxOption：自定义选项字重 -->
    <ZSelect
      v-model:value="v"
      :options="options"
      placeholder="sxOption 自定义选项"
      :sx-option="{
        css: s => {
          s.fontWeight._semibold
        },
      }"
    />
  </ZFlex>
</template>
