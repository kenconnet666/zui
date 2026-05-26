<script setup lang="ts">
import { ZCascader, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref<string[]>([])

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
          { value: 'haidian',  label: '海淀区' },
        ],
      },
      {
        value: 'shanghai',
        label: '上海',
        children: [
          { value: 'pudong',   label: '浦东新区' },
          { value: 'jing-an',  label: '静安区' },
        ],
      },
    ],
  },
  {
    value: 'usa',
    label: '美国',
    children: [
      { value: 'california', label: '加利福尼亚', disabled: true },
      { value: 'new-york',   label: '纽约' },
    ],
  },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZCascader v-model:value="value" :options="options" placeholder="请选择地区" />
      <ZText v-if="value.length" :css="s => { s.color._textSecondary; s.fontSize._small }">
        已选路径：{{ value.join(' / ') }}
      </ZText>
    </ZFlex>

    <ZCascader :options="options" placeholder="已禁用" :disabled="true" />
  </ZFlex>
</template>
