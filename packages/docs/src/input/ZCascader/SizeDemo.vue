<script setup lang="ts">
import { ZCascader, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/* 部门三级示例数据 */
const options = [
  {
    value: 'ops',
    label: '运营中心',
    children: [
      {
        value: 'marketing',
        label: '市场部',
        children: [
          { value: 'brand', label: '品牌组' },
          { value: 'channel', label: '渠道组' },
        ],
      },
      {
        value: 'sales',
        label: '销售部',
        children: [
          { value: 'domestic', label: '国内组' },
          { value: 'overseas', label: '海外组' },
        ],
      },
    ],
  },
  {
    value: 'support',
    label: '支持中心',
    children: [
      {
        value: 'cs',
        label: '客服部',
        children: [
          { value: 'online', label: '在线客服' },
          { value: 'phone', label: '电话客服' },
        ],
      },
    ],
  },
]

const v1 = ref<string[]>([])
const v2 = ref<string[]>([])
const v3 = ref<string[]>([])
</script>

<template>
  <!--
    size        — 触发器字号 px 倍数（默认 1 = 16px）
    optionSize  — 下拉面板每行行高 px 倍数（默认 2 = 32px）
    columnMaxHeight — 每列面板最大高度 px 倍数（默认 17.5 = 280px）
  -->
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        size=0.875（小）
      </ZText>
      <ZCascader v-model:value="v1" :options="options" :size="0.875" placeholder="小尺寸" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        size=1（默认）
      </ZText>
      <ZCascader v-model:value="v2" :options="options" :size="1" placeholder="默认尺寸" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText :css="s => { s.fontSize._small; s.color._textSecondary }">
        size=1.25（大）+ optionSize=2.5 + columnMaxHeight=12
      </ZText>
      <ZCascader
        v-model:value="v3"
        :options="options"
        :size="1.25"
        :option-size="2.5"
        :column-max-height="12"
        placeholder="大尺寸，限高12倍"
      />
    </ZFlex>
  </ZFlex>
</template>
