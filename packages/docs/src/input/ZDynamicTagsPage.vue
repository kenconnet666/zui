<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDynamicTags/BasicDemo.vue'
import BasicDemoSource from './ZDynamicTags/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',       type: 'string[]',           default: '[]',        desc: '标签数组（v-model:value）。' },
  { name: 'max',         type: 'number',             default: '—',         desc: '最大标签数量上限。' },
  { name: 'placeholder', type: 'string',             default: "'新标签'",  desc: '输入框占位文字。' },
  { name: 'disabled',    type: 'boolean',            default: 'false',     desc: '禁用（不可添加/删除）。' },
  { name: 'addable',     type: 'boolean',            default: 'true',      desc: '是否可添加（false 时仅展示已有标签）。' },
  { name: 'css',         type: '(s: Chain) => void', default: '—',         desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string[]', desc: '标签列表变更。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDynamicTags 动态标签</ZTitle>
    <ZParagraph>
      可动态添加（回车确认）和删除标签的输入组件。<ZCode code="max" /> 限制数量上限，
      <ZCode code="addable" /> 控制是否可添加，<ZCode code="disabled" /> 全部冻结。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="添加删除 / 数量限制 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
