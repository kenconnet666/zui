<script setup lang="ts">
/**
 * ZSkeleton 文档页。
 */
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZSkeleton/BasicDemo.vue'
import BasicDemoSource from './ZSkeleton/BasicDemo.vue?raw'

import VariantsDemo from './ZSkeleton/VariantsDemo.vue'
import VariantsDemoSource from './ZSkeleton/VariantsDemo.vue?raw'

import ToggleDemo from './ZSkeleton/ToggleDemo.vue'
import ToggleDemoSource from './ZSkeleton/ToggleDemo.vue?raw'

import RowsDemo from './ZSkeleton/RowsDemo.vue'
import RowsDemoSource from './ZSkeleton/RowsDemo.vue?raw'

const propsRows = [
  {
    name: 'loading',
    type: 'boolean',
    default: 'true',
    desc: '是否显示骨架状态。false 时渲染 default slot 内容。',
  },
  { name: 'rows', type: 'number', default: '3', desc: '文本行数。最后一行宽度为 60%。' },
  { name: 'avatar', type: 'boolean', default: 'false', desc: '是否显示左侧头像圆形骨架（40px）。' },
  { name: 'title', type: 'boolean', default: 'false', desc: '是否显示顶部标题条骨架（宽 40%）。' },
  { name: 'animated', type: 'boolean', default: 'true', desc: '是否开启 opacity 脉冲闪烁动画。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [{ name: 'default', desc: '加载完成后显示的真实内容（loading=false 时渲染）。' }]
</script>

<template>
  <section>
    <ZTitle :level="1">ZSkeleton 骨架屏</ZTitle>
    <ZParagraph>
      数据加载时的占位骨架，支持文本行数（<ZCode code="rows" />）、头像圆（<ZCode code="avatar" />）、
      标题条（<ZCode code="title" />）三种配置自由组合，自带 opacity 脉冲闪烁动画。
      <ZCode code=":loading='false'" /> 时自动切换渲染 default slot 的真实内容。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 头像+标题 / 无动画 / 切换模式" :source="BasicDemoSource">
      <template #desc>
        覆盖 4 种常见使用场景：纯文本行、头像+标题、关闭动画、受控 loading 切换。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">组合形态</ZTitle>
    <DemoBlock title="纯文本 / 加标题 / 加头像 / 头像+标题" :source="VariantsDemoSource">
      <template #desc>
        <ZCode code="avatar" /> 和 <ZCode code="title" /> 可独立或组合开启，灵活匹配卡片、列表、详情页等布局。
      </template>
      <VariantsDemo />
    </DemoBlock>

    <ZTitle :level="2">loading 切换</ZTitle>
    <DemoBlock title="点击按钮切换骨架 / 真实内容" :source="ToggleDemoSource">
      <template #desc>
        <ZCode code=":loading='true'" /> 显示骨架，<ZCode code=":loading='false'" /> 渲染 default slot 真实内容。
        常见用法：数据请求完成后将 loading 置为 false。
      </template>
      <ToggleDemo />
    </DemoBlock>

    <ZTitle :level="2">行数与动画</ZTitle>
    <DemoBlock title=":rows / :animated 控制" :source="RowsDemoSource">
      <template #desc>
        <ZCode code=":rows='5'" /> 增加文本行数；<ZCode code=":animated='false'" /> 关闭脉冲动画，
        适合需要静态占位不影响视觉焦点的场景。
      </template>
      <RowsDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
