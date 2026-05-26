<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDatePicker/BasicDemo.vue'
import BasicDemoSource from './ZDatePicker/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',       type: 'string',             default: '—',    desc: 'ISO 日期字符串 YYYY-MM-DD（v-model:value）。' },
  { name: 'min',         type: 'string',             default: '—',    desc: '最早可选日期 YYYY-MM-DD。' },
  { name: 'max',         type: 'string',             default: '—',    desc: '最晚可选日期 YYYY-MM-DD。' },
  { name: 'disabled',    type: 'boolean',            default: 'false', desc: '禁用。' },
  { name: 'placeholder', type: 'string',             default: '—',    desc: '占位文字。' },
  { name: 'size',        type: 'number',             default: '1',    desc: '字号 iem 倍数。' },
  { name: 'height',      type: 'number',             default: 'size*2', desc: '高度 iem 倍数。' },
  { name: 'css',         type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '日期变更（YYYY-MM-DD）。' },
  { name: 'change',       args: 'string', desc: '确认选择后触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDatePicker 日期选择器</ZTitle>
    <ZParagraph>
      基于原生 <ZCode code="input[type=date]" /> 封装，配合 ZUI 输入框样式。
      值格式为 <ZCode code="YYYY-MM-DD" />，<ZCode code="min" /> / <ZCode code="max" /> 限制可选范围。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="日期选择 / 范围限制 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
