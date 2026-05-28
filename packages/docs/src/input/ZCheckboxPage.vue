<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZCheckbox/BasicDemo.vue'
import BasicDemoSource from './ZCheckbox/BasicDemo.vue?raw'
import GroupDemo from './ZCheckbox/GroupDemo.vue'
import GroupDemoSource from './ZCheckbox/GroupDemo.vue?raw'

const checkboxPropsRows = [
  { name: 'checked',       type: 'boolean',            default: 'false', desc: '单独使用时的绑定值（v-model:checked）。' },
  { name: 'value',         type: 'string|number|boolean', default: '—', desc: 'Group 内的选项值。' },
  { name: 'label',         type: 'string',             default: '—',    desc: '文字标签。' },
  { name: 'disabled',      type: 'boolean',            default: 'false', desc: '禁用。' },
  { name: 'indeterminate', type: 'boolean',            default: 'false', desc: '半选状态。' },
  { name: 'size',          type: 'number',             default: '1',    desc: '方框尺寸 iem 倍数。' },
  { name: 'css',           type: '(s: Chain) => void', default: '—',    desc: '根元素 CSS 兜底。' },
]

const groupPropsRows = [
  { name: 'value',     type: '(string|number|boolean)[]', default: '[]',   desc: '选中值数组（v-model:value）。' },
  { name: 'disabled',  type: 'boolean',                   default: 'false', desc: '统一禁用所有子项。' },
  { name: 'options',   type: 'ZCheckboxOption[]',         default: '—',    desc: '快捷选项配置（替代手写子 ZCheckbox）。' },
  { name: 'direction', type: 'flexDirection factory',     default: '—',    desc: '排列方向（默认横排）。' },
  { name: 'css',       type: '(s: Chain) => void',        default: '—',    desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:checked', args: 'boolean', desc: '（ZCheckbox）勾选状态变更。' },
  { name: 'update:value',   args: '(string|number|boolean)[]', desc: '（ZCheckboxGroup）选中数组变更。' },
  { name: 'change',         args: '(string|number|boolean)[]', desc: '（ZCheckboxGroup）选中数组变更（与 update:value 等价）。' },
]

const slotsRows = [
  { name: 'default', desc: '（ZCheckbox）自定义标签内容，覆盖 label prop。' },
  { name: 'default', desc: '（ZCheckboxGroup）放置子 ZCheckbox（未传 options 时生效）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZCheckbox / ZCheckboxGroup 复选框</ZTitle>
    <ZParagraph>
      <ZCode code="ZCheckbox" /> 可单独使用（<ZCode code="v-model:checked" />）或在
      <ZCode code="ZCheckboxGroup" /> 内通过 <ZCode code="value" /> prop 联动。
      Group 支持 <ZCode code="options" /> 快捷配置或直接放子 ZCheckbox。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="单独 / Group 横排 / Group 竖排" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Group / 全选 / 半选</ZTitle>
    <DemoBlock title="CheckboxGroup + indeterminate 全选联动" :source="GroupDemoSource">
      <template #desc>
        <ZCode code="indeterminate" /> 表示半选态(部分选中);配合 computed 实现全选/反选联动。
      </template>
      <GroupDemo />
    </DemoBlock>

    <ZTitle :level="2">ZCheckbox Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="checkboxPropsRows"
    />

    <ZTitle :level="2">ZCheckboxGroup Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="groupPropsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '180px' },
        { key: 'args', label: '参数',  mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',  mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
