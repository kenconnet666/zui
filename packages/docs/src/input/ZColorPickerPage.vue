<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZColorPicker/BasicDemo.vue'
import BasicDemoSource from './ZColorPicker/BasicDemo.vue?raw'
import ShowTextDemo from './ZColorPicker/ShowTextDemo.vue'
import ShowTextDemoSource from './ZColorPicker/ShowTextDemo.vue?raw'

const propsRows = [
  { name: 'value',    type: 'string',             default: "'#000000'", desc: '颜色值 #rrggbb 格式（v-model:value）。' },
  { name: 'disabled', type: 'boolean',            default: 'false',    desc: '禁用。' },
  { name: 'showText', type: 'boolean',            default: 'true',     desc: '显示色值文字。' },
  { name: 'css',      type: '(s: Chain) => void', default: '—',        desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '颜色值变更（#rrggbb）。' },
  { name: 'change',       args: 'string', desc: '确认颜色后触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZColorPicker 颜色选择器</ZTitle>
    <ZParagraph>
      基于原生 <ZCode code="input[type=color]" /> 封装，配合色块预览和色值文字。
      值格式为 <ZCode code="#rrggbb" />，<ZCode code="showText" /> 控制是否显示色值。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="颜色选择 / 隐藏文字 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">显示色值 / 禁用</ZTitle>
    <DemoBlock title="showText / disabled" :source="ShowTextDemoSource">
      <template #desc>
        <ZCode code="showText" /> 在色块旁显示十六进制色值;<ZCode code="disabled" /> 禁用选择。
      </template>
      <ShowTextDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
