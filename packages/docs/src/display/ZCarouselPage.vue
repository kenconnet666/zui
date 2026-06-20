<script setup lang="ts">
/**
 * ZCarousel 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZCarousel/BasicDemo.vue'
import BasicDemoSource from './ZCarousel/BasicDemo.vue?raw'

import ControlsDemo from './ZCarousel/ControlsDemo.vue'
import ControlsDemoSource from './ZCarousel/ControlsDemo.vue?raw'

import LoopDemo from './ZCarousel/LoopDemo.vue'
import LoopDemoSource from './ZCarousel/LoopDemo.vue?raw'

import EventDemo from './ZCarousel/EventDemo.vue'
import EventDemoSource from './ZCarousel/EventDemo.vue?raw'

const propsRows = [
  {
    name: 'items',
    type: 'T[]',
    default: '—',
    desc: '轮播数据数组，通过 #default slot scope { item, index } 渲染。',
  },
  { name: 'current', type: 'number', default: '0', desc: '当前 index（v-model:current）。' },
  { name: 'autoplay', type: 'boolean', default: 'false', desc: '自动播放。注意：当前不支持 hover 暂停（pauseOnHover），鼠标悬停不会停止轮播。' },
  { name: 'interval', type: 'number', default: '3000', desc: '自动播放间隔 ms。' },
  { name: 'showDots', type: 'boolean', default: 'true', desc: '底部指示点。' },
  { name: 'showArrows', type: 'boolean', default: 'true', desc: '左右箭头。' },
  { name: 'loop', type: 'boolean', default: 'true', desc: '循环播放（到末张自动回第一张）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: 'scope: { item: T, index: number }，渲染每个轮播项。' },
]

const emitsRows = [
  { name: 'update:current', args: 'number', desc: 'current index 变更（v-model:current）。' },
  { name: 'change', args: 'number', desc: '轮播切换后触发，参数为切换后的 index。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCarousel 轮播图</ZTitle>
    <ZParagraph>
      滑动卡片轮播，支持自动播放、指示点、箭头按钮。通过 <ZCode code="#default" /> slot scope
      <ZCode code="{ item, index }" /> 渲染每张幻灯片，<ZCode code="v-model:current" />
      可受控控制当前索引。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 自动播放" :source="BasicDemoSource">
      <template #desc>
        上方轮播同步 <ZCode code="v-model:current" />；下方开启 <ZCode code="autoplay" /> 自动播放并隐藏箭头。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">控件开关</ZTitle>
    <DemoBlock title=":show-dots / :show-arrows 对比" :source="ControlsDemoSource">
      <template #desc>
        <ZCode code=":show-dots='false'" /> 隐藏底部指示点；<ZCode code=":show-arrows='false'" /> 隐藏左右翻页箭头，两者可独立控制。
      </template>
      <ControlsDemo />
    </DemoBlock>

    <ZTitle :level="2">非循环 + 手动翻页</ZTitle>
    <DemoBlock title=":loop='false' + v-model:current + ZButton" :source="LoopDemoSource">
      <template #desc>
        <ZCode code=":loop='false'" /> 到首尾停止不再循环；配合 <ZCode code="v-model:current" /> 和
        <ZCode code="ZButton" /> 手动上一张 / 下一张，两端按钮自动 disabled。
      </template>
      <LoopDemo />
    </DemoBlock>

    <ZTitle :level="2">change 事件</ZTitle>
    <DemoBlock title="@change 回显当前索引" :source="EventDemoSource">
      <template #desc>
        点击箭头或指示点切换后触发 <ZCode code="@change" />，参数为切换后的 index（0-based）。
      </template>
      <EventDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
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
