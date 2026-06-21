<script setup lang="ts">
import { ZCascader, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/* 省市区三级示例数据 */
const options = [
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      {
        value: 'nanjing',
        label: '南京市',
        children: [
          { value: 'xuanwu', label: '玄武区' },
          { value: 'jianye', label: '建邺区' },
        ],
      },
      {
        value: 'suzhou',
        label: '苏州市',
        children: [
          { value: 'gusu', label: '姑苏区' },
          { value: 'wuzhong', label: '吴中区' },
        ],
      },
    ],
  },
]

const v1 = ref<string[]>(['jiangsu', 'nanjing', 'xuanwu'])
const v2 = ref<string[]>(['jiangsu', 'nanjing', 'xuanwu'])
const v3 = ref<string[]>(['jiangsu', 'nanjing', 'xuanwu'])
</script>

<template>
  <!-- separator 决定触发器中路径各级之间的拼接字符 -->
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        默认 separator=" / "
      </ZText>
      <ZCascader v-model:value="v1" :options="options" separator=" / " />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        separator=" > "
      </ZText>
      <ZCascader v-model:value="v2" :options="options" separator=" > " />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        separator="·"
      </ZText>
      <ZCascader v-model:value="v3" :options="options" separator="·" />
    </ZFlex>
  </ZFlex>
</template>
