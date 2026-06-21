<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZCascader/BasicDemo.vue'
import BasicDemoSource from './ZCascader/BasicDemo.vue?raw'
import ExpandTriggerDemo from './ZCascader/ExpandTriggerDemo.vue'
import ExpandTriggerDemoSource from './ZCascader/ExpandTriggerDemo.vue?raw'
import PlacementDemo from './ZCascader/PlacementDemo.vue'
import PlacementDemoSource from './ZCascader/PlacementDemo.vue?raw'
import SeparatorDemo from './ZCascader/SeparatorDemo.vue'
import SeparatorDemoSource from './ZCascader/SeparatorDemo.vue?raw'
import SizeDemo from './ZCascader/SizeDemo.vue'
import SizeDemoSource from './ZCascader/SizeDemo.vue?raw'
import DisabledOptionDemo from './ZCascader/DisabledOptionDemo.vue'
import DisabledOptionDemoSource from './ZCascader/DisabledOptionDemo.vue?raw'
import DisabledDemo from './ZCascader/DisabledDemo.vue'
import DisabledDemoSource from './ZCascader/DisabledDemo.vue?raw'

const propsRows = [
  {
    name: 'value',
    type: 'string[]',
    default: '—',
    desc: '选中路径（v-model:value），从根到叶的 key 数组。',
  },
  { name: 'options', type: 'ZCascaderOption[]', default: '—', desc: '树形选项数据（必传）。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '占位文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用，触发器不可点击。' },
  {
    name: 'expandTrigger',
    type: "'click' | 'hover'",
    default: "'click'",
    desc: '子级展开触发方式。',
  },
  {
    name: 'placement',
    type: 'Placement',
    default: "'bottom-start'",
    desc: '弹层定位方向，来自 floating-ui（如 bottom-start / top-start / bottom-end 等）。',
  },
  { name: 'separator', type: 'string', default: "' / '", desc: '触发器中路径各级之间的分隔符。' },
  { name: 'size', type: 'number', default: '1', desc: '触发器字号 px 倍数（1 单位 = 16px）。' },
  { name: 'height', type: 'number', default: 'size*2', desc: '触发器高度 px 倍数（1 单位 = 16px）。' },
  {
    name: 'optionSize',
    type: 'number',
    default: '2',
    desc: '弹层每级选项行高 px 倍数（1 单位 = 16px）。',
  },
  {
    name: 'columnMaxHeight',
    type: 'number',
    default: '17.5',
    desc: '弹层每列面板最大高度 px 倍数（1 单位 = 16px）。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const optionRows = [
  { name: 'value', type: 'string', default: '—', desc: '选项值（路径中的 key）。' },
  { name: 'label', type: 'string', default: '—', desc: '显示文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用此选项（不可选中，非叶子则不可展开）。' },
  { name: 'children', type: 'ZCascaderOption[]', default: '—', desc: '子选项。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string[]', desc: '选中路径变更（key 数组）。' },
  { name: 'change', args: 'string[], string[]', desc: '确认选择后触发，第二个参数为 label 路径数组。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLDivElement | null>', desc: '根触发器元素引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCascader 级联选择</ZTitle>
    <ZParagraph>
      列式展开的树形选择器，<ZCode code="value" /> 为从根到叶的 key 路径数组。
      <ZCode code="expandTrigger" /> 控制子级展开方式（click 或 hover），
      <ZCode code="separator" /> 控制触发器中路径的拼接字符。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="省市区三级 / 禁用整体" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">展开触发方式</ZTitle>
    <DemoBlock title="expandTrigger：click / hover" :source="ExpandTriggerDemoSource">
      <ExpandTriggerDemo />
    </DemoBlock>

    <ZTitle :level="2">弹层定位</ZTitle>
    <DemoBlock title="placement：bottom-start / bottom-end / top-start" :source="PlacementDemoSource">
      <PlacementDemo />
    </DemoBlock>

    <ZTitle :level="2">路径分隔符</ZTitle>
    <DemoBlock title="separator：' / ' / ' > ' / '·'" :source="SeparatorDemoSource">
      <SeparatorDemo />
    </DemoBlock>

    <ZTitle :level="2">触发器与选项尺寸</ZTitle>
    <DemoBlock title="size / optionSize / columnMaxHeight" :source="SizeDemoSource">
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">禁用选项</ZTitle>
    <DemoBlock title="ZCascaderOption.disabled（任意层级）" :source="DisabledOptionDemoSource">
      <DisabledOptionDemo />
    </DemoBlock>

    <ZTitle :level="2">整体禁用</ZTitle>
    <DemoBlock title="disabled prop" :source="DisabledDemoSource">
      <DisabledDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '110px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZCascaderOption</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '180px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="optionRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法/属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
