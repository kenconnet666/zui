<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTimeline/BasicDemo.vue'
import BasicDemoSource from './ZTimeline/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'ZTimelineItem[]', default: '—', desc: '时间轴项数组。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'title', type: 'string', default: '—', desc: '每项标题。' },
  { name: 'description', type: 'string', default: '—', desc: '每项描述文字。' },
  {
    name: 'color',
    type: "(c: Chain['color']) => void",
    default: '—',
    desc: 'dot 颜色 factory，默认 _textSecondary。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTimeline 时间轴</ZTitle>
    <ZParagraph>
      展示时间流程信息，由 <ZCode code="items" /> 配置项驱动，每项可自定义
      <ZCode code="title" />、<ZCode code="description" /> 和 <ZCode code="color" /> dot 颜色。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="时间轴 / 自定义颜色" :source="BasicDemoSource">
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

    <ZTitle :level="2">ZTimelineItem</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
    />
  </section>
</template>
