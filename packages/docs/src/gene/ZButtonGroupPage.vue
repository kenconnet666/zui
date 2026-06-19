<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZButtonGroup/BasicDemo.vue'
import BasicDemoSource from './ZButtonGroup/BasicDemo.vue?raw'

const propsRows = [
  { name: 'vertical', type: 'boolean', default: 'false', desc: '纵向排列(默认横向)。' },
  {
    name: 'attached',
    type: 'boolean',
    default: 'true',
    desc: '贴合模式：折叠相邻边框、仅最外侧保留圆角。false 时按 gap 间隔。',
  },
  {
    name: 'gap',
    type: 'number',
    default: '0.5',
    desc: 'attached=false 时的间距(px 倍数，1 = 16px)。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [{ name: 'default', desc: '一组 ZButton(任意 variant / size)。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZButtonGroup 按钮组</ZTitle>
    <ZParagraph>
      把多个 <ZCode code="ZButton" /> 合并为一组。<ZCode code="attached" />(默认)折叠相邻
      1px 边框、仅最外侧保留圆角；非贴合时按 <ZCode code="gap" /> 间隔。支持横向(默认)与
      <ZCode code="vertical" /> 纵向布局。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="横向 / 分页 / 纵向 / 间隔模式" :source="BasicDemoSource">
      <template #desc>
        组内按钮建议统一 <code>size</code> 与 <code>variant</code>；<strong>attached</strong>
        模式自动折叠相邻边框并提升 hover 按钮 z-index。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
