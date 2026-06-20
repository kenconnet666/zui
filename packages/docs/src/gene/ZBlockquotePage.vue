<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZBlockquote/BasicDemo.vue'
import BasicDemoSource from './ZBlockquote/BasicDemo.vue?raw'

import ColorDemo from './ZBlockquote/ColorDemo.vue'
import ColorDemoSource from './ZBlockquote/ColorDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZBlockquote 引用</ZTitle>
    <ZParagraph>
      块引用组件，视觉效果：左侧强调色边条 + 中性背景 + 斜体文字（可通过 <ZCode code="italic" /> 关闭）。
      <ZCode code="color" /> factory 仅作用于左侧 border 颜色，文字始终使用
      <ZCode code="_text" /> token， 不随 color 变化。<ZCode code="size" /> 是 px 倍数（1 单位 = 16px），padding /
      border-left-width / fontSize 等比缩放。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="color / size 演示" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="color" /> 只影响边条颜色，文字色固定为 <ZCode code="_text" />；
        <ZCode code="size" /> 控制整体比例缩放。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">边条颜色 (color)</ZTitle>
    <DemoBlock title="schema token 与 :css 自定义颜色" :source="ColorDemoSource">
      <template #desc>
        <ZCode code="color" /> factory 仅作用于左侧边条；文字色固定 <ZCode code="_text" />。 非
        schema token 走 <ZCode code=":css" /> 直接覆盖 <ZCode code="borderLeftColor" />。
      </template>
      <ColorDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: '_primary',
          desc: '左侧边条颜色 factory（不影响文字色）。',
        },
        {
          name: 'size',
          type: 'number',
          default: '1',
          desc: 'px 倍数（1 单位 = 16px）。padding-y = size*8px，padding-x = size*12px，border-left-width = size*4px。',
        },
        {
          name: 'italic',
          type: 'boolean',
          default: 'true',
          desc: '是否斜体。默认 true（引用场景）；非引用场景（提示块等）可传 false 关闭斜体。',
        },
        { name: 'css', type: '(s: Chain) => void', default: '—', desc: '兜底 CSS factory。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[{ name: 'default', desc: '引用文字内容，渲染到 blockquote 元素内。' }]"
    />

    <ZTitle :level="2">盒子模型</ZTitle>
    <ZCode
      :inline="false"
      lang="text"
      :code="`ZBlockquote (block, <blockquote>)
  font-size:        size * 16px        /* size=1 → 16px */
  padding-top/bot:  size * 8px         /* size=1 → 8px */
  padding-left/rt:  size * 12px        /* size=1 → 12px */
  border-left:      size * 4px         /* size=1 → 4px 强调边条 */
  background:       _bgMuted
  color:            _text（固定，不随 color factory 变化）
  font-style:       italic（italic=false 时为 normal）
  line-height:      _relaxed`"
    />
  </section>
</template>
