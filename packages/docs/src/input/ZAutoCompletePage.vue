<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZAutoComplete/BasicDemo.vue'
import BasicDemoSource from './ZAutoComplete/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',             type: 'string',             default: '—',    desc: '绑定值（v-model:value）。' },
  { name: 'options',           type: 'string[]',           default: '—',    desc: '建议选项数组（必传）。' },
  { name: 'placeholder',       type: 'string',             default: '—',    desc: '占位文字。' },
  { name: 'disabled',          type: 'boolean',            default: 'false', desc: '禁用。' },
  { name: 'size',              type: 'number',             default: '1',    desc: '字号 iem 倍数。' },
  { name: 'height',            type: 'number',             default: 'size*2', desc: '高度 iem 倍数。' },
  { name: 'filter',            type: '(input, opt) => boolean', default: '—', desc: '自定义过滤函数（默认 includes）。' },
  { name: 'optionSize',        type: 'number',             default: '2',    desc: '建议项行高 iem 倍数。' },
  { name: 'dropdownMaxHeight', type: 'number',             default: '15',   desc: '下拉最大高度 iem 倍数。' },
  { name: 'css',               type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '输入值变更。' },
  { name: 'select',       args: 'string', desc: '点击选中建议项。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLInputElement | null>', desc: '根 input 元素引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZAutoComplete 自动完成</ZTitle>
    <ZParagraph>
      输入框 + 候选建议下拉。与 ZSelect 的区别：输入值不限于选项，建议是辅助，不强制选中。
      <ZCode code="filter" /> 自定义过滤逻辑，默认按 <ZCode code="includes" /> 匹配。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="输入建议 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '180px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
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

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法/属性', mono: true, width: '120px' },
        { key: 'type', label: '类型',     mono: true, width: '260px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
