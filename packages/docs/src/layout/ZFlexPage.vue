<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZFlex/BasicDemo.vue'
import BasicDemoSource from './ZFlex/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZFlex 弹性布局</ZTitle>
    <ZParagraph>
      Flexbox 布局容器。所有方向/对齐/间距 prop 均为 chain carrier factory，
      与 <ZCode code="icss" /> 链式 API 完全一致，不引入额外字符串枚举。
      默认行为对齐浏览器原生（row / nowrap / flex-start / stretch）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="row wrap / space-between / column / inline-flex" :source="BasicDemoSource">
      <template #desc>
        所有方向/对齐/间距 prop 接受 carrier factory，例：
        <ZCode code=":justify='j => j.spaceBetween'" />。
        <ZCode code="inline=true" /> 切换为 <ZCode code="display: inline-flex" />。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '320px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'direction', type: '(c: flexDirection carrier) => void', default: '—',     desc: 'flex-direction carrier factory。不传 = 浏览器默认 row。' },
        { name: 'wrap',      type: '(c: flexWrap carrier) => void',      default: '—',     desc: 'flex-wrap carrier factory。不传 = 浏览器默认 nowrap。' },
        { name: 'justify',   type: '(c: justifyContent carrier) => void', default: '—',   desc: 'justify-content carrier factory。' },
        { name: 'align',     type: '(c: alignItems carrier) => void',    default: '—',     desc: 'align-items carrier factory。' },
        { name: 'gap',       type: '(g: gap carrier) => void',           default: '—',     desc: 'gap carrier factory。例：(g) => g._middle / (g) => g.iem(0.5)。' },
        { name: 'inline',    type: 'boolean',                             default: 'false', desc: 'true → display: inline-flex。' },
        { name: 'css',       type: '(s: Chain) => void',                 default: '—',     desc: '根元素 CSS 兜底。' },
        { name: 'tag',       type: 'string',                              default: `'div'`, desc: '根元素 tag。' },
      ]"
    />
  </section>
</template>
