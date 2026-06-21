<script setup lang="ts">
import { ZCascader, ZFlex } from '@kenconnet666/zui-vue'

/* 整体禁用 — disabled prop */
const options = [
  {
    value: 'china',
    label: '中国',
    children: [
      {
        value: 'beijing',
        label: '北京',
        children: [
          { value: 'chaoyang', label: '朝阳区' },
        ],
      },
    ],
  },
]
</script>

<template>
  <!-- disabled=true 时触发器不可点击，整体呈半透明禁用态 -->
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- 有默认值的禁用态 -->
    <ZCascader
      :value="['china', 'beijing', 'chaoyang']"
      :options="options"
      :disabled="true"
      placeholder="已禁用（有值）"
    />

    <!-- 无值的禁用态 -->
    <ZCascader
      :options="options"
      :disabled="true"
      placeholder="已禁用（无值）"
    />
  </ZFlex>
</template>
