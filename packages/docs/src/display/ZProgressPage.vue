<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZProgress/BasicDemo.vue'
import BasicDemoSource from './ZProgress/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',    type: 'number',             default: '—（必传）', desc: '进度值 0~100，超出自动 clamp。' },
  { name: 'type',     type: "'line' | 'circle'",  default: "'line'",    desc: '进度条形态。' },
  { name: 'size',     type: 'number',             default: '线: 0.5 / 圆: 7.5', desc: 'iem 倍数。line 为 rail 高度（0.5 = 8px）；circle 为容器直径（7.5 = 120px）。' },
  { name: 'color',    type: '(c: Chain) => void', default: '_primary',  desc: '进度颜色 factory。' },
  { name: 'showText', type: 'boolean',            default: 'false',     desc: '是否显示百分比文字（line 在右侧，circle 在中心）。' },
  { name: 'css',      type: '(s: Chain) => void', default: '—',         desc: '根元素 CSS 兜底。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZProgress 进度条</ZTitle>
    <ZParagraph>
      进度条组件，支持线性（<ZCode code="type='line'" />）和环形（<ZCode code="type='circle'" />）两种形态。
      <ZCode code="size" /> 为 iem 倍数，line 模式控制轨道高度，circle 模式控制外层容器直径。
      颜色通过 <ZCode code="color" /> factory 传入。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="线性 / 自定义颜色 / 环形 / 动态值" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '160px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />
  </section>
</template>
