<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZSelect/BasicDemo.vue'
import BasicDemoSource from './ZSelect/BasicDemo.vue?raw'
import MultipleDemo from './ZSelect/MultipleDemo.vue'
import MultipleDemoSource from './ZSelect/MultipleDemo.vue?raw'
import FilterableDemo from './ZSelect/FilterableDemo.vue'
import FilterableDemoSource from './ZSelect/FilterableDemo.vue?raw'
import RemoteDemo from './ZSelect/RemoteDemo.vue'
import RemoteDemoSource from './ZSelect/RemoteDemo.vue?raw'
import DisabledOptionDemo from './ZSelect/DisabledOptionDemo.vue'
import DisabledOptionDemoSource from './ZSelect/DisabledOptionDemo.vue?raw'

const propsRows = [
  { name: 'value',             type: 'ZSelectValue | ZSelectValue[] | null', default: '—',    desc: '选中值（v-model:value）；multiple=true 时传数组。' },
  { name: 'options',           type: 'ZSelectOption[]',                      default: '—',    desc: '选项列表（必传）。' },
  { name: 'placeholder',       type: 'string',                               default: '—',    desc: '未选时占位文字。' },
  { name: 'disabled',          type: 'boolean',                              default: 'false', desc: '禁用。' },
  { name: 'clearable',         type: 'boolean',                              default: 'false', desc: '显示清空按钮。' },
  { name: 'filterable',        type: 'boolean',                              default: 'false', desc: '启用搜索过滤。' },
  { name: 'multiple',          type: 'boolean',                              default: 'false', desc: '多选模式。' },
  { name: 'size',              type: 'number',                               default: '1',    desc: '字号 iem 倍数。' },
  { name: 'height',            type: 'number',                               default: 'size*2', desc: '触发器高度 iem 倍数。' },
  { name: 'optionSize',        type: 'number',                               default: '2',    desc: '下拉项行高 iem 倍数。' },
  { name: 'dropdownMaxHeight', type: 'number',                               default: '15',   desc: '下拉框最大高度 iem 倍数。' },
  { name: 'css',               type: '(s: Chain) => void',                   default: '—',    desc: '根元素 CSS 兜底。' },
]

const optionRows = [
  { name: 'value',    type: 'string | number | boolean', default: '—',     desc: '选项值。' },
  { name: 'label',    type: 'string',                    default: '—',     desc: '显示文字。' },
  { name: 'disabled', type: 'boolean',                   default: 'false', desc: '禁用此选项。' },
]

const emitsRows = [
  { name: 'update:value', args: 'ZSelectValue | ZSelectValue[] | null', desc: '选中值变更。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLDivElement | null>', desc: '根触发器元素引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZSelect 选择器</ZTitle>
    <ZParagraph>
      下拉选择器，支持单选和多选（<ZCode code="multiple" />），可搜索过滤（<ZCode code="filterable" />），
      可清空（<ZCode code="clearable" />）。基于 floating-ui 定位，渲染到 body 避开父容器 overflow 截断。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="单选 / 可搜索 / 多选 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '180px' },
        { key: 'type',    label: '类型',   mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZSelectOption</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="optionRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '280px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法/属性', mono: true, width: '120px' },
        { key: 'type', label: '类型',     mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
