<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZCopyButton/BasicDemo.vue'
import BasicDemoSource from './ZCopyButton/BasicDemo.vue?raw'
import LabelDemo from './ZCopyButton/LabelDemo.vue'
import LabelDemoSource from './ZCopyButton/LabelDemo.vue?raw'

const propsRows = [
  { name: 'text', type: 'string', default: '—（必传）', desc: '要复制的文本内容。' },
  {
    name: 'size',
    type: 'number',
    default: '1',
    desc: 'px 倍数（1 单位 = 16px），所有维度（font/padding/gap/radius）等比缩放。',
  },
  { name: 'label', type: 'string', default: '—', desc: '按钮文字，不传则纯图标模式。' },
  {
    name: 'copiedLabel',
    type: 'string',
    default: "'已复制'",
    desc: '复制成功后临时显示的按钮文字。',
  },
  { name: 'duration', type: 'number', default: '1500', desc: '"已复制"状态持续毫秒数。' },
  { name: 'toast', type: 'boolean', default: 'true', desc: '是否弹 toast 反馈。' },
  { name: 'toastMessage', type: 'string', default: "'已复制'", desc: 'toast 文字内容。' },
  { name: 'toastDuration', type: 'number', default: '1500', desc: 'toast 持续毫秒数。' },
  { name: 'icon', type: 'Component', default: 'ContentCopyOutlined', desc: '自定义图标组件。' },
  {
    name: 'iconSize',
    type: 'number',
    default: 'size * 0.875',
    desc: '图标尺寸 px 倍数（1 单位 = 16px），不传随 size 自动缩放。',
  },
  {
    name: 'color',
    type: '(c: ColorCarrier) => void',
    default: '_textSecondary',
    desc: '文字色 factory，hover 时 _text。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCopyButton 复制按钮</ZTitle>
    <ZParagraph>
      通用"一键复制"按钮，调用 <ZCode code="navigator.clipboard.writeText" />。
      点击后按钮文字临时切换为 <ZCode code="copiedLabel" />（默认"已复制"）， 同时可弹顶部 toast
      反馈（默认开启）。 <ZCode code="size" /> 是 px 倍数（1 单位 = 16px），内部所有维度等比缩放。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="纯图标 / 带文字 / size / color / toast 控制" :source="BasicDemoSource">
      <template #desc>
        不传 <ZCode code="label" /> 为纯图标按钮；传 <ZCode code="label" /> 同时显示图标和文字。
        <ZCode code="toast=false" /> 关闭成功 toast，仅保留按钮状态切换。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">带文字 / 尺寸 / 静默</ZTitle>
    <DemoBlock title="label / size / 关闭 toast" :source="LabelDemoSource">
      <template #desc>
        <ZCode code="label" /> 显示文字,<ZCode code="copiedLabel" /> 是复制成功临时文案;
        <ZCode code=":toast='false'" /> 关闭弹出提示。
      </template>
      <LabelDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '180px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '100px' },
        { key: 'type', label: '参数', mono: true, width: '300px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'copy',
          type: '(success: boolean, text: string) => void',
          desc: '复制完成（包含成功/失败状态 + 实际复制的文本）。',
        },
      ]"
    />
  </section>
</template>
