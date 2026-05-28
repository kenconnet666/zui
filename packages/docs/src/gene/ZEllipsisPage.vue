<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZEllipsis/BasicDemo.vue'
import BasicDemoSource from './ZEllipsis/BasicDemo.vue?raw'
import MultiLineDemo from './ZEllipsis/MultiLineDemo.vue'
import MultiLineDemoSource from './ZEllipsis/MultiLineDemo.vue?raw'

const compareRows = [
  { item: '包裹方式',   zellipsis: '独立组件，包裹任意内容', ztext: 'prop，在 ZText 元素自身' },
  { item: '污染 props', zellipsis: '无（子元素 props 独立）', ztext: '有（椭圆 + 其它 prop 共用）' },
  { item: '多行支持',   zellipsis: 'lines=N',               ztext: ':ellipsis="N"（同语义）' },
]

const propsRows = [
  { name: 'lines', type: 'number',             default: '1',      desc: '最多显示行数。1 = 单行截断；>1 = 多行截断（-webkit-line-clamp）。' },
  { name: 'tag',   type: 'string',             default: "'span'", desc: '根元素 tag。' },
  { name: 'css',   type: '(s: Chain) => void', default: '—',      desc: '兜底 CSS，通常用于设置 width 限制宽度。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZEllipsis 省略</ZTitle>
    <ZParagraph>
      受控省略组件，独立于 ZText 的省略能力。用法：包裹任意内容，通过 <ZCode code="lines" />
      控制行数（默认 1）。不依赖 ZText，可包裹任意子元素而不干扰其自身 props。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="单行 / 多行省略" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="lines=1" /> 用 <ZCode code="text-overflow: ellipsis" />；
        <ZCode code="lines>1" /> 用 <ZCode code="-webkit-line-clamp" />。
        需要父容器限定宽度（用 <ZCode code="css" /> 设 <ZCode code="width" />）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">多行截断</ZTitle>
    <DemoBlock title="lines = 1 / 2 / 3" :source="MultiLineDemoSource">
      <template #desc>
        <ZCode code="lines" /> 控制最大显示行数,超出以省略号收束(基于 <ZCode code="-webkit-line-clamp" />)。
      </template>
      <MultiLineDemo />
    </DemoBlock>

    <ZTitle :level="2">与 ZText :ellipsis 的区别</ZTitle>
    <ApiTable
      :columns="[
        { key: 'item',     label: '对比维度',   width: '180px' },
        { key: 'zellipsis', label: 'ZEllipsis', mono: true, width: '220px' },
        { key: 'ztext',    label: 'ZText :ellipsis', mono: true },
      ]"
      :rows="compareRows"
    />

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
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '被省略的内容（任意子元素）。lines=1 时单行截断，lines>1 时多行截断。' },
      ]"
    />
  </section>
</template>
