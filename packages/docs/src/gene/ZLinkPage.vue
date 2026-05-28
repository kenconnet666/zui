<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZLink/BasicDemo.vue'
import BasicDemoSource from './ZLink/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZLink 链接</ZTitle>
    <ZParagraph>
      链接组件，在 ZText 基础上增加 <ZCode code="href" /> / <ZCode code="target" /> /
      <ZCode code="rel" /> / <ZCode code="disabled" /> 四个链接专属字段。
      默认颜色 <ZCode code="_primary" />，默认 hover 时显示下划线。
      <ZCode code="target=&quot;_blank&quot;" /> 自动补 <ZCode code="rel=&quot;noopener noreferrer&quot;" />，
      <ZCode code="disabled" /> 走 <ZCode code="aria-disabled" /> + 屏蔽 href。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="href / target / color / disabled" :source="BasicDemoSource">
      <template #desc>
        不传 <ZCode code="href" /> 退化为普通行内文本（适合 SPA router-link 场景，用 <ZCode code="tag" /> 换成 RouterLink）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '160px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'href',             type: 'string',  default: '—',     desc: '跳转地址，disabled=true 时自动屏蔽。' },
        { name: 'target',           type: 'string',  default: '—',     desc: `'_blank' 自动补 rel=noopener noreferrer。` },
        { name: 'rel',              type: 'string',  default: '—',     desc: '显式传则接管自动补的 rel。' },
        { name: 'disabled',         type: 'boolean', default: 'false', desc: '禁用：屏蔽 href + opacity._dim + pointer-events:none + aria-disabled。' },
        { name: 'color',            type: '(c: ColorCarrier) => void', default: '_primary', desc: '颜色 factory，覆盖默认 _primary。' },
        { name: 'underlineOnHover', type: 'boolean', default: 'true',  desc: 'hover 时下划线（链接惯例），与 ZText 默认值不同。' },
        { name: 'tag',              type: 'string',  default: `'a'`,   desc: '根元素 tag，SPA 场景可传 RouterLink 组件。' },
        { name: '...ZText',         type: '(继承全部 ZText props)', default: '—', desc: 'size / weight / depth / leading / tracking / italic / underline / strikethrough / mono / ellipsis / css。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '链接文本内容。' },
      ]"
    />

    <ZTitle :level="2">SPA 路由链接</ZTitle>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<ZLink :tag=&quot;RouterLink&quot; to=&quot;/about&quot;>关于我们</ZLink>`"
    />
  </section>
</template>
