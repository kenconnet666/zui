<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZGrid/BasicDemo.vue'
import BasicDemoSource from './ZGrid/BasicDemo.vue?raw'
import RowsDemo from './ZGrid/RowsDemo.vue'
import RowsDemoSource from './ZGrid/RowsDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZGrid CSS 网格</ZTitle>
    <ZParagraph>
      CSS Grid 布局容器。<ZCode code="cols" /> / <ZCode code="rows" /> 支持三种形式： 数字（<ZCode
        code=":cols='3'"
      />
      → <ZCode code="repeat(3, minmax(0, 1fr))" />）、 字符串（直接作
      grid-template）、响应式对象（按断点自动注入 <ZCode code="@media" />）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="固定列数 / 自定义模板 / 响应式列数" :source="BasicDemoSource">
      <template #desc>
        响应式对象的 key 对应 schema breakpoint（<ZCode code="tiny/small/middle/large/huge" />），
        内部用 <ZCode code="s._media('_middle', ...)" /> 自动展开。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">显式行高</ZTitle>
    <DemoBlock title="rows + alignItems：固定行高网格" :source="RowsDemoSource">
      <template #desc>
        <ZCode code="rows" /> 与 <ZCode code="cols" /> 同形,作用于
        <ZCode code="grid-template-rows" />; <ZCode code="alignItems" /> 控制单元格内对齐。
      </template>
      <RowsDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '360px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'cols',
          type: 'number | string | Partial<Record<breakpoint, number|string>>',
          default: '—',
          desc: '列定义。数字 → repeat(N, 1fr)；字符串 → 直接作 grid-template-columns；对象 → 响应式断点（tiny/small/middle/large/huge）。',
        },
        {
          name: 'rows',
          type: '同 cols',
          default: '—',
          desc: '行定义。同 cols，作用于 grid-template-rows。默认不设（自动行）。',
        },
        {
          name: 'gap',
          type: '(g: gap carrier) => void',
          default: '—',
          desc: 'gap carrier factory。',
        },
        {
          name: 'justifyItems',
          type: '(c: justifyItems carrier) => void',
          default: '—',
          desc: 'justify-items carrier factory。',
        },
        {
          name: 'alignItems',
          type: '(c: alignItems carrier) => void',
          default: '—',
          desc: 'align-items carrier factory。',
        },
        {
          name: 'inline',
          type: 'boolean',
          default: 'false',
          desc: 'true → display: inline-grid。',
        },
        { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
        { name: 'tag', type: 'string', default: `'div'`, desc: '根元素 tag。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[{ name: 'default', desc: 'grid 容器内的子元素，按 cols / rows 自动布局。' }]"
    />
  </section>
</template>
