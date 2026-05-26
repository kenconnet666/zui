<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZPageHeader/BasicDemo.vue'
import BasicDemoSource from './ZPageHeader/BasicDemo.vue?raw'

const propsRows = [
  { name: 'title',    type: 'string',             default: '—',    desc: '页头标题。' },
  { name: 'subtitle', type: 'string',             default: '—',    desc: '副标题文字。' },
  { name: 'showBack', type: 'boolean',            default: 'true', desc: '是否显示返回箭头按钮。' },
  { name: 'css',      type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'back', type: '() => void', desc: '点击返回按钮时触发（通常 router.back()）。' },
]

const slotsRows = [
  { name: 'extra',  desc: '右侧操作区（按钮、标签等）。' },
  { name: 'footer', desc: '底部区域（标签页、描述等）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZPageHeader 页头</ZTitle>
    <ZParagraph>
      页头组件，用于详情页顶部。包含返回按钮、标题、副标题，
      以及右侧操作区（<ZCode code="#extra" /> slot）和底部区域（<ZCode code="#footer" /> slot）。
      监听 <ZCode code="@back" /> 事件执行路由返回逻辑。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="带返回 / 无返回 / extra 操作区" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '100px' },
        { key: 'type', label: '参数',  mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',  mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
