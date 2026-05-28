<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZGradientText/BasicDemo.vue'
import BasicDemoSource from './ZGradientText/BasicDemo.vue?raw'
import CustomDemo from './ZGradientText/CustomDemo.vue'
import CustomDemoSource from './ZGradientText/CustomDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZGradientText 渐变文字</ZTitle>
    <ZParagraph>
      渐变文字组件，基于 <ZCode code="-webkit-background-clip: text" /> + <ZCode code="-webkit-text-fill-color: transparent" /> 实现。
      <ZCode code="gradient" /> 接受任意 CSS gradient 字符串；默认使用主题的
      <ZCode code="_primary" /> → <ZCode code="_info" /> 135° 线性渐变。
    </ZParagraph>

    <ZTitle :level="2">渐变演示</ZTitle>
    <DemoBlock title="默认渐变 + 自定义 gradient 字符串" :source="BasicDemoSource">
      <template #desc>
        不传 <ZCode code="gradient" /> 时，颜色跟随当前主题（亮/暗切换时自动更新）。
        传了则使用固定 CSS 值，不随主题变化。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义渐变</ZTitle>
    <DemoBlock title="gradient 传入任意 CSS 渐变" :source="CustomDemoSource">
      <template #desc>
        <ZCode code="gradient" /> 接受任意 CSS <ZCode code="linear-gradient" /> / <ZCode code="radial-gradient" /> 字符串。
      </template>
      <CustomDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '200px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'gradient', type: 'string',              default: 'linear-gradient(135deg, _primary, _info)', desc: 'CSS gradient 字符串，如 linear-gradient(90deg, #f97316, #ec4899)。' },
        { name: 'tag',      type: 'string',              default: `'span'`,                                   desc: '根元素 tag，如 h1 / h2 加语义。' },
        { name: 'css',      type: '(s: Chain) => void',  default: '—',                                       desc: '兜底 CSS，可加 fontSize / fontWeight 等。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '渐变文字内容。' },
      ]"
    />

    <ZTitle :level="2">注意事项</ZTitle>
    <ZParagraph>
      渐变文字依赖 <ZCode code="-webkit-background-clip" />，各浏览器支持良好但为 WebKit 前缀属性。
      文字子节点中若有 <ZCode code="color" /> 设置，会被 <ZCode code="-webkit-text-fill-color: transparent" /> 覆盖。
      需要文字内部局部颜色，使用 <ZCode code="css" /> 兜底或改用 SVG 方案。
    </ZParagraph>
  </section>
</template>
