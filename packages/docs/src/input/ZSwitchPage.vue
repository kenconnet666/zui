<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZSwitch/BasicDemo.vue'
import BasicDemoSource from './ZSwitch/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value', type: 'boolean', default: 'false', desc: '开关状态（v-model:value）。' },
  {
    name: 'size',
    type: 'number',
    default: '2.5',
    desc: 'px 倍数（1 单位 = 16px）。默认 2.5 = 40px，控制 rail 轨道宽度；高度自动按 0.6 比例计算（默认 24px），thumb 位置等比联动。',
  },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'loading', type: 'boolean', default: 'false', desc: 'loading 状态（异步切换时使用）。' },
  { name: 'checkedLabel', type: 'string', default: '—', desc: 'value=true 时轨道内嵌文字。' },
  { name: 'uncheckedLabel', type: 'string', default: '—', desc: 'value=false 时轨道内嵌文字。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'boolean', desc: '开关状态变更（v-model:value）。' },
  { name: 'change', args: 'boolean', desc: '值提交，与 update:value 同步触发，payload 类型相同。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZSwitch 开关</ZTitle>
    <ZParagraph>
      布尔值开关，支持内嵌文字（<ZCode code="checkedLabel" /> / <ZCode code="uncheckedLabel" />）、
      异步切换（<ZCode code="loading" />）和多种尺寸（<ZCode code="size" /> px 倍数，1 单位 = 16px）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 内嵌文字 / 多尺寸 / 异步 loading" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
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
        { key: 'args', label: '参数', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
