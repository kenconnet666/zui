<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZTag/BasicDemo.vue'
import BasicDemoSource from './ZTag/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZTag 标签</ZTitle>
    <ZParagraph>
      通用标签组件，提供 <strong>3 种 variant</strong>（soft / outlined / filled）、
      <ZCode code="color" /> carrier factory、<ZCode code="size" /> iem 倍数、
      <ZCode code="round" />（圆角胶囊）和 <ZCode code="closable" />（关闭按钮）。
      默认尺寸 0.875iem（≈14px）。
    </ZParagraph>

    <ZTitle :level="2">Variant / Color / Size / Closable</ZTitle>
    <DemoBlock title="软色 / 轮廓 / 填充 + 颜色 + 尺寸 + 关闭" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="soft" /> 变体在无 user color 时用 <ZCode code="_textSecondary.alpha(12)" />
        浅背景；有 user color 时降级为透明背景（类 outlined 无边框）。
        <ZCode code="filled" /> 用 color 作背景 + 反色文字。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'variant',  type: `'filled' | 'outlined' | 'soft'`, default: `'soft'`,   desc: '外观变体。' },
        { name: 'color',    type: '(c: ColorCarrier) => void',       default: '_textSecondary', desc: '主色 factory，影响文字色 / 边框 / 背景（根据 variant 不同）。' },
        { name: 'size',     type: 'number',                          default: '0.875',   desc: 'iem 倍数。padding / borderRadius / fontSize 等比缩放。' },
        { name: 'closable', type: 'boolean',                         default: 'false',   desc: '显示关闭按钮，点击触发 close 事件。' },
        { name: 'round',    type: 'boolean',                         default: 'false',   desc: '圆角胶囊形（borderRadius: _full）。' },
        { name: 'css',      type: '(s: Chain) => void',              default: '—',       desc: '兜底 CSS factory。' },
      ]"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '120px' },
        { key: 'type', label: '参数',  mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'close', type: '(evt: MouseEvent) => void', desc: '点击关闭按钮时触发（需 closable=true）。' },
      ]"
    />
  </section>
</template>
