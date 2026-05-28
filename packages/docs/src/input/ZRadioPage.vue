<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZRadio/BasicDemo.vue'
import BasicDemoSource from './ZRadio/BasicDemo.vue?raw'
import ButtonStyleDemo from './ZRadio/ButtonStyleDemo.vue'
import ButtonStyleDemoSource from './ZRadio/ButtonStyleDemo.vue?raw'

const radioPropsRows = [
  { name: 'value',    type: 'string|number|boolean', default: '—',    desc: '该选项的值（必传，Group 用于匹配）。' },
  { name: 'label',    type: 'string',                default: '—',    desc: '文字标签。' },
  { name: 'disabled', type: 'boolean',               default: 'false', desc: '禁用。' },
  { name: 'size',     type: 'number',                default: '1',    desc: '外圈尺寸 iem 倍数。' },
  { name: 'css',      type: '(s: Chain) => void',    default: '—',    desc: '根元素 CSS 兜底。' },
]

const groupPropsRows = [
  { name: 'value',       type: 'string|number|boolean|null', default: 'null',  desc: '选中值（v-model:value）。' },
  { name: 'disabled',    type: 'boolean',                    default: 'false', desc: '统一禁用所有子项。' },
  { name: 'buttonStyle', type: 'boolean',                    default: 'false', desc: '子 ZRadio 渲染为按钮组形态。' },
  { name: 'options',     type: 'ZRadioOption[]',             default: '—',     desc: '快捷选项配置。' },
  { name: 'direction',   type: 'flexDirection factory',      default: '—',     desc: '排列方向（默认横排）。' },
  { name: 'css',         type: '(s: Chain) => void',         default: '—',     desc: '根元素 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string|number|boolean', desc: '（ZRadioGroup）选中值变更。' },
  { name: 'change',       args: 'string|number|boolean', desc: '（ZRadioGroup）选中变更（与 update:value 等价）。' },
]

const slotsRows = [
  { name: 'default', desc: '（ZRadio）自定义标签内容，覆盖 label prop。' },
  { name: 'default', desc: '（ZRadioGroup）放置子 ZRadio（未传 options 时生效）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZRadio / ZRadioGroup 单选框</ZTitle>
    <ZParagraph>
      <ZCode code="ZRadio" /> 需嵌套在 <ZCode code="ZRadioGroup" /> 内使用，Group 通过 provide/inject 联动。
      <ZCode code="buttonStyle" /> 渲染为按钮组形态，<ZCode code="options" /> 支持快捷配置。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="圆点选组 / 按钮组 / 单独 ZRadio" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">按钮组 / 纵向排列</ZTitle>
    <DemoBlock title="buttonStyle / direction / options" :source="ButtonStyleDemoSource">
      <template #desc>
        <ZCode code="buttonStyle" /> 切换为按钮组外观;<ZCode code="direction" /> carrier 控制排列方向;
        <ZCode code="options" /> 配置式生成选项。
      </template>
      <ButtonStyleDemo />
    </DemoBlock>

    <ZTitle :level="2">ZRadio Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="radioPropsRows"
    />

    <ZTitle :level="2">ZRadioGroup Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="groupPropsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
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
