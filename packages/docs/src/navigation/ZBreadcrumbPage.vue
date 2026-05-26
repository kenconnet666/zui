<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZBreadcrumb/BasicDemo.vue'
import BasicDemoSource from './ZBreadcrumb/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items',     type: 'ZBreadcrumbItem[]',  default: '—',    desc: '面包屑项数组（也可用 default slot 渲染）。' },
  { name: 'separator', type: 'string',              default: "'/'",  desc: '分隔符文字。' },
  { name: 'css',       type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'label',   type: 'string',            default: '—（必传）', desc: '面包屑文字。' },
  { name: 'href',    type: 'string',            default: '—',         desc: '链接地址（有则渲染为 <a>）。' },
  { name: 'onClick', type: '(e: MouseEvent) => void', default: '—',  desc: '点击回调。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZBreadcrumb 面包屑</ZTitle>
    <ZParagraph>
      面包屑导航，展示当前页面在层级结构中的位置。
      通过 <ZCode code="items" /> 数组传入路径，最后一项为当前页（无链接）。
      <ZCode code="separator" /> 可自定义分隔符。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 自定义分隔符" :source="BasicDemoSource">
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

    <ZTitle :level="2">ZBreadcrumbItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '字段',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="itemRows"
    />
  </section>
</template>
