<script setup lang="ts">
import { ZCascader, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/* 简单两级选项 */
const options = [
  {
    value: 'tech',
    label: '技术',
    children: [
      { value: 'frontend', label: '前端' },
      { value: 'backend', label: '后端' },
      { value: 'devops', label: 'DevOps' },
    ],
  },
  {
    value: 'design',
    label: '设计',
    children: [
      { value: 'ui', label: 'UI' },
      { value: 'ux', label: 'UX' },
    ],
  },
]

const v1 = ref<string[]>([])
const v2 = ref<string[]>([])
const v3 = ref<string[]>([])
</script>

<template>
  <!-- placement 控制弹层相对触发器的定位方向（由 floating-ui 实现） -->
  <ZFlex :gap="g => g._large" :wrap="c => c.wrap">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.fontWeight._semibold }">
        bottom-start（默认）
      </ZText>
      <ZCascader
        v-model:value="v1"
        :options="options"
        placement="bottom-start"
        placeholder="向下展开"
      />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.fontWeight._semibold }">
        bottom-end
      </ZText>
      <ZCascader
        v-model:value="v2"
        :options="options"
        placement="bottom-end"
        placeholder="右对齐向下"
      />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.fontWeight._semibold }">
        top-start
      </ZText>
      <ZCascader
        v-model:value="v3"
        :options="options"
        placement="top-start"
        placeholder="向上展开"
      />
    </ZFlex>
  </ZFlex>
</template>
