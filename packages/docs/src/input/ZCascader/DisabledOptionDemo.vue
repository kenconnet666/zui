<script setup lang="ts">
import { ZCascader, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/* 带多个禁用节点的省市区数据 */
const options = [
  {
    value: 'sichuan',
    label: '四川省',
    children: [
      {
        value: 'chengdu',
        label: '成都市',
        children: [
          { value: 'jinjiang', label: '锦江区' },
          { value: 'wuhou', label: '武侯区', disabled: true }, // 禁用叶子
        ],
      },
      {
        value: 'deyang',
        label: '德阳市',
        disabled: true, // 禁用非叶子（子列不可进入）
        children: [
          { value: 'jingyang', label: '旌阳区' },
        ],
      },
    ],
  },
  {
    value: 'hunan',
    label: '湖南省',
    children: [
      {
        value: 'changsha',
        label: '长沙市',
        children: [
          { value: 'yuelu', label: '岳麓区' },
          { value: 'kaifu', label: '开福区' },
        ],
      },
    ],
  },
]

const value = ref<string[]>([])
</script>

<template>
  <!--
    ZCascaderOption.disabled 可在任意层级禁用选项。
    禁用的叶子节点无法选中，禁用的非叶子节点无法展开子列。
  -->
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZCascader
      v-model:value="value"
      :options="options"
      placeholder="德阳市、武侯区已禁用"
    />
    <ZText
      v-if="value.length"
      :css="s => { s.color._textSecondary; s.fontSize._small }"
    >
      已选路径：{{ value.join(' / ') }}
    </ZText>
  </ZFlex>
</template>
