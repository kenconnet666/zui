<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZMention/BasicDemo.vue'
import BasicDemoSource from './ZMention/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',             type: 'string',             default: '—',    desc: '绑定值（v-model:value）。' },
  { name: 'options',           type: 'string[]',           default: '—',    desc: '候选成员数组（必传）。' },
  { name: 'prefix',            type: 'string',             default: "'@'",  desc: '触发字符。' },
  { name: 'placeholder',       type: 'string',             default: '—',    desc: '占位文字。' },
  { name: 'disabled',          type: 'boolean',            default: 'false', desc: '禁用。' },
  { name: 'rows',              type: 'number',             default: '—',    desc: 'textarea 行数。' },
  { name: 'size',              type: 'number',             default: '1',    desc: '字号 iem 倍数。' },
  { name: 'optionSize',        type: 'number',             default: '2',    desc: '候选项行高 iem 倍数。' },
  { name: 'dropdownMaxHeight', type: 'number',             default: '15',   desc: '下拉最大高度 iem 倍数。' },
  { name: 'css',               type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '值变更。' },
  { name: 'select',       args: 'string', desc: '选中候选成员（包含 @ prefix）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZMention 提及</ZTitle>
    <ZParagraph>
      多行输入框，输入 <ZCode code="@" /> 触发候选成员下拉。基于最后一段
      <ZCode code="@xxx" /> 过滤，点击插入选中成员。<ZCode code="prefix" /> 可自定义触发字符。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="@ 提及成员 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '180px' },
        { key: 'type',    label: '类型',   mono: true, width: '160px' },
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
