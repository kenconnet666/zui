<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZEmpty/BasicDemo.vue'
import BasicDemoSource from './ZEmpty/BasicDemo.vue?raw'
import CustomDemo from './ZEmpty/CustomDemo.vue'
import CustomDemoSource from './ZEmpty/CustomDemo.vue?raw'

const propsRows = [
  { name: 'description', type: 'string', default: "'暂无数据'", desc: '描述文字。' },
  {
    name: 'image',
    type: 'Component',
    default: '内置 SVG',
    desc: '自定义图标组件（传 Vue 组件）。',
  },
  {
    name: 'size',
    type: 'number',
    default: '4',
    desc: '图标尺寸（iem 倍数，4 = 64px @ 默认 iem）。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'image', desc: '自定义图标区域，优先级高于 image prop。' },
  { name: 'description', desc: '自定义描述文字区域，优先级高于 description prop。' },
  { name: 'default', desc: '底部操作按钮区域（有内容时自动渲染）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZEmpty 空状态</ZTitle>
    <ZParagraph>
      空状态占位组件，用于列表为空、搜索无结果等场景。
      <ZCode code="size" /> 为 iem 倍数控制图标大小，slot <ZCode code="#default" /> 可放置操作按钮。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="默认 / 自定义描述 / 尺寸 / 带按钮" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">完全自定义图标 + 描述 + 操作</ZTitle>
    <DemoBlock title="#image + #description + 操作按钮" :source="CustomDemoSource">
      <template #desc>
        通过 <code>#image</code> / <code>#description</code> slot 全面替换,default slot
        放操作按钮组。
      </template>
      <CustomDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
