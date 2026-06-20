<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZProgress/BasicDemo.vue'
import BasicDemoSource from './ZProgress/BasicDemo.vue?raw'
import LineDemo from './ZProgress/LineDemo.vue'
import LineDemoSource from './ZProgress/LineDemo.vue?raw'
import CircleDemo from './ZProgress/CircleDemo.vue'
import CircleDemoSource from './ZProgress/CircleDemo.vue?raw'
import ColorDemo from './ZProgress/ColorDemo.vue'
import ColorDemoSource from './ZProgress/ColorDemo.vue?raw'

const propsRows = [
  { name: 'value', type: 'number', default: '—（必传）', desc: '进度值 0~100，超出自动 clamp。' },
  { name: 'type', type: "'line' | 'circle'", default: "'line'", desc: '进度条形态。' },
  {
    name: 'size',
    type: 'number',
    default: 'line: 0.5 / circle: 7.5',
    desc: 'px 倍数（1 单位 = 16px）。line 模式：默认 0.5 = 8px，轨道高度（rail height）。circle 模式：默认 7.5 = 120px，容器直径（width + height）。',
  },
  { name: 'color', type: '(c: Chain) => void', default: '_primary', desc: '进度颜色 factory。' },
  {
    name: 'showText',
    type: 'boolean',
    default: 'false',
    desc: '是否显示百分比文字（line 在右侧，circle 在中心）。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZProgress 进度条</ZTitle>
    <ZParagraph>
      进度条组件，支持线性（<ZCode code="type='line'" />）和环形（<ZCode
        code="type='circle'"
      />）两种形态。 <ZCode code="size" /> 为 px 倍数（1 单位 = 16px），line 模式控制轨道高度，circle
      模式控制外层容器直径。 颜色通过 <ZCode code="color" /> factory 传入。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="线性 / 自定义颜色 / 环形 / 动态值" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">线性进度条 size 阶梯</ZTitle>
    <DemoBlock title="size 0.5 / 1 / 1.5" :source="LineDemoSource">
      <template #desc>
        line 模式 <code>size</code> 控制 rail 高度（px 倍数，默认 0.5 = 8px）。
      </template>
      <LineDemo />
    </DemoBlock>

    <ZTitle :level="2">环形进度条</ZTitle>
    <DemoBlock title="circle / 不同 size" :source="CircleDemoSource">
      <template #desc>
        circle 模式 <code>size</code> 控制容器直径（px 倍数，默认 7.5 = 120px），SVG viewBox 始终
        100×100。
      </template>
      <CircleDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义颜色</ZTitle>
    <DemoBlock title="语义 token + 命名色 + alpha modifier" :source="ColorDemoSource">
      <template #desc>
        <code>color</code> factory 支持 schema 语义 token、CSS 命名色、modifier 链(alpha / darken /
        lighten 等)。
      </template>
      <ColorDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '160px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />
  </section>
</template>
