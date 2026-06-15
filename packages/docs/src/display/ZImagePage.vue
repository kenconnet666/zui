<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZImage/BasicDemo.vue'
import BasicDemoSource from './ZImage/BasicDemo.vue?raw'
import FitDemo from './ZImage/FitDemo.vue'
import FitDemoSource from './ZImage/FitDemo.vue?raw'
import ErrorSlotDemo from './ZImage/ErrorSlotDemo.vue'
import ErrorSlotDemoSource from './ZImage/ErrorSlotDemo.vue?raw'

const propsRows = [
  { name: 'src', type: 'string', default: '—（必传）', desc: '图片地址。' },
  { name: 'alt', type: 'string', default: "''", desc: '图片描述（a11y）。' },
  { name: 'lazy', type: 'boolean', default: 'true', desc: '是否懒加载（loading="lazy"）。' },
  { name: 'fallback', type: 'string', default: '—', desc: '加载失败时的备用图片地址。' },
  {
    name: 'width',
    type: '(w: Chain[width]) => void',
    default: '—',
    desc: '宽度 factory，如 w => w.px(160) / w.px(128) / w.pct(100)。',
  },
  { name: 'height', type: '(h: Chain[height]) => void', default: '—', desc: '高度 factory。' },
  {
    name: 'fit',
    type: '(f: Chain[objectFit]) => void',
    default: 'cover',
    desc: 'objectFit factory，如 f => f.cover / f.contain。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'load', type: '(evt: Event) => void', desc: '图片加载成功时触发。' },
  { name: 'error', type: '(evt: Event) => void', desc: '图片加载失败时触发。' },
]

const slotsRows = [
  { name: 'error', desc: '图片加载失败且无 fallback 时显示的内容（默认显示"加载失败"文字）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZImage 图片</ZTitle>
    <ZParagraph>
      增强 <ZCode code="img" /> 标签，默认开启懒加载，支持 fallback 备用图和
      <ZCode code="#error" /> slot 自定义错误状态。 宽高通过 <ZCode code="width" /> /
      <ZCode code="height" /> factory 传入，可使用 
      <ZCode code=".px()" /> / <ZCode code=".pct()" /> 等任意 carrier 方法。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="默认 / contain / fallback / 错误状态" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">objectFit 五种模式</ZTitle>
    <DemoBlock title="fill / contain / cover / none / scaleDown" :source="FitDemoSource">
      <template #desc>
        所有 5 种 objectFit 取值,box 都是 120×120 但原图是 200×100,可以直观对比。
      </template>
      <FitDemo />
    </DemoBlock>

    <ZTitle :level="2">错误自定义与加载策略</ZTitle>
    <DemoBlock title="#error slot / lazy=false" :source="ErrorSlotDemoSource">
      <template #desc>
        <code>#error</code> slot 完全自定义加载失败展示;<code>lazy=false</code> 走 eager 立即加载。
      </template>
      <ErrorSlotDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '100px' },
        { key: 'type', label: '参数', mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
