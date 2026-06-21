<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZPagination/BasicDemo.vue'
import BasicDemoSource from './ZPagination/BasicDemo.vue?raw'
import PageSizeDemo from './ZPagination/PageSizeDemo.vue'
import PageSizeDemoSource from './ZPagination/PageSizeDemo.vue?raw'
import DisabledDemo from './ZPagination/DisabledDemo.vue'
import DisabledDemoSource from './ZPagination/DisabledDemo.vue?raw'
import SizeItemSizeDemo from './ZPagination/SizeItemSizeDemo.vue'
import SizeItemSizeDemoSource from './ZPagination/SizeItemSizeDemo.vue?raw'
import ChangeEventDemo from './ZPagination/ChangeEventDemo.vue'
import ChangeEventDemoSource from './ZPagination/ChangeEventDemo.vue?raw'

const propsRows = [
  { name: 'total', type: 'number', default: '—（必传）', desc: '总数据条数。' },
  { name: 'page', type: 'number', default: '1', desc: '当前页码（1-based，v-model:page）。' },
  { name: 'pageSize', type: 'number', default: '10', desc: '每页条数。' },
  { name: 'siblings', type: 'number', default: '1', desc: '当前页两侧显示的页码数。' },
  { name: 'showTotal', type: 'boolean', default: 'false', desc: '是否显示总条数文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用，所有页码按钮不可交互。' },
  {
    name: 'size',
    type: 'number',
    default: '1',
    desc: '字号 px 倍数（1 单位 = 16px）。item 尺寸默认跟 size*2 联动（32px）。',
  },
  {
    name: 'itemSize',
    type: 'number',
    default: 'size*2',
    desc: 'item 宽高 px 倍数（1 单位 = 16px）。独立覆盖 item 尺寸，不影响字号。',
  },
  { name: 'sxItem', type: 'SxObject', default: '—', desc: '页码 item 额外样式（sx 对象）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:page', args: 'number', desc: 'v-model:page 更新事件，页码变化时触发。' },
  { name: 'change', args: 'number', desc: '页码变化时触发，与 update:page 同步，payload 为新页码。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZPagination 分页</ZTitle>
    <ZParagraph>
      分页器，通过 <ZCode code="v-model:page" /> 绑定当前页码。
      <ZCode code="pageSize" /> 控制每页条数；
      <ZCode code="siblings" /> 控制当前页两侧显示的页码数；
      <ZCode code="showTotal" /> 显示总条数信息；<ZCode code="size" /> / <ZCode code="itemSize" />
      分别控制字号和 item 尺寸。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 显示总数 / 更多页码（siblings=2）/ 小尺寸" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">每页条数</ZTitle>
    <DemoBlock title="pageSize 5 / 10 / 20（总 100 条）" :source="PageSizeDemoSource">
      <PageSizeDemo />
    </DemoBlock>

    <ZTitle :level="2">禁用</ZTitle>
    <DemoBlock title="disabled 整体禁用" :source="DisabledDemoSource">
      <DisabledDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸</ZTitle>
    <DemoBlock
      title="size 字号三档 / itemSize 独立控制 item 尺寸"
      :source="SizeItemSizeDemoSource"
    >
      <SizeItemSizeDemo />
    </DemoBlock>

    <ZTitle :level="2">change 事件</ZTitle>
    <DemoBlock title="监听 change 事件，记录翻页日志" :source="ChangeEventDemoSource">
      <ChangeEventDemo />
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
