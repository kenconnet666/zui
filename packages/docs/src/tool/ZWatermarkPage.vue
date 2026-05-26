<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZWatermark/BasicDemo.vue'
import BasicDemoSource from './ZWatermark/BasicDemo.vue?raw'

const propsRows = [
  { name: 'content',  type: 'string',             default: '—（必传）',             desc: '水印文字内容。' },
  { name: 'fontSize', type: 'number',             default: '14',                    desc: '字号（px，Canvas 绘制单位）。' },
  { name: 'color',    type: 'string',             default: "'rgba(0,0,0,0.10)'",    desc: '水印颜色（CSS 颜色字符串，建议低透明度）。' },
  { name: 'gap',      type: 'number',             default: '100',                   desc: '水印图案间距（px）。' },
  { name: 'rotate',   type: 'number',             default: '-22',                   desc: '旋转角度（deg）。' },
  { name: 'css',      type: '(s: Chain) => void', default: '—',                     desc: '容器根元素 CSS 兜底（通常用于设置 height）。' },
]

const slotsRows = [
  { name: 'default', desc: '被水印覆盖的内容区域。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZWatermark 水印</ZTitle>
    <ZParagraph>
      通过 Canvas 生成水印图案并平铺作为背景，覆盖在 slot 内容之上。
      水印层设置 <ZCode code="pointer-events: none" />，不影响用户操作。
      支持文字、字号、颜色、旋转角度和间距自定义。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础水印 / 自定义样式" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="content" /> 为水印文字（必传）；
        <ZCode code="fontSize" /> 单位 px（Canvas 绘制）；
        <ZCode code="rotate" /> 单位 deg（默认 -22）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '140px' },
        { key: 'default', label: '默认值', mono: true, width: '140px' },
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
  </section>
</template>
