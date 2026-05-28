<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZRate/BasicDemo.vue'
import BasicDemoSource from './ZRate/BasicDemo.vue?raw'
import HalfDemo from './ZRate/HalfDemo.vue'
import HalfDemoSource from './ZRate/HalfDemo.vue?raw'

const propsRows = [
  { name: 'value',     type: 'number',                   default: '0',    desc: '评分值（v-model:value）。' },
  { name: 'count',     type: 'number',                   default: '5',    desc: '总星数。' },
  { name: 'allowHalf', type: 'boolean',                  default: 'false', desc: '允许半星。' },
  { name: 'disabled',  type: 'boolean',                  default: 'false', desc: '禁用（不可点击）。' },
  { name: 'readonly',  type: 'boolean',                  default: 'false', desc: '只读展示（不可点击）。' },
  { name: 'color',     type: "(c: Chain['color']) => void", default: '_warning', desc: '星星颜色 carrier factory。' },
  { name: 'size',      type: 'number',                   default: '1.5',  desc: '星星尺寸 iem 倍数（默认 24px @ 16px iem）。' },
  { name: 'css',       type: '(s: Chain) => void',       default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'number', desc: '评分值变更。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZRate 评分</ZTitle>
    <ZParagraph>
      星级评分组件，支持半星（<ZCode code="allowHalf" />）、自定义尺寸（<ZCode code="size" />）
      和颜色（<ZCode code="color" /> factory），可设为只读展示模式（<ZCode code="readonly" />）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="整星 / 半星 / 多尺寸 / 只读 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">半星 / 自定义 / 只读</ZTitle>
    <DemoBlock title="allowHalf / count / color / readonly" :source="HalfDemoSource">
      <template #desc>
        <ZCode code="allowHalf" /> 允许半星;<ZCode code="count" /> 自定义星数;
        <ZCode code="color" /> carrier 切色;<ZCode code="readonly" /> 只读展示。
      </template>
      <HalfDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '260px' },
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
