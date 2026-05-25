<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZParagraph/BasicDemo.vue'
import BasicDemoSource from './ZParagraph/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZParagraph 段落</ZTitle>
    <ZParagraph>
      块级段落元素，在 ZText 基础上增加：
      <strong>段间距</strong>（<ZCode code="margin-bottom: spacing._middle" />，Provider iem 联动）、
      <strong>舒适行高</strong>（<ZCode code="lineHeight._normal = 1.5" />）和
      <strong>块级显示</strong>。默认 tag = <ZCode code="p" />，支持 ZText 全部 6 维度 + 5 状态。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="段间距自动注入" :source="BasicDemoSource">
      <template #desc>
        连续 <ZCode code="ZParagraph" /> 之间段间距由 <ZCode code="spacing._middle" /> token 控制，
        无需手动设 margin。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">与 ZText 的差异</ZTitle>
    <ApiTable
      :columns="[
        { key: 'item',  label: '维度',    mono: false, width: '180px' },
        { key: 'ztext', label: 'ZText',   mono: true,  width: '220px' },
        { key: 'zpara', label: 'ZParagraph', mono: true, width: '220px' },
      ]"
      :rows="[
        { item: 'display',     ztext: 'inline（默认）', zpara: 'block' },
        { item: 'tag',         ztext: `'span'`,         zpara: `'p'` },
        { item: 'margin',      ztext: '—（继承）',       zpara: '0 + marginBottom._middle' },
        { item: 'line-height', ztext: '—（继承）',       zpara: '_normal (1.5)' },
      ]"
    />

    <ZTitle :level="2">Props</ZTitle>
    <ZParagraph>
      继承 ZText 全部 props（size / weight / color / depth / leading / tracking /
      italic / underline / underlineOnHover / strikethrough / mono / ellipsis / css），
      新增 <ZCode code="tag" /> 默认值为 <ZCode code="'p'" />。
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'tag',      type: 'string', default: `'p'`,   desc: '根元素 tag，如 div / section 等语义元素。' },
        { name: 'css',      type: '(s: Chain) => void', default: '—', desc: '兜底 CSS，如覆盖 marginBottom 自定义间距。' },
        { name: '...ZText', type: '(继承全部 ZText props)', default: '—', desc: 'size / weight / color / 等。' },
      ]"
    />
  </section>
</template>
