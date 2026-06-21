<script setup lang="ts">
import { ZCascader, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/* 省市区三级示例数据 */
const options = [
  {
    value: 'guangdong',
    label: '广东省',
    children: [
      {
        value: 'guangzhou',
        label: '广州市',
        children: [
          { value: 'tianhe', label: '天河区' },
          { value: 'haizhu', label: '海珠区' },
        ],
      },
      {
        value: 'shenzhen',
        label: '深圳市',
        children: [
          { value: 'nanshan', label: '南山区' },
          { value: 'futian', label: '福田区' },
        ],
      },
    ],
  },
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
        ],
      },
    ],
  },
]

/** expandTrigger="click"（默认）—— 点击非叶子节点展开子列 */
const v1 = ref<string[]>([])
/** expandTrigger="hover" —— 悬停非叶子节点展开子列（类型值，行为见组件实现） */
const v2 = ref<string[]>([])
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <!-- click 模式（默认） -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.fontWeight._semibold }">
        expandTrigger="click"（默认）
      </ZText>
      <ZCascader
        v-model:value="v1"
        :options="options"
        expand-trigger="click"
        placeholder="点击选项展开子列"
      />
    </ZFlex>

    <!-- hover 模式 -->
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.fontWeight._semibold }">
        expandTrigger="hover"（悬停展开）
      </ZText>
      <ZCascader
        v-model:value="v2"
        :options="options"
        expand-trigger="hover"
        placeholder="悬停选项展开子列"
      />
    </ZFlex>
  </ZFlex>
</template>
