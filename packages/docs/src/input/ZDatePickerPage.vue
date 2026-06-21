<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZDatePicker/BasicDemo.vue'
import BasicDemoSource from './ZDatePicker/BasicDemo.vue?raw'
import SizeDemo from './ZDatePicker/SizeDemo.vue'
import SizeDemoSource from './ZDatePicker/SizeDemo.vue?raw'
import CssCustomDemo from './ZDatePicker/CssCustomDemo.vue'
import CssCustomDemoSource from './ZDatePicker/CssCustomDemo.vue?raw'
import ChangeEventDemo from './ZDatePicker/ChangeEventDemo.vue'
import ChangeEventDemoSource from './ZDatePicker/ChangeEventDemo.vue?raw'

const propsRows = [
  {
    name: 'value',
    type: 'string',
    default: '—',
    desc: 'ISO 日期字符串 YYYY-MM-DD（v-model:value）。',
  },
  { name: 'min', type: 'string', default: '—', desc: '最早可选日期 YYYY-MM-DD。' },
  { name: 'max', type: 'string', default: '—', desc: '最晚可选日期 YYYY-MM-DD。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '占位文字。' },
  {
    name: 'size',
    type: 'number',
    default: '1',
    desc: '字号 px 倍数（1 单位 = 16px）。height 默认跟 size*2 联动。',
  },
  {
    name: 'height',
    type: 'number',
    default: 'size*2',
    desc: '高度 px 倍数（1 单位 = 16px）。可独立覆盖，与 size 解耦。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '日期变更时触发（YYYY-MM-DD）。' },
  {
    name: 'change',
    args: 'string',
    desc: '确认选择后触发（YYYY-MM-DD），适合执行副作用（如请求接口）。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZDatePicker 日期选择器</ZTitle>
    <ZParagraph>
      基于原生 <ZCode code="input[type=date]" /> 封装，配合 ZUI 输入框样式。值格式为
      <ZCode code="YYYY-MM-DD" />，<ZCode code="min" /> / <ZCode code="max" /> 限制可选范围；
      <ZCode code="size" /> / <ZCode code="height" /> 控制尺寸；<ZCode code="css" />
      可自定义根元素样式。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="日期选择 / min-max 范围限制 / disabled 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸</ZTitle>
    <DemoBlock
      title="size 三档（0.875 / 1 / 1.25）/ height 独立控制高度"
      :source="SizeDemoSource"
    >
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">css 定制</ZTitle>
    <DemoBlock title="css 自定义圆角 / 边框色 / 宽度" :source="CssCustomDemoSource">
      <CssCustomDemo />
    </DemoBlock>

    <ZTitle :level="2">change 事件</ZTitle>
    <DemoBlock title="监听 change 事件，确认选择后触发" :source="ChangeEventDemoSource">
      <ChangeEventDemo />
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

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
