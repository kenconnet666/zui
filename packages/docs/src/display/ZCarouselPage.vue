<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZCarousel/BasicDemo.vue'
import BasicDemoSource from './ZCarousel/BasicDemo.vue?raw'

const propsRows = [
  {
    name: 'items',
    type: 'T[]',
    default: '—',
    desc: '轮播数据数组，通过 #default slot scope { item, index } 渲染。',
  },
  { name: 'current', type: 'number', default: '0', desc: '当前 index（v-model:current）。' },
  { name: 'autoplay', type: 'boolean', default: 'false', desc: '自动播放。' },
  { name: 'interval', type: 'number', default: '3000', desc: '自动播放间隔 ms。' },
  { name: 'showDots', type: 'boolean', default: 'true', desc: '底部指示点。' },
  { name: 'showArrows', type: 'boolean', default: 'true', desc: '左右箭头。' },
  { name: 'loop', type: 'boolean', default: 'true', desc: '循环播放。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [{ name: 'default', desc: 'scope: { item: T, index: number }，渲染每个轮播项。' }]

const emitsRows = [
  { name: 'update:current', args: 'number', desc: 'current index 变更。' },
  { name: 'change', args: 'number', desc: '轮播切换后触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCarousel 轮播图</ZTitle>
    <ZParagraph>
      滑动卡片轮播，支持自动播放、指示点、箭头按钮。通过 <ZCode code="#default" /> slot scope
      渲染每张幻灯片。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 自动播放" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
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

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
