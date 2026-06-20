<script setup lang="ts">
/**
 * ZTimeline 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZTimeline/BasicDemo.vue'
import BasicDemoSource from './ZTimeline/BasicDemo.vue?raw'

import MinimalDemo from './ZTimeline/MinimalDemo.vue'
import MinimalDemoSource from './ZTimeline/MinimalDemo.vue?raw'

import StatusDemo from './ZTimeline/StatusDemo.vue'
import StatusDemoSource from './ZTimeline/StatusDemo.vue?raw'

const propsRows = [
  {
    name: 'items',
    type: 'ZTimelineItem[]',
    default: '—（必传）',
    desc: '时间轴项数组，顺序即渲染顺序。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底 factory。' },
]

const itemRows = [
  { name: 'title', type: 'string', default: '—', desc: '每项标题文字。' },
  { name: 'description', type: 'string', default: '—', desc: '每项描述文字（副标题）。' },
  {
    name: 'color',
    type: "(c: Chain['color']) => void",
    default: '_textSecondary',
    desc: 'dot 圆点颜色 chain factory，默认次要文字色。可传 _success / _warning / _danger / _primary 等。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTimeline 时间轴</ZTitle>
    <ZParagraph>
      展示时间流程或步骤信息，由 <ZCode code="items" /> 数组驱动。每项可设置
      <ZCode code="title" />、<ZCode code="description" /> 以及 <ZCode code="color" />
      factory 控制 dot 颜色，非最后一项自动渲染连接线。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="时间轴 / 自定义 dot 颜色" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="color" /> 接受 chain factory，可自由选取语义色或自定义颜色，不传默认为
        <ZCode code="_textSecondary" />。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">纯标题（无描述）</ZTitle>
    <DemoBlock title="只有 title、没有 description" :source="MinimalDemoSource">
      <template #desc>
        每项只提供 <ZCode code="title" />，省略 <ZCode code="description" />，适合简洁步骤列表。
      </template>
      <MinimalDemo />
    </DemoBlock>

    <ZTitle :level="2">状态流程</ZTitle>
    <DemoBlock title="用 dot 颜色语义化表示流程状态" :source="StatusDemoSource">
      <template #desc>
        用 <ZCode code="_success" /> / <ZCode code="_warning" /> / <ZCode code="_danger" /> /
        <ZCode code="_primary" /> 分别表示「正常 / 待处理 / 异常 / 进行中」，直观呈现状态流转。
      </template>
      <StatusDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
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

    <ZTitle :level="2">ZTimelineItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '字段', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
    />
  </section>
</template>
