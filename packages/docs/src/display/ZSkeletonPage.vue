<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZSkeleton/BasicDemo.vue'
import BasicDemoSource from './ZSkeleton/BasicDemo.vue?raw'

const propsRows = [
  { name: 'loading',  type: 'boolean', default: 'true',  desc: '是否显示骨架状态。false 时渲染 default slot 内容。' },
  { name: 'rows',     type: 'number',  default: '3',     desc: '文本行数。' },
  { name: 'avatar',   type: 'boolean', default: 'false', desc: '是否显示左侧头像圆形骨架。' },
  { name: 'title',    type: 'boolean', default: 'false', desc: '是否显示顶部标题条骨架（宽 40%）。' },
  { name: 'animated', type: 'boolean', default: 'true',  desc: '是否开启闪烁动画。' },
  { name: 'css',      type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default', desc: '加载完成后显示的真实内容（loading=false 时渲染）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZSkeleton 骨架屏</ZTitle>
    <ZParagraph>
      数据加载时的占位骨架，支持文本行数、头像圆、标题条三种配置组合，
      自带闪烁动画。<ZCode code=":loading='false'" /> 时自动切换渲染 default slot 的真实内容。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 头像+标题 / 无动画 / 切换模式" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
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
