<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZCascader/BasicDemo.vue'
import BasicDemoSource from './ZCascader/BasicDemo.vue?raw'

const propsRows = [
  {
    name: 'value',
    type: 'string[]',
    default: '—',
    desc: '选中路径（v-model:value），从根到叶的 key 数组。',
  },
  { name: 'options', type: 'ZCascaderOption[]', default: '—', desc: '树形选项数据（必传）。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '占位文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  {
    name: 'expandTrigger',
    type: "'click' | 'hover'",
    default: "'click'",
    desc: '子级展开触发方式。',
  },
  { name: 'separator', type: 'string', default: "' / '", desc: '路径分隔符（触发器展示用）。' },
  { name: 'size', type: 'number', default: '1', desc: '字号 px 倍数（1 单位 = 16px）。' },
  { name: 'height', type: 'number', default: 'size*2', desc: '高度 px 倍数（1 单位 = 16px）。' },
  { name: 'optionSize', type: 'number', default: '2', desc: '每级选项行高 px 倍数（1 单位 = 16px）。' },
  { name: 'columnMaxHeight', type: 'number', default: '17.5', desc: '每级面板最大高度 px 倍数（1 单位 = 16px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const optionRows = [
  { name: 'value', type: 'string', default: '—', desc: '选项值（路径中的 key）。' },
  { name: 'label', type: 'string', default: '—', desc: '显示文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用此选项。' },
  { name: 'children', type: 'ZCascaderOption[]', default: '—', desc: '子选项。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string[]', desc: '选中路径变更（key 数组）。' },
  { name: 'change', args: 'string[], string[]', desc: '确认选择，第二个参数为 label 路径。' },
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
      <ZCode code="expandTrigger" /> 控制子级展开方式（click 或 hover）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="省市区三级 / hover 展开 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
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
        { key: 'args', label: '参数', mono: true, width: '180px' },
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
