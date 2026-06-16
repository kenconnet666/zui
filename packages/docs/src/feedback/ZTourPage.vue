<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTour/BasicDemo.vue'
import BasicDemoSource from './ZTour/BasicDemo.vue?raw'

const propsRows = [
  { name: 'steps', type: 'ZTourStep[]', default: '—', desc: '步骤配置数组（必传）。' },
  { name: 'open', type: 'boolean', default: '—', desc: '是否显示（必传）。' },
  { name: 'current', type: 'number', default: '0', desc: '当前步骤 index（v-model:current）。' },
  {
    name: 'minWidth',
    type: 'number',
    default: '20',
    desc: '引导卡片最小宽度（px 倍数，1 单位 = 16px，默认 320px）。',
  },
  {
    name: 'maxWidth',
    type: 'number',
    default: '32',
    desc: '引导卡片最大宽度（px 倍数，1 单位 = 16px，默认 512px）。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const stepRows = [
  { name: 'target', type: 'string', default: '—', desc: '目标元素 CSS selector（如 #my-btn）。' },
  { name: 'title', type: 'string', default: '—', desc: '步骤标题（必传）。' },
  { name: 'description', type: 'string', default: '—', desc: '步骤描述文字。' },
  { name: 'placement', type: 'Placement', default: '—', desc: '引导卡片定位方向。' },
]

const emitsRows = [
  { name: 'update:current', args: 'number', desc: '步骤变更。' },
  { name: 'update:open', args: 'boolean', desc: '显示状态变更。' },
  { name: 'close', args: '—', desc: '点击遮罩、ESC 或「跳过」时触发。' },
  { name: 'finish', args: '—', desc: '完成最后一步时触发。' },
  { name: 'skip', args: '—', desc: '点击「跳过」按钮时触发（区别于 ESC / 遮罩关闭）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTour 新手引导</ZTitle>
    <ZParagraph>
      多步骤新手引导，通过 CSS selector 高亮目标元素，在目标旁弹出引导卡片。
      <ZCode code="steps" /> 配置步骤列表，<ZCode code="open" /> /
      <ZCode code="current" /> 控制显示和进度。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="三步引导 / 高亮目标" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZTourStep</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="stepRows"
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
