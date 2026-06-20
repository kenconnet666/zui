<script setup lang="ts">
/**
 * ZCalendar 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZCalendar/BasicDemo.vue'
import BasicDemoSource from './ZCalendar/BasicDemo.vue?raw'

import ControlledDemo from './ZCalendar/ControlledDemo.vue'
import ControlledDemoSource from './ZCalendar/ControlledDemo.vue?raw'

import UncontrolledDemo from './ZCalendar/UncontrolledDemo.vue'
import UncontrolledDemoSource from './ZCalendar/UncontrolledDemo.vue?raw'

const propsRows = [
  {
    name: 'value',
    type: 'string',
    default: '—',
    desc: 'ISO 日期字符串 YYYY-MM-DD（v-model:value）。',
  },
  { name: 'firstDayOfWeek', type: '0 | 1', default: '0', desc: '周起始：0 = 周日，1 = 周一。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
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
      和上下月切换。<ZCode code="firstDayOfWeek" /> 控制周起始（0 = 周日，1 = 周一）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="日期选择 / 周一起首" :source="BasicDemoSource">
      <template #desc>
        左侧绑定 <ZCode code="v-model:value" /> 回显所选日期；右侧设 <ZCode code=":first-day-of-week='1'" /> 改为周一起首。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">受控模式</ZTitle>
    <DemoBlock title="v-model:value 绑定" :source="ControlledDemoSource">
      <template #desc>
        通过 <ZCode code="v-model:value" /> 绑定 ISO 字符串，点击日期后下方实时回显当前值。
      </template>
      <ControlledDemo />
    </DemoBlock>

    <ZTitle :level="2">只读展示（今日高亮）</ZTitle>
    <DemoBlock title="不绑定 value，今日自动描边高亮" :source="UncontrolledDemoSource">
      <template #desc>
        不传 <ZCode code="value" /> 时组件仍可展示当月视图，今日以 <ZCode code="outline" /> 描边 + 主色文字突出显示。
      </template>
      <UncontrolledDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />
  </section>
</template>
