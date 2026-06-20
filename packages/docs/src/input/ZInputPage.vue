<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZInput/BasicDemo.vue'
import BasicDemoSource from './ZInput/BasicDemo.vue?raw'
import SizeDemo from './ZInput/SizeDemo.vue'
import SizeDemoSource from './ZInput/SizeDemo.vue?raw'
import AffixDemo from './ZInput/AffixDemo.vue'
import AffixDemoSource from './ZInput/AffixDemo.vue?raw'
import ClearableCountDemo from './ZInput/ClearableCountDemo.vue'
import ClearableCountDemoSource from './ZInput/ClearableCountDemo.vue?raw'
import DisabledDemo from './ZInput/DisabledDemo.vue'
import DisabledDemoSource from './ZInput/DisabledDemo.vue?raw'

const propsRows = [
  { name: 'value', type: 'string | number', default: '—', desc: '绑定值（v-model:value）。' },
  { name: 'type', type: 'string', default: "'text'", desc: 'HTML input type。' },
  { name: 'size', type: 'number', default: '1', desc: 'px 倍数（1 单位 = 16px）。默认 1 = 16px 字号，padding/height 等比缩放（默认高度 32px，内边距 6px/12px）。' },
  { name: 'height', type: 'number', default: 'size*2', desc: '高度 px 倍数（1 单位 = 16px）。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '占位文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '只读。' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '显示清空按钮（有值时）。' },
  { name: 'showCount', type: 'boolean', default: 'false', desc: '显示字数（配合 maxlength）。' },
  { name: 'maxlength', type: 'number', default: '—', desc: 'HTML maxlength。' },
  { name: 'autofocus', type: 'boolean', default: 'false', desc: '自动聚焦。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'prefix', desc: '前置内容（图标/文字）。' },
  { name: 'suffix', desc: '后置内容（图标/文字）。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '值变更。' },
  { name: 'change', args: 'string, Event', desc: 'blur 或 Enter 确认时。' },
  { name: 'focus', args: 'FocusEvent', desc: '聚焦。' },
  { name: 'blur', args: 'FocusEvent', desc: '失焦。' },
  { name: 'clear', args: '—', desc: '点击清空按钮。' },
  { name: 'pressEnter', args: 'KeyboardEvent', desc: '按 Enter 键。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLDivElement | null>', desc: '根 wrapper 元素引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZInput 输入框</ZTitle>
    <ZParagraph>
      文本输入框，支持 <ZCode code="type" /> 切换输入类型，<ZCode code="clearable" /> 一键清空，
      <ZCode code="showCount" /> 显示字数，<ZCode code="prefix" /> / <ZCode code="suffix" /> slot
      前后附加内容。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="多类型 / 多尺寸 / 清空 / 字数 / 只读 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸</ZTitle>
    <DemoBlock title="size 三档(0.875 / 1 / 1.25)" :source="SizeDemoSource">
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">前后附加内容</ZTitle>
    <DemoBlock title="prefix / suffix slot" :source="AffixDemoSource">
      <AffixDemo />
    </DemoBlock>

    <ZTitle :level="2">清空与字数</ZTitle>
    <DemoBlock title="clearable + showCount" :source="ClearableCountDemoSource">
      <ClearableCountDemo />
    </DemoBlock>

    <ZTitle :level="2">只读与禁用</ZTitle>
    <DemoBlock title="readonly / disabled" :source="DisabledDemoSource">
      <DisabledDemo />
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
        { key: 'args', label: '参数', mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法/属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
