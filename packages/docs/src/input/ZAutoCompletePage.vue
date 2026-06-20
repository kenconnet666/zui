<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZAutoComplete/BasicDemo.vue'
import BasicDemoSource from './ZAutoComplete/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value', type: 'string', default: '—', desc: '绑定值（v-model:value）。' },
  { name: 'options', type: 'string[]', default: '—', desc: '建议选项数组（必传）。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '占位文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'size', type: 'number', default: '1', desc: 'px 倍数（1 单位 = 16px）。默认 1 = 16px 字号，padding/height 等比缩放（默认高度 32px，内边距 6px/12px）。' },
  { name: 'height', type: 'number', default: 'size*2', desc: '高度 px 倍数（1 单位 = 16px）。' },
  {
    name: 'filter',
    type: '(input, opt) => boolean',
    default: '—',
    desc: '自定义过滤函数（默认 includes）。',
  },
  { name: 'optionSize', type: 'number', default: '2', desc: '建议项行高 px 倍数（1 单位 = 16px）。' },
  { name: 'dropdownMaxHeight', type: 'number', default: '15', desc: '下拉最大高度 px 倍数（1 单位 = 16px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '输入值变更（v-model:value）。' },
  { name: 'select', args: 'string', desc: '点击选中建议项。' },
  { name: 'change', args: 'string', desc: '输入或选中建议项时触发，payload 为新值（与 update:value 同步）。' },
  { name: 'focus', args: 'FocusEvent', desc: 'input 聚焦时触发。' },
  { name: 'blur', args: 'FocusEvent', desc: 'input 失焦时触发。' },
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
        { key: 'name', label: '属性', mono: true, width: '180px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
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

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法/属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
