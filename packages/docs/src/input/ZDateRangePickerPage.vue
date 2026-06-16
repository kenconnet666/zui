<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDateRangePicker/BasicDemo.vue'
import BasicDemoSource from './ZDateRangePicker/BasicDemo.vue?raw'
import MinMaxDemo from './ZDateRangePicker/MinMaxDemo.vue'
import MinMaxDemoSource from './ZDateRangePicker/MinMaxDemo.vue?raw'
import SizeDemo from './ZDateRangePicker/SizeDemo.vue'
import SizeDemoSource from './ZDateRangePicker/SizeDemo.vue?raw'

const propsRows = [
  {
    name: 'value',
    type: '[string, string] | null',
    default: '—',
    desc: 'ISO 日期对 [yyyy-mm-dd, yyyy-mm-dd]（v-model:value）；null 表示空。',
  },
  { name: 'min', type: 'string', default: '—', desc: '整体最早可选日期 yyyy-mm-dd。' },
  { name: 'max', type: 'string', default: '—', desc: '整体最晚可选日期 yyyy-mm-dd。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用两个输入框。' },
  { name: 'startPlaceholder', type: 'string', default: '—', desc: '开始日期输入框占位文字。' },
  { name: 'endPlaceholder', type: 'string', default: '—', desc: '结束日期输入框占位文字。' },
  { name: 'separator', type: 'string', default: '~', desc: '两个输入框之间的分隔符。' },
  { name: 'size', type: 'number', default: '1', desc: '字号 px 倍数（1 单位 = 16px）。' },
  { name: 'height', type: 'number', default: 'size*2', desc: '高度 px 倍数（1 单位 = 16px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根容器 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: '[string, string] | null', desc: '日期范围变更。' },
  { name: 'change', args: '[string, string] | null', desc: '确认选择后触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDateRangePicker 日期范围选择器</ZTitle>
    <ZParagraph>
      基于两个原生 <ZCode code="input[type=date]" /> 封装的日期范围选择器。
      值格式为 <ZCode code="[yyyy-mm-dd, yyyy-mm-dd]" /> 或 <ZCode code="null" />（空）。
      选择开始日期后，结束输入框的 <ZCode code="min" /> 自动更新为开始日期，防止反转范围；
      同理，选择结束日期后开始输入框的 <ZCode code="max" /> 也会联动。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="日期范围 / 禁用" :source="BasicDemoSource">
      <template #desc>
        <code>v-model:value</code> 绑定 <code>[string, string] | null</code>；
        <strong>禁用</strong>时两个输入框同步禁用。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">限制范围</ZTitle>
    <DemoBlock title="min / max 全局约束" :source="MinMaxDemoSource">
      <template #desc>
        <code>min</code> / <code>max</code> 对整个范围生效；同时开始/结束互锁防止倒置。
      </template>
      <MinMaxDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸</ZTitle>
    <DemoBlock title="size 倍数" :source="SizeDemoSource">
      <template #desc>
        <code>size</code> 是 <strong>px 倍数</strong>（1 单位 = 16px），等比缩放字号、高度、内边距、圆角。
      </template>
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">API</ZTitle>
    <ZTitle :level="3">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="3">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="3">尺寸参考（1 单位 = 16px）</ZTitle>
    <ZParagraph>
      <code>size</code> 是 <strong>px 倍数</strong>，1 单位 = 16px（<code>_internal/sizing.ts</code> 的 <code>sizePx(n) = n * 16</code>）。
      下表以 <strong>1 单位 = 16px</strong> 为基准列出各档位的 px 值：
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'size', label: 'size', mono: true, width: '100px' },
        { key: 'fontSize', label: 'font-size', mono: true, width: '100px' },
        { key: 'height', label: 'height', mono: true, width: '100px' },
        { key: 'paddingY', label: 'padding-y', mono: true, width: '100px' },
        { key: 'paddingX', label: 'padding-x', mono: true, width: '100px' },
        { key: 'radius', label: 'border-radius', mono: true, width: '120px' },
      ]"
      :rows="[
        { size: '0.875', fontSize: '14px', height: '28px', paddingY: '~5px', paddingX: '~10px', radius: '~3.5px' },
        { size: '1（默认）', fontSize: '16px', height: '32px', paddingY: '6px', paddingX: '12px', radius: '4px' },
        { size: '1.25', fontSize: '20px', height: '40px', paddingY: '7.5px', paddingX: '15px', radius: '5px' },
      ]"
    />
    <ZParagraph>
      需要非标准尺寸时，直接传小数倍数（如 <code>:size="1.5"</code> = 24px font-size / 48px height）
      或用 <code>:css</code> 逃生口覆盖任意属性。
    </ZParagraph>
  </section>
</template>
