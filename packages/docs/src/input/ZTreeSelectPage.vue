<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTreeSelect/BasicDemo.vue'
import BasicDemoSource from './ZTreeSelect/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',               type: 'string | null',       default: 'null',   desc: '选中叶节点 key（v-model:value）。' },
  { name: 'data',                type: 'ZTreeNode[]',         default: '—',      desc: '树形数据（必传）。' },
  { name: 'defaultExpandedKeys', type: 'string[]',            default: '—',      desc: '默认展开的节点 key。' },
  { name: 'placeholder',         type: 'string',              default: '—',      desc: '占位文字。' },
  { name: 'disabled',            type: 'boolean',             default: 'false',  desc: '禁用。' },
  { name: 'clearable',           type: 'boolean',             default: 'false',  desc: '显示清空按钮。' },
  { name: 'size',                type: 'number',              default: '1',      desc: '字号 iem 倍数。' },
  { name: 'height',              type: 'number',              default: 'size*2', desc: '触发器高度 iem 倍数。' },
  { name: 'treeItemSize',        type: 'number',              default: '2',      desc: '树节点行高 iem 倍数。' },
  { name: 'treeHeight',          type: 'number',              default: '18',     desc: '浮层树区域高度 iem 倍数。' },
  { name: 'css',                 type: '(s: Chain) => void',  default: '—',      desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string | null',               desc: '选中值变更。' },
  { name: 'change',       args: 'string | null, ZTreeNode | null', desc: '选中变更，携带节点对象。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLDivElement | null>', desc: '根触发器元素引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTreeSelect 树选择</ZTitle>
    <ZParagraph>
      下拉展示树形结构，点击叶节点完成选择。基于 ZSelect 触发器 + ZTree 下拉面板实现。
      <ZCode code="clearable" /> 清空选中，<ZCode code="defaultExpandedKeys" /> 控制默认展开节点。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="树形选择 / 清空 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '180px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '240px' },
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
