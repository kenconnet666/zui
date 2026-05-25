<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZSegmented/BasicDemo.vue'
import BasicDemoSource from './ZSegmented/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZSegmented 分段控制</ZTitle>
    <ZParagraph>
      类 iOS Segmented Control 的分段选择器，支持 <ZCode code="v-model:value" /> 双向绑定。
      <ZCode code="options" /> 数组声明选项（支持单项 disabled），
      <ZCode code="block" /> 满宽展开，<ZCode code="size" /> iem 倍数整体缩放。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 禁用项 / 满宽 + 尺寸" :source="BasicDemoSource">
      <template #desc>
        激活项背景 <ZCode code="_bg" /> + 阴影 <ZCode code="_tiny" />；
        未激活项 hover 变色；整体禁用时 <ZCode code="opacity._dim" />。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '300px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'value',    type: 'string | number',    default: '—',     desc: '当前选中值（配合 v-model:value）。' },
        { name: 'options',  type: 'ZSegmentedOption[]', default: '—（必传）', desc: '选项列表，每项 { value, label, disabled? }。' },
        { name: 'size',     type: 'number',             default: '1',     desc: 'iem 倍数，fontSize / padding / height 等比缩放。' },
        { name: 'height',   type: 'number',             default: 'size*2', desc: 'item 高度 iem 倍数，可独立覆盖。' },
        { name: 'block',    type: 'boolean',            default: 'false', desc: '满宽（width: 100%）。' },
        { name: 'disabled', type: 'boolean',            default: 'false', desc: '整体禁用（所有选项不可点击）。' },
        { name: 'css',      type: '(s: Chain) => void', default: '—',     desc: '根元素 CSS 兜底。' },
      ]"
    />

    <ZTitle :level="2">ZSegmentedOption</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '字段',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'value',    type: 'string | number', desc: '选项唯一标识，v-model 绑定的值。' },
        { name: 'label',    type: 'string',          desc: '显示文字。' },
        { name: 'disabled', type: 'boolean',         desc: '单项禁用。' },
      ]"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',          mono: true, width: '180px' },
        { key: 'type', label: '参数',          mono: true, width: '260px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'update:value', type: '(value: string | number) => void', desc: 'v-model:value 对应的 emit，选中变化时触发。' },
      ]"
    />
  </section>
</template>
