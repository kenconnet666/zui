<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZInputNumber/BasicDemo.vue'
import BasicDemoSource from './ZInputNumber/BasicDemo.vue?raw'
import StepRangeDemo from './ZInputNumber/StepRangeDemo.vue'
import StepRangeDemoSource from './ZInputNumber/StepRangeDemo.vue?raw'
import PrecisionDemo from './ZInputNumber/PrecisionDemo.vue'
import PrecisionDemoSource from './ZInputNumber/PrecisionDemo.vue?raw'

const propsRows = [
  { name: 'value', type: 'number | null', default: '—', desc: '绑定值（v-model:value）。' },
  { name: 'step', type: 'number', default: '1', desc: '步进值。' },
  { name: 'min', type: 'number', default: '—', desc: '最小值。' },
  { name: 'max', type: 'number', default: '—', desc: '最大值。' },
  { name: 'precision', type: 'number', default: '—', desc: '小数位数（不传不限制）。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '只读。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '占位文字。' },
  { name: 'size', type: 'number', default: '1', desc: '字号 px 倍数（1 单位 = 16px）。' },
  { name: 'height', type: 'number', default: 'size*2', desc: '高度 px 倍数（1 单位 = 16px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'number | null', desc: '值变更。' },
  { name: 'change', args: 'number | null', desc: 'blur 或步进时触发。' },
  { name: 'focus', args: 'FocusEvent', desc: '聚焦。' },
  { name: 'blur', args: 'FocusEvent', desc: '失焦。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZInputNumber 数字输入框</ZTitle>
    <ZParagraph>
      带步进按钮的数字输入框，支持 <ZCode code="min" /> / <ZCode code="max" /> 边界限制，
      <ZCode code="precision" /> 控制小数位数，<ZCode code="step" /> 设置步进值。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="整数 / 小数 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">步长与范围</ZTitle>
    <DemoBlock title="step / min / max" :source="StepRangeDemoSource">
      <StepRangeDemo />
    </DemoBlock>

    <ZTitle :level="2">精度</ZTitle>
    <DemoBlock title="precision 小数位数" :source="PrecisionDemoSource">
      <PrecisionDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
