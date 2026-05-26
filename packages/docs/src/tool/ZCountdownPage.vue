<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZCountdown/BasicDemo.vue'
import BasicDemoSource from './ZCountdown/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',     type: 'number | Date',        default: '—（必传）', desc: '目标时间戳（ms）或 Date 对象。' },
  { name: 'format',    type: 'string',                default: "'{h}:{m}:{s}'", desc: '显示格式，占位符：{d} 天 / {h} 时 / {m} 分 / {s} 秒 / {ms} 毫秒。' },
  { name: 'precision', type: "'second' | 'ms'",       default: "'second'", desc: "'second' 每秒刷新，'ms' 每 50ms 刷新（显示毫秒需用此模式）。" },
  { name: 'css',       type: '(s: Chain) => void',   default: '—',         desc: '根元素 CSS 兜底。' },
]

const eventsRows = [
  { name: 'finish', type: '() => void', desc: '倒计时归零时触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCountdown 倒计时</ZTitle>
    <ZParagraph>
      倒计时组件，基于目标时间戳自动计算并展示剩余时间。
      支持自定义格式占位符（<ZCode code="{d}" />天 / <ZCode code="{h}" />时 / <ZCode code="{m}" />分 / <ZCode code="{s}" />秒 / <ZCode code="{ms}" />毫秒）和毫秒级刷新精度。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="默认格式 / 天数 / 毫秒 / finish 事件" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="value" /> 接受目标时间戳（<ZCode code="number" />）或 <ZCode code="Date" /> 对象；
        <ZCode code="precision='ms'" /> 开启毫秒级刷新；
        倒计时归零触发 <ZCode code="@finish" />。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '160px' },
        { key: 'type',    label: '类型',   mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '120px' },
        { key: 'type', label: '参数',  mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="eventsRows"
    />
  </section>
</template>
