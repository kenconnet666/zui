<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZMarquee/BasicDemo.vue'
import BasicDemoSource from './ZMarquee/BasicDemo.vue?raw'
import DirectionDemo from './ZMarquee/DirectionDemo.vue'
import DirectionDemoSource from './ZMarquee/DirectionDemo.vue?raw'

const propsRows = [
  { name: 'duration', type: 'number', default: '10000', desc: '单次滚动时长（ms），值越小越快。' },
  { name: 'direction', type: "'left' | 'right'", default: "'left'", desc: '滚动方向。' },
  { name: 'pauseOnHover', type: 'boolean', default: 'true', desc: '鼠标悬停时暂停滚动。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '容器根元素 CSS 兜底。' },
]

const slotsRows = [
  {
    name: 'default',
    desc: '滚动内容。内部会渲染两份实现无缝循环，宽度应超过容器宽度才有滚动效果。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZMarquee 跑马灯</ZTitle>
    <ZParagraph>
      无缝循环滚动容器，内部双份渲染 slot 内容实现无缝衔接。
      支持左右方向、自定义速度，默认鼠标悬停暂停。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="左滚 / 右滚 / 自定义速度" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="duration" /> 单位为毫秒（默认 10000ms）；
        <ZCode code="pauseOnHover" /> 控制悬停暂停（默认 <ZCode code="true" />）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">方向 / 速度 / 悬停暂停</ZTitle>
    <DemoBlock title="direction / duration / pauseOnHover" :source="DirectionDemoSource">
      <template #desc>
        <ZCode code="direction" /> 控制滚动方向;<ZCode code="duration" /> 越小越快;
        <ZCode code="pauseOnHover" /> 悬停暂停。
      </template>
      <DirectionDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
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
