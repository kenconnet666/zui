<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZAnchor/BasicDemo.vue'
import BasicDemoSource from './ZAnchor/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'ZAnchorItem[]', default: '—（必传）', desc: '锚点项数组。' },
  { name: 'offsetTop', type: 'number', default: '0', desc: '滚动激活偏移量（px）。' },
  { name: 'indentStep', type: 'number', default: '0.75', desc: '层级缩进步长（px 倍数，1 单位 = 16px）。' },
  { name: 'color', type: '(c: Chain) => void', default: '_primary', desc: '激活项颜色 factory。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'href', type: 'string', default: '—（必传）', desc: '锚点目标（#id 格式）。' },
  { name: 'title', type: 'string', default: '—（必传）', desc: '锚点文字。' },
  { name: 'level', type: 'number', default: '1', desc: '层级（用于计算缩进）。' },
]

const emitsRows = [
  { name: 'change', type: '(href: string | null) => void', desc: '滚动侦测到新激活锚点时触发。' },
  {
    name: 'click',
    type: '(href: string, event: MouseEvent) => void',
    desc: '点击锚点链接时触发。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZAnchor 锚点</ZTitle>
    <ZParagraph>
      锚点导航，通过滚动侦测自动高亮当前可见区域对应的锚点链接。 常用于文章目录或文档右侧导航。
      <ZCode code="level" /> 字段控制缩进层级，<ZCode code="indentStep" /> 设置每级缩进量（px 倍数，1 单位 = 16px）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="锚点导航 / 多级缩进" :source="BasicDemoSource">
      <template #desc>
        演示中使用局部滚动容器模拟页面滚动；实际使用通常绑定 <ZCode code="window" />（默认值）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZAnchorItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '字段', mono: true, width: '100px' },
        { key: 'type', label: '类型', mono: true, width: '120px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '120px' },
        { key: 'type', label: '参数', mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
