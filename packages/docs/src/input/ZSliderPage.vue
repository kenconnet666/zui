<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZSlider/BasicDemo.vue'
import BasicDemoSource from './ZSlider/BasicDemo.vue?raw'
import StepDemo from './ZSlider/StepDemo.vue'
import StepDemoSource from './ZSlider/StepDemo.vue?raw'

const propsRows = [
  { name: 'value',     type: 'number',             default: '0',    desc: '当前值（v-model:value）。' },
  { name: 'min',       type: 'number',             default: '0',    desc: '最小值。' },
  { name: 'max',       type: 'number',             default: '100',  desc: '最大值。' },
  { name: 'step',      type: 'number',             default: '1',    desc: '步进值。' },
  { name: 'disabled',  type: 'boolean',            default: 'false', desc: '禁用。' },
  { name: 'showValue', type: 'boolean',            default: 'false', desc: '显示当前值标签。' },
  { name: 'css',       type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'number', desc: '拖动时实时更新。' },
  { name: 'change',       args: 'number', desc: '松手后确认值。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZSlider 滑块</ZTitle>
    <ZParagraph>
      基于原生 <ZCode code="input[type=range]" /> 包装，支持 <ZCode code="min" /> / <ZCode code="max" /> /
      <ZCode code="step" /> 配置，<ZCode code="showValue" /> 展示当前值标签。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="整数 / 小数步进 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">步长 / 范围 / 禁用</ZTitle>
    <DemoBlock title="step / min / max / showValue / disabled" :source="StepDemoSource">
      <template #desc>
        <ZCode code="step" /> 设置吸附步长;<ZCode code="min" /> / <ZCode code="max" /> 限定范围;
        <ZCode code="showValue" /> 显示当前值气泡。
      </template>
      <StepDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '120px' },
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
