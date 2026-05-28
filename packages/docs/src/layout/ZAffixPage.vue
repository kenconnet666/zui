<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZAffix/BasicDemo.vue'
import BasicDemoSource from './ZAffix/BasicDemo.vue?raw'
import OffsetDemo from './ZAffix/OffsetDemo.vue'
import OffsetDemoSource from './ZAffix/OffsetDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZAffix 固钉</ZTitle>
    <ZParagraph>
      滚动触发吸附固定。当容器滚动到指定 <ZCode code="offsetTop" /> 偏移时，
      内容切换为 <ZCode code="position: fixed" />，同时在原位插入等高占位元素，
      防止布局跳动。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="在可滚动容器内吸顶" :source="BasicDemoSource">
      <template #desc>
        向下滚动演示容器后工具栏吸附顶部。
        <ZCode code="target" /> prop 传入返回滚动容器的函数（默认监听 <ZCode code="window" />）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">带间距吸顶</ZTitle>
    <DemoBlock title="offsetTop = 12：吸附时保留顶部间距" :source="OffsetDemoSource">
      <template #desc>
        <ZCode code="offsetTop" /> 大于 0 时,吸附状态与容器顶部保留对应像素间距。
      </template>
      <OffsetDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'offsetTop', type: 'number',                           default: '0',  desc: '距顶距离（px）。0 = 到达顶部时立即吸附。' },
        { name: 'target',    type: '() => Element | Window',           default: 'window', desc: '监听的滚动容器，不传则监听 window。传入返回容器元素的函数。' },
        { name: 'css',       type: '(s: Chain) => void',               default: '—',  desc: '根元素 CSS 兜底。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '需要吸附固定的内容。滚动达到 offsetTop 时切换为 fixed，离开时回到原位。' },
      ]"
    />
  </section>
</template>
