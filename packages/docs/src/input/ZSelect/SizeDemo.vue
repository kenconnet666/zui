<script setup lang="ts">
import { ref } from 'vue'
import { ZSelect, ZFlex } from '@kenconnet666/zui-vue'

const v = ref<string | null>(null)

const options = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- size 三档 -->
    <ZSelect
      v-model:value="v"
      :options="options"
      placeholder="size=0.875（小）"
      :size="0.875"
    />
    <ZSelect
      v-model:value="v"
      :options="options"
      placeholder="size=1（默认）"
      :size="1"
    />
    <ZSelect
      v-model:value="v"
      :options="options"
      placeholder="size=1.25（大）"
      :size="1.25"
    />

    <!-- optionSize / dropdownMaxHeight 独立控制 -->
    <ZSelect
      v-model:value="v"
      :options="options"
      placeholder="optionSize=3 / dropdownMaxHeight=10"
      :option-size="3"
      :dropdown-max-height="10"
    />
  </ZFlex>
</template>
