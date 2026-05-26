<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTextarea/BasicDemo.vue'
import BasicDemoSource from './ZTextarea/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',       type: 'string',             default: '—',    desc: '绑定值（v-model:value）。' },
  { name: 'rows',        type: 'number',             default: '3',    desc: '默认行数。' },
  { name: 'maxRows',     type: 'number',             default: '—',    desc: 'autosize 最大行数上限。' },
  { name: 'autosize',    type: 'boolean',            default: 'false', desc: '根据内容自动调整高度。' },
  { name: 'disabled',    type: 'boolean',            default: 'false', desc: '禁用。' },
  { name: 'readonly',    type: 'boolean',            default: 'false', desc: '只读。' },
  { name: 'placeholder', type: 'string',             default: '—',    desc: '占位文字。' },
  { name: 'maxlength',   type: 'number',             default: '—',    desc: 'HTML maxlength。' },
  { name: 'showCount',   type: 'boolean',            default: 'false', desc: '显示字数统计。' },
  { name: 'autofocus',   type: 'boolean',            default: 'false', desc: '自动聚焦。' },
  { name: 'size',        type: 'number',             default: '1',    desc: '字号 iem 倍数。' },
  { name: 'css',         type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string',        desc: '值变更。' },
  { name: 'change',       args: 'string, Event', desc: 'blur 时触发。' },
  { name: 'focus',        args: 'FocusEvent',    desc: '聚焦。' },
  { name: 'blur',         args: 'FocusEvent',    desc: '失焦。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTextarea 多行输入</ZTitle>
    <ZParagraph>
      多行文本输入框，<ZCode code="autosize" /> 可自动跟随内容高度增长，
      <ZCode code="maxRows" /> 限制最大行数，<ZCode code="showCount" /> 显示字数统计。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="固定行数 / 自动高度 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
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
        { key: 'args', label: '参数',  mono: true, width: '160px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
