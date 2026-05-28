<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDrawer/BasicDemo.vue'
import BasicDemoSource from './ZDrawer/BasicDemo.vue?raw'

const propsRows = [
  { name: 'visible',      type: 'boolean',              default: 'false',    desc: '是否显示（v-model:visible）。' },
  { name: 'placement',    type: "'left'|'right'|'top'|'bottom'", default: "'right'", desc: '滑入方向。' },
  { name: 'size',         type: 'number',               default: '24',       desc: 'left/right 时为宽度，top/bottom 时为高度，单位 iem 倍数。' },
  { name: 'title',        type: 'string',               default: '—',        desc: '头部标题（#head slot 优先级更高）。' },
  { name: 'closable',     type: 'boolean',              default: 'true',     desc: '显示关闭按钮。' },
  { name: 'maskClosable', type: 'boolean',              default: 'true',     desc: '点击遮罩关闭。' },
  { name: 'css',          type: '(s: Chain) => void',   default: '—',        desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: '抽屉主体内容（body）。' },
  { name: 'head',    desc: '自定义头部。' },
  { name: 'foot',    desc: '底部按钮区域。' },
]

const emitsRows = [
  { name: 'update:visible', args: 'boolean', desc: '显示状态变更。' },
  { name: 'close',          args: '—',       desc: '关闭时触发。' },
  { name: 'mask-click',     args: '—',       desc: '点击遮罩时触发。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLElement | null>', desc: '遮罩根元素 DOM 引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDrawer 抽屉</ZTitle>
    <ZParagraph>
      从四个方向滑入的抽屉面板，API 与 ZModal 类似。<ZCode code="placement" /> 控制方向，
      <ZCode code="size" /> 控制宽度（左/右）或高度（上/下），单位为 iem 倍数。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="右侧抽屉 / 底部抽屉" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',  mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
