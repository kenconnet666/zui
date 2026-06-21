<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZSelect/BasicDemo.vue'
import BasicDemoSource from './ZSelect/BasicDemo.vue?raw'
import FilterableDemo from './ZSelect/FilterableDemo.vue'
import FilterableDemoSource from './ZSelect/FilterableDemo.vue?raw'
import MultipleDemo from './ZSelect/MultipleDemo.vue'
import MultipleDemoSource from './ZSelect/MultipleDemo.vue?raw'
import DisabledOptionDemo from './ZSelect/DisabledOptionDemo.vue'
import DisabledOptionDemoSource from './ZSelect/DisabledOptionDemo.vue?raw'
import RemoteDemo from './ZSelect/RemoteDemo.vue'
import RemoteDemoSource from './ZSelect/RemoteDemo.vue?raw'
import ClearableDemo from './ZSelect/ClearableDemo.vue'
import ClearableDemoSource from './ZSelect/ClearableDemo.vue?raw'
import SizeDemo from './ZSelect/SizeDemo.vue'
import SizeDemoSource from './ZSelect/SizeDemo.vue?raw'
import SxDemo from './ZSelect/SxDemo.vue'
import SxDemoSource from './ZSelect/SxDemo.vue?raw'

const propsRows = [
  {
    name: 'value',
    type: 'ZSelectValue | ZSelectValue[] | null',
    default: '—',
    desc: '选中值（v-model:value）；multiple=true 时传数组。',
  },
  { name: 'options', type: 'ZSelectOption[]', default: '—', desc: '选项列表（必传）。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '未选时占位文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '显示清空按钮（有值时）。' },
  { name: 'filterable', type: 'boolean', default: 'false', desc: '启用搜索过滤。' },
  { name: 'multiple', type: 'boolean', default: 'false', desc: '多选模式。' },
  { name: 'size', type: 'number', default: '1', desc: 'px 倍数（1 单位 = 16px）。默认 1 = 16px 字号，padding/height 等比缩放（默认高度 32px，内边距 6px/12px）。' },
  { name: 'height', type: 'number', default: 'size*2', desc: '触发器高度 px 倍数（1 单位 = 16px）。' },
  { name: 'optionSize', type: 'number', default: '2', desc: '下拉项行高 px 倍数（1 单位 = 16px）。' },
  { name: 'dropdownMaxHeight', type: 'number', default: '15', desc: '下拉框最大高度 px 倍数（1 单位 = 16px）。' },
  { name: 'sxTrigger', type: 'SxObject', default: '—', desc: '触发器元素深度定制（css / class / style / attrs）。' },
  { name: 'sxDropdown', type: 'SxObject', default: '—', desc: '下拉浮层深度定制。' },
  { name: 'sxOption', type: 'SxObject', default: '—', desc: '每个选项行深度定制。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底（与 sxTrigger 等价的快捷方式）。' },
]

const optionRows = [
  { name: 'value', type: 'string | number | boolean', default: '—', desc: '选项值。' },
  { name: 'label', type: 'string', default: '—', desc: '显示文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用此选项。' },
]

const emitsRows = [
  { name: 'update:value', args: 'ZSelectValue | ZSelectValue[] | null', desc: '选中值变更（v-model:value）。' },
  {
    name: 'change',
    args: 'ZSelectValue | ZSelectValue[] | null',
    desc: '值提交：单选与 update:value 同步触发；多选每次 toggle 选项后触发，payload 为当前已选数组；clearable 清空时 payload 为 null（单选）或 []（多选）。',
  },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLDivElement | null>', desc: '根触发器元素引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZSelect 选择器</ZTitle>
    <ZParagraph>
      下拉选择器，支持单选和多选（<ZCode code="multiple" />），可搜索过滤（<ZCode
        code="filterable"
      />）， 可清空（<ZCode code="clearable" />）。基于 floating-ui 定位，渲染到 body 避开父容器
      overflow 截断。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="单选 / 可搜索 / 多选 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">可搜索过滤</ZTitle>
    <DemoBlock title="filterable" :source="FilterableDemoSource">
      <template #desc><ZCode code="filterable" /> 启用后触发器变输入框,实时过滤选项。</template>
      <FilterableDemo />
    </DemoBlock>

    <ZTitle :level="2">多选</ZTitle>
    <DemoBlock title="multiple" :source="MultipleDemoSource">
      <template #desc><ZCode code="multiple" /> 多选模式,value 为数组,选项前显示勾选态。</template>
      <MultipleDemo />
    </DemoBlock>

    <ZTitle :level="2">禁用选项</ZTitle>
    <DemoBlock title="option.disabled" :source="DisabledOptionDemoSource">
      <template #desc>单个选项 <ZCode code="disabled: true" /> 不可选。</template>
      <DisabledOptionDemo />
    </DemoBlock>

    <ZTitle :level="2">远程搜索</ZTitle>
    <DemoBlock title="filterable + 异步加载" :source="RemoteDemoSource">
      <template #desc>结合 <ZCode code="filterable" /> 与异步 options 实现远程搜索。</template>
      <RemoteDemo />
    </DemoBlock>

    <ZTitle :level="2">可清空与 change 事件</ZTitle>
    <DemoBlock title="clearable + change" :source="ClearableDemoSource">
      <template #desc>
        <ZCode code="clearable" /> 有值时显示清空按钮，点击后 value 置 <ZCode code="null" />（单选）
        或 <ZCode code="[]" />（多选）并触发 <ZCode code="change" />。
      </template>
      <ClearableDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸</ZTitle>
    <DemoBlock title="size / optionSize / dropdownMaxHeight" :source="SizeDemoSource">
      <template #desc>
        <ZCode code="size" /> 控制触发器整体缩放；<ZCode code="optionSize" /> 设置选项行高；
        <ZCode code="dropdownMaxHeight" /> 封顶浮层高度（超出滚动）。
      </template>
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">sx 深度定制</ZTitle>
    <DemoBlock title="sxTrigger / sxDropdown / sxOption" :source="SxDemoSource">
      <template #desc>
        <ZCode code="sxTrigger" /> 定制触发器，<ZCode code="sxDropdown" /> 定制浮层，
        <ZCode code="sxOption" /> 定制每行选项。
      </template>
      <SxDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '180px' },
        { key: 'type', label: '类型', mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZSelectOption</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="optionRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '280px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法/属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
