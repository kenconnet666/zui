<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZForm/BasicDemo.vue'
import BasicDemoSource from './ZForm/BasicDemo.vue?raw'

const formPropsRows = [
  {
    name: 'model',
    type: 'Record<string, unknown>',
    default: '—',
    desc: '表单数据对象（reactive，必传）。',
  },
  {
    name: 'rules',
    type: 'Rules',
    default: '—',
    desc: 'async-validator 规则字典（key 为字段名）。',
  },
  { name: 'labelPlacement', type: "'top' | 'left'", default: "'left'", desc: 'label 位置。' },
  {
    name: 'validateTrigger',
    type: "'change'|'blur'|'submit'",
    default: "'change'",
    desc: '全局校验触发时机（ZFormItem 可覆盖）。',
  },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '整表禁用。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const formExposeRows = [
  {
    name: 'validate',
    type: '() => Promise<void>',
    desc: '校验所有字段，reject 包含 errors 和 fields。',
  },
  { name: 'reset', type: '() => void', desc: '重置错误状态（不重置 model 数据）。' },
]

const itemPropsRows = [
  { name: 'prop', type: 'string', default: '—', desc: '字段名，对应 ZForm.model[prop]（必传）。' },
  { name: 'label', type: 'string', default: '—', desc: '字段显示名。' },
  {
    name: 'rule',
    type: 'RuleItem | RuleItem[]',
    default: '—',
    desc: '单字段规则（优先于 ZForm.rules[prop]）。',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    desc: '显示必填标记 *（独立于校验规则）。',
  },
  {
    name: 'validateTrigger',
    type: "'change'|'blur'|'submit'",
    default: '—',
    desc: '覆盖 Form 级触发时机。',
  },
  { name: 'labelWidth', type: 'string | number', default: '—', desc: 'left 模式下 label 宽度。' },
]

const itemSlotsRows = [
  { name: 'default', desc: '表单控件区域。' },
  { name: 'label', desc: '自定义 label 内容。' },
  { name: 'error', desc: '自定义错误信息展示。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZForm / ZFormItem 表单</ZTitle>
    <ZParagraph>
      基于 <ZCode code="async-validator" /> 的表单容器，<ZCode code="ZFormItem" /> 通过 inject
      联动父 Form 的数据和规则。<ZCode code="labelPlacement" /> 控制标签位置，<ZCode
        code="validate()"
      />
      expose 方法 触发全字段校验。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="必填校验 / 格式校验 / 提交重置" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">ZForm Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="formPropsRows"
    />

    <ZTitle :level="2">ZForm Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="formExposeRows"
    />

    <ZTitle :level="2">ZFormItem Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemPropsRows"
    />

    <ZTitle :level="2">ZFormItem Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="itemSlotsRows"
    />
  </section>
</template>
