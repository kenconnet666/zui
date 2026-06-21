<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZTransfer/BasicDemo.vue'
import BasicDemoSource from './ZTransfer/BasicDemo.vue?raw'
import TitlesDemo from './ZTransfer/TitlesDemo.vue'
import TitlesDemoSource from './ZTransfer/TitlesDemo.vue?raw'
import SizeDemo from './ZTransfer/SizeDemo.vue'
import SizeDemoSource from './ZTransfer/SizeDemo.vue?raw'
import EmptyDemo from './ZTransfer/EmptyDemo.vue'
import EmptyDemoSource from './ZTransfer/EmptyDemo.vue?raw'
import ChangeDemo from './ZTransfer/ChangeDemo.vue'
import ChangeDemoSource from './ZTransfer/ChangeDemo.vue?raw'
import CssDemo from './ZTransfer/CssDemo.vue'
import CssDemoSource from './ZTransfer/CssDemo.vue?raw'

const propsRows = [
  { name: 'dataSource', type: 'ZTransferItem[]', default: '—', desc: '全量数据（必传）。' },
  {
    name: 'targetKeys',
    type: 'string[]',
    default: '[]',
    desc: '右侧已选 key 数组（v-model:targetKeys）。',
  },
  { name: 'titles', type: '[string, string]', default: "['源','目标']", desc: '左右面板标题元组。' },
  {
    name: 'itemSize',
    type: 'number',
    default: '2',
    desc: '每项行高 px 倍数（1 单位 = 16px，默认 2 = 32px）。',
  },
  {
    name: 'listHeight',
    type: 'number',
    default: '15',
    desc: '列表容器高度 px 倍数（1 单位 = 16px，默认 15 = 240px）。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'key', type: 'string', default: '—', desc: '数据项唯一标识。' },
  { name: 'label', type: 'string', default: '—', desc: '显示文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用（不可勾选，不可转移）。' },
]

const emitsRows = [
  { name: 'update:targetKeys', args: 'string[]', desc: '右侧 keys 变更（v-model）。' },
  {
    name: 'change',
    args: 'string[]',
    desc: '右侧 key 列表变化，payload 同 update:targetKeys，适合非 v-model 受控场景。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTransfer 穿梭框</ZTitle>
    <ZParagraph>
      左右两个列表，通过中间按钮互相转移数据。<ZCode code="dataSource" /> 提供全量数据，
      <ZCode code="targetKeys" /> 控制右侧已选项（v-model）。<ZCode code="titles" /> 可自定义
      左右面板标题，列表使用虚拟渲染支持大量数据。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="穿梭 / disabled 禁用项" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义标题</ZTitle>
    <DemoBlock title="titles：自定义左右面板标题" :source="TitlesDemoSource">
      <TitlesDemo />
    </DemoBlock>

    <ZTitle :level="2">列表尺寸</ZTitle>
    <DemoBlock title="itemSize / listHeight：行高与列表容器高度" :source="SizeDemoSource">
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">空列表态</ZTitle>
    <DemoBlock title="某侧无数据时展示 ZEmpty 空态" :source="EmptyDemoSource">
      <EmptyDemo />
    </DemoBlock>

    <ZTitle :level="2">change 事件</ZTitle>
    <DemoBlock title="@change 监听右侧 key 列表变化" :source="ChangeDemoSource">
      <ChangeDemo />
    </DemoBlock>

    <ZTitle :level="2">CSS 定制</ZTitle>
    <DemoBlock title="css prop：Chain 回调定制根容器样式" :source="CssDemoSource">
      <CssDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '110px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZTransferItem</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '120px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '200px' },
        { key: 'args', label: '参数', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
