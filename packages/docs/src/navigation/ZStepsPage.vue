<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZSteps/BasicDemo.vue'
import BasicDemoSource from './ZSteps/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'ZStepItem[]', default: '—（必传）', desc: '步骤项数组。' },
  { name: 'current', type: 'number', default: '0', desc: '当前激活步骤（0-based）。' },
  { name: 'vertical', type: 'boolean', default: 'false', desc: '垂直布局。' },
  {
    name: 'errored',
    type: 'boolean',
    default: 'false',
    desc: '错误状态，当前步骤显示为 _danger + 关闭图标。',
  },
  { name: 'size', type: 'number', default: '2', desc: '步骤指示器大小（iem 倍数，2 = 32px）。' },
  {
    name: 'currentColor',
    type: '(c: Chain) => void',
    default: '_primary',
    desc: '当前步骤颜色 factory。',
  },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const itemRows = [
  { name: 'title', type: 'string', default: '—（必传）', desc: '步骤标题。' },
  { name: 'description', type: 'string', default: '—', desc: '步骤描述（可选）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZSteps 步骤条</ZTitle>
    <ZParagraph>
      步骤条组件，用于引导用户按步骤完成任务。
      <ZCode code="current" /> 为 0-based 索引；<ZCode code="errored" /> 可标记当前步骤为错误态；
      <ZCode code=":vertical='true'" /> 切换为垂直布局。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="水平 / 垂直 / 错误态 / 动态切换" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZStepItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '字段', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '120px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemRows"
    />
  </section>
</template>
