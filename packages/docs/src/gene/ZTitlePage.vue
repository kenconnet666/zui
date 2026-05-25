<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import LevelDemo from './ZTitle/LevelDemo.vue'
import LevelDemoSource from './ZTitle/LevelDemo.vue?raw'

import CustomDemo from './ZTitle/CustomDemo.vue'
import CustomDemoSource from './ZTitle/CustomDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZTitle 标题</ZTitle>
    <ZParagraph>
      语义化标题元素（h1–h6），内置 6 级 iem 比例字号 + 字重映射，
      继承 ZText 的 6 维度 carrier factory + 5 状态布尔。
      默认 tag = <ZCode code="h{level}" />，传 <ZCode code="tag" /> 可改为中性元素。
    </ZParagraph>

    <ZTitle :level="2">级别演示</ZTitle>
    <DemoBlock title="level 1–6 默认字号与字重" :source="LevelDemoSource">
      <template #desc>
        h1–h2 字重 700（bold），h3–h6 字重 600（semibold）；
        行高统一 1.25（紧凑，适合标题）；margin 重置为 0。
      </template>
      <LevelDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义覆盖</ZTitle>
    <DemoBlock title="size / color / ellipsis / tag 覆盖" :source="CustomDemoSource">
      <template #desc>
        <ZCode code="size" /> 覆盖 level 默认 fontSize；<ZCode code="color" /> / <ZCode code="tag" />
        等与 ZText 完全一致。
      </template>
      <CustomDemo />
    </DemoBlock>

    <ZTitle :level="2">level → 默认字号映射</ZTitle>
    <ApiTable
      :columns="[
        { key: 'level', label: 'level', mono: true, width: '80px' },
        { key: 'tag',   label: '默认 tag', mono: true, width: '100px' },
        { key: 'fs',    label: 'fontSize', mono: true, width: '120px' },
        { key: 'fw',    label: 'fontWeight', mono: true, width: '120px' },
        { key: 'px',    label: '@ 16px iem', mono: true, width: '100px' },
      ]"
      :rows="[
        { level: '1', tag: 'h1', fs: 'iem(2)',     fw: '700', px: '32px' },
        { level: '2', tag: 'h2', fs: 'iem(1.75)',  fw: '700', px: '28px' },
        { level: '3', tag: 'h3', fs: 'iem(1.5)',   fw: '600', px: '24px' },
        { level: '4', tag: 'h4', fs: 'iem(1.25)',  fw: '600', px: '20px' },
        { level: '5', tag: 'h5', fs: 'iem(1.125)', fw: '600', px: '18px' },
        { level: '6', tag: 'h6', fs: 'iem(1)',     fw: '600', px: '16px' },
      ]"
    />

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'level',  type: '1 | 2 | 3 | 4 | 5 | 6', default: '1',       desc: '标题级别，决定默认 tag / fontSize / fontWeight。' },
        { name: 'size',   type: 'number',                  default: '—',       desc: 'iem 倍数，传了覆盖 level 默认 fontSize。' },
        { name: 'tag',    type: 'string',                  default: 'h{level}',desc: '根元素 tag，改为 div 等可避免影响文档 outline。' },
        { name: '...ZText', type: '(继承全部 ZText props)', default: '—',      desc: 'weight / color / depth / leading / tracking / italic / underline / ellipsis / css。' },
      ]"
    />
  </section>
</template>
