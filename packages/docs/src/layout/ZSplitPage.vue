<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZSplit/BasicDemo.vue'
import BasicDemoSource from './ZSplit/BasicDemo.vue?raw'
import MinMaxDemo from './ZSplit/MinMaxDemo.vue'
import MinMaxDemoSource from './ZSplit/MinMaxDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZSplit 拆分面板</ZTitle>
    <ZParagraph>
      可拖拽的两栏布局，支持水平/垂直分割。
      <ZCode code="v-model:ratio" /> 控制第一栏占比（0~1，默认 0.5）， <ZCode code="min" /> /
      <ZCode code="max" /> 限制拖拽范围。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="水平分割 / 垂直分割（v-model:ratio）" :source="BasicDemoSource">
      <template #desc>
        拖动分割线即可调整比例；<ZCode code="ratio" /> 故意不叫 <ZCode code="size" /> ——在 zui 中
        <ZCode code="size" /> 语义是 px 倍数（1 单位 = 16px），<ZCode code="ratio" /> 是比例（无单位）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">范围限制 &amp; 禁用</ZTitle>
    <DemoBlock title="min/max 限制拖拽范围 + disabled 锁定" :source="MinMaxDemoSource">
      <template #desc>
        <ZCode code="min" /> / <ZCode code="max" /> 把第一栏占比夹在区间内;<ZCode code="disabled" />
        关闭拖拽。
      </template>
      <MinMaxDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'direction',
          type: `'horizontal' | 'vertical'`,
          default: `'horizontal'`,
          desc: '分割方向：horizontal 左右，vertical 上下。',
        },
        {
          name: 'ratio',
          type: 'number',
          default: '0.5',
          desc: '第一栏占容器比例（0~1），配合 v-model:ratio。',
        },
        { name: 'min', type: 'number', default: '0.1', desc: '第一栏占比下限（0~1）。' },
        { name: 'max', type: 'number', default: '0.9', desc: '第一栏占比上限（0~1）。' },
        { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用拖拽。' },
        {
          name: 'css',
          type: '(s: Chain) => void',
          default: '—',
          desc: '根元素 CSS 兜底（通常用于设 height）。',
        },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'first', desc: '第一栏内容（水平分割 = 左侧；垂直分割 = 上方）。' },
        { name: 'second', desc: '第二栏内容（水平分割 = 右侧；垂直分割 = 下方）。' },
      ]"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '180px' },
        { key: 'type', label: '参数', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'update:ratio',
          type: '(value: number) => void',
          desc: 'v-model:ratio 对应的 emit，拖拽时持续触发。',
        },
      ]"
    />
  </section>
</template>
