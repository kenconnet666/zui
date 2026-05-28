<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZSpacer/BasicDemo.vue'
import BasicDemoSource from './ZSpacer/BasicDemo.vue?raw'
import BasisDemo from './ZSpacer/BasisDemo.vue'
import BasisDemoSource from './ZSpacer/BasisDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZSpacer 占位推开</ZTitle>
    <ZParagraph>
      flex 容器内的「占位推开」组件，默认 <ZCode code="flex: 1 1 auto" />，
      把同行的兄弟元素推到两侧。等价于手写
      <ZCode code="&lt;div style=&quot;flex: 1&quot; /&gt;" />，但语义化、可主题化。
      <strong>必须放在 flex 容器内</strong>（<ZCode code="ZFlex" /> / <ZCode code="ZSpace" /> / 任何 <ZCode code="display: flex" /> 父级），
      在 grid / block 容器内无效果。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="工具栏 push-apart / grow 比例" :source="BasicDemoSource">
      <template #desc>
        工具栏场景：左侧标题 + <ZCode code="&lt;ZSpacer /&gt;" /> + 右侧操作组，
        ZSpacer 自动填满剩余空间。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">固定起始宽度 (basis)</ZTitle>
    <DemoBlock title="grow=0 + basis：固定占位,两侧自适应" :source="BasisDemoSource">
      <template #desc>
        <ZCode code="basis" /> 设 <ZCode code="flex-basis" />;配合 <ZCode code=":grow='0'" /> 即得固定宽度占位块。
      </template>
      <BasisDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '100px' },
        { key: 'type',    label: '类型',   mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'grow',   type: 'number',                      default: '1',     desc: 'flex-grow，控制占据剩余空间的比例。' },
        { name: 'shrink', type: 'number',                      default: '1',     desc: 'flex-shrink。' },
        { name: 'basis',  type: '(b: flexBasis carrier) => void', default: 'auto', desc: 'flex-basis carrier factory，默认 auto。' },
        { name: 'css',    type: '(s: Chain) => void',          default: '—',     desc: '根元素 CSS 兜底。' },
        { name: 'tag',    type: 'string',                      default: `'div'`, desc: '根元素 tag。' },
      ]"
    />
  </section>
</template>
