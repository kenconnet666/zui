<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZCalendar/BasicDemo.vue'
import BasicDemoSource from './ZCalendar/BasicDemo.vue?raw'

const propsRows = [
  { name: 'value',          type: 'string',             default: '—', desc: 'ISO 日期字符串 YYYY-MM-DD（v-model:value）。' },
  { name: 'firstDayOfWeek', type: '0 | 1',              default: '0', desc: '周起始：0 = 周日，1 = 周一。' },
  { name: 'css',            type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '选中日期变更，格式 YYYY-MM-DD。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCalendar 日历</ZTitle>
    <ZParagraph>
      月视图日历，支持日期选择（<ZCode code="v-model:value" />，格式 <ZCode code="YYYY-MM-DD" />）
      和上下月切换。<ZCode code="firstDayOfWeek" /> 控制周起始（周日或周一）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="日期选择 / 周一起首" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '160px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
