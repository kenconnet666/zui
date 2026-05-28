<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZPagination/BasicDemo.vue'
import BasicDemoSource from './ZPagination/BasicDemo.vue?raw'

const propsRows = [
  { name: 'total', type: 'number', default: '—（必传）', desc: '总数据条数。' },
  { name: 'page', type: 'number', default: '1', desc: '当前页码（1-based，v-model:page）。' },
  { name: 'pageSize', type: 'number', default: '10', desc: '每页条数。' },
  { name: 'siblings', type: 'number', default: '1', desc: '当前页两侧显示的页码数。' },
  { name: 'showTotal', type: 'boolean', default: 'false', desc: '是否显示总条数文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用。' },
  { name: 'size', type: 'number', default: '1', desc: '字号 iem 倍数。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:page', type: '(value: number) => void', desc: 'v-model:page 更新事件。' },
  { name: 'change', type: '(value: number) => void', desc: '页码变化时触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZPagination 分页</ZTitle>
    <ZParagraph>
      分页器，通过 <ZCode code="v-model:page" /> 绑定当前页码。
      <ZCode code="siblings" /> 控制当前页两侧显示的页码数；
      <ZCode code="showTotal" /> 显示总条数信息。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 显示总数 / 更多页码 / 小尺寸" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '140px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'type', label: '参数', mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
