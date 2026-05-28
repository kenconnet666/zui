<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZQRCode/BasicDemo.vue'
import BasicDemoSource from './ZQRCode/BasicDemo.vue?raw'
import CustomDemo from './ZQRCode/CustomDemo.vue'
import CustomDemoSource from './ZQRCode/CustomDemo.vue?raw'

const propsRows = [
  { name: 'value', type: 'string', default: '—（必传）', desc: '二维码内容（URL / 文本等）。' },
  {
    name: 'pixelSize',
    type: 'number',
    default: '160',
    desc: '图片尺寸（px）。使用像素单位保证二维码清晰度。',
  },
  { name: 'color', type: 'string', default: "'#000000'", desc: '前景色（CSS 颜色字符串）。' },
  { name: 'bgColor', type: 'string', default: "'#ffffff'", desc: '背景色（CSS 颜色字符串）。' },
  { name: 'margin', type: 'number', default: '4', desc: '二维码内边距（px）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZQRCode 二维码</ZTitle>
    <ZParagraph>
      基于 <ZCode code="@vueuse/integrations/useQRCode" /> 生成二维码图片。 使用
      <ZCode code="pixelSize" />（像素单位）而非 iem 倍数，保证二维码栅格清晰度，
      支持前景色、背景色和边距自定义。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="默认 / 自定义尺寸 / 颜色 / 无边距" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸 / 颜色</ZTitle>
    <DemoBlock title="pixelSize / color / bgColor / margin" :source="CustomDemoSource">
      <template #desc>
        <ZCode code="pixelSize" /> 是物理像素边长;<ZCode code="color" /> /
        <ZCode code="bgColor" /> 自定义前景背景。
      </template>
      <CustomDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '140px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />
  </section>
</template>
