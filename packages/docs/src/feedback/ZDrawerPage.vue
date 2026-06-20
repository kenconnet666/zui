<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDrawer/BasicDemo.vue'
import BasicDemoSource from './ZDrawer/BasicDemo.vue?raw'
import PlacementDemo from './ZDrawer/PlacementDemo.vue'
import PlacementDemoSource from './ZDrawer/PlacementDemo.vue?raw'
import FootDemo from './ZDrawer/FootDemo.vue'
import FootDemoSource from './ZDrawer/FootDemo.vue?raw'

const propsRows = [
  { name: 'visible', type: 'boolean', default: 'false', desc: '是否显示（v-model:visible）。' },
  {
    name: 'placement',
    type: "'left'|'right'|'top'|'bottom'",
    default: "'right'",
    desc: '滑入方向。',
  },
  {
    name: 'size',
    type: 'number',
    default: '24',
    desc: 'left/right 时为宽度，top/bottom 时为高度，px 倍数（1 单位 = 16px）。',
  },
  { name: 'title', type: 'string', default: '—', desc: '头部标题（#head slot 优先级更高）。' },
  { name: 'closable', type: 'boolean', default: 'true', desc: '显示关闭按钮。' },
  { name: 'maskClosable', type: 'boolean', default: 'true', desc: '点击遮罩关闭。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: '抽屉主体内容（body）。' },
  { name: 'head', desc: '自定义头部。' },
  { name: 'foot', desc: '底部按钮区域。' },
]

const emitsRows = [
  { name: 'update:visible', args: 'boolean', desc: '显示状态变更。' },
  { name: 'close', args: '—', desc: '关闭时触发。' },
  { name: 'mask-click', args: '—', desc: '点击遮罩时触发。' },
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
      <ZCode code="size" /> 控制宽度（左/右）或高度（上/下），px 倍数（1 单位 = 16px）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="右侧抽屉 / 底部抽屉" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">四方向</ZTitle>
    <DemoBlock title="left / top / right / bottom" :source="PlacementDemoSource">
      <template #desc>
        一个 <ZCode code="placement" /> 变量驱动四个方向，避免维护多个 <ZCode code="ref" />。
      </template>
      <PlacementDemo />
    </DemoBlock>

    <ZTitle :level="2">底部操作栏 + 自定义宽度</ZTitle>
    <DemoBlock title="#foot slot + :size 自定义尺寸" :source="FootDemoSource">
      <template #desc>
        <ZCode code="#foot" /> slot 内放取消/确定按钮；<ZCode code=":size='28'" /> 表示
        28 × 16 = 448 px 宽度。
      </template>
      <FootDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
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
