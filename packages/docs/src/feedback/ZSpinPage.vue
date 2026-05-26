<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZSpin/BasicDemo.vue'
import BasicDemoSource from './ZSpin/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZSpin 加载</ZTitle>
    <ZParagraph>
      加载指示器，支持两种使用模式：
      纯 indicator 模式（无 default slot）直接渲染旋转图标；
      包裹模式（有 default slot）将内容遮罩并居中显示 indicator。
      <ZCode code="size" /> 为 iem 倍数，控制图标大小。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="尺寸 / tip / 包裹模式" :source="BasicDemoSource">
      <template #desc>
        有 default slot 时为包裹模式，<ZCode code=":spinning='false'" /> 时透明渲染 slot 内容。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '160px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'spinning', type: 'boolean',            default: 'true',  desc: '是否显示加载状态。false 时包裹内容正常显示。' },
        { name: 'size',     type: 'number',             default: '1.5',   desc: 'iem 倍数，控制 indicator 图标大小。' },
        { name: 'tip',      type: 'string',             default: '—',     desc: 'indicator 下方文字（纯 indicator 模式时显示在图标旁）。' },
        { name: 'tag',      type: 'string',             default: `'div'`, desc: '根元素 tag。' },
        { name: 'css',      type: '(s: Chain) => void', default: '—',     desc: '根元素 CSS 兜底。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',    mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default',   desc: '被包裹的内容（包裹模式）。不传时为纯 indicator 模式（inline-flex）。' },
        { name: 'indicator', desc: '自定义 loading 图标，覆盖默认旋转图标。' },
      ]"
    />
  </section>
</template>
