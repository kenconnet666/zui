<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZTimePicker/BasicDemo.vue'
import BasicDemoSource from './ZTimePicker/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',       type: 'string',             default: '—',    desc: '时间字符串 HH:mm（v-model:value）。' },
  { name: 'step',        type: 'number',             default: '60',   desc: '秒级精度（60 = 不显示秒，1 = 显示秒）。' },
  { name: 'disabled',    type: 'boolean',            default: 'false', desc: '禁用。' },
  { name: 'placeholder', type: 'string',             default: '—',    desc: '占位文字。' },
  { name: 'size',        type: 'number',             default: '1',    desc: '字号 iem 倍数。' },
  { name: 'height',      type: 'number',             default: 'size*2', desc: '高度 iem 倍数。' },
  { name: 'css',         type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const stepCode = ':step="1"'

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '时间变更（HH:mm 或 HH:mm:ss）。' },
  { name: 'change',       args: 'string', desc: '确认后触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZTimePicker 时间选择器</ZTitle>
    <ZParagraph>
      基于原生 <ZCode code="input[type=time]" /> 封装，默认精度到分钟（<ZCode code="step=60" />），
      设为 <ZCode :code="stepCode" /> 可显示秒级选择。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="分钟精度 / 秒级精度 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '160px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
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
