<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZStatistic/BasicDemo.vue'
import BasicDemoSource from './ZStatistic/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',     type: 'number | string',    default: '—（必传）', desc: '主数值。字符串直接渲染，数字走格式化。' },
  { name: 'title',     type: 'string',             default: '—',         desc: '标题文字。' },
  { name: 'prefix',    type: 'string',             default: '—',         desc: '前缀（也可用 #prefix slot）。' },
  { name: 'suffix',    type: 'string',             default: '—',         desc: '后缀（也可用 #suffix slot）。' },
  { name: 'precision', type: 'number',             default: '—',         desc: '小数位数。不传则根据值自动决定。' },
  { name: 'separator', type: 'string',             default: "','",       desc: '千分位分隔符。设为空字符串可关闭。' },
  { name: 'color',     type: '(c: Chain) => void', default: '_text',     desc: '数值颜色 factory。' },
  { name: 'css',       type: '(s: Chain) => void', default: '—',         desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'prefix', desc: '数值前缀，优先级高于 prefix prop。' },
  { name: 'suffix', desc: '数值后缀，优先级高于 suffix prop。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZStatistic 统计数字</ZTitle>
    <ZParagraph>
      数字统计展示组件，常用于仪表板数据卡片。
      支持千分位格式化、小数精度、前后缀及颜色自定义。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 小数精度 / 颜色 / 无分隔符" :source="BasicDemoSource">
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

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',  mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
