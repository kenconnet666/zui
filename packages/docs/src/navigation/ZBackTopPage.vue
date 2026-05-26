<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZBackTop/BasicDemo.vue'
import BasicDemoSource from './ZBackTop/BasicDemo.vue?raw'

const propsRows = [
  { name: 'visibilityHeight', type: 'number',                 default: '400',    desc: '触发显示所需的滚动距离（px）。' },
  { name: 'target',           type: '() => Element | Window', default: 'window', desc: '滚动容器，不传则监听 window。' },
  { name: 'size',             type: 'number',                  default: '2.5',    desc: '按钮大小（iem 倍数，2.5 = 40px）。' },
  { name: 'right',            type: '(c: Chain[right]) => void', default: 'iem(1.5)', desc: '距右边缘距离 factory。' },
  { name: 'bottom',           type: '(c: Chain[bottom]) => void', default: 'iem(3)',  desc: '距底部距离 factory。' },
  { name: 'css',              type: '(s: Chain) => void',      default: '—',      desc: '根元素 CSS 兜底。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZBackTop 回到顶部</ZTitle>
    <ZParagraph>
      回到顶部按钮，滚动超过 <ZCode code="visibilityHeight" />（默认 400px）后出现，
      点击平滑滚回顶部。默认监听 <ZCode code="window" />，通过 <ZCode code="target" /> 可指定局部滚动容器。
      <ZCode code="right" /> / <ZCode code="bottom" /> 接受 factory 函数，精确控制定位距离。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="局部容器滚动回到顶部" :source="BasicDemoSource">
      <template #desc>
        演示中绑定局部滚动容器；实际项目通常不传 <ZCode code="target" />，监听默认的 <ZCode code="window" />。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '180px' },
        { key: 'type',    label: '类型',   mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />
  </section>
</template>
