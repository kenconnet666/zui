<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZSpace/BasicDemo.vue'
import BasicDemoSource from './ZSpace/BasicDemo.vue?raw'
import AlignDemo from './ZSpace/AlignDemo.vue'
import AlignDemoSource from './ZSpace/AlignDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZSpace 等间距</ZTitle>
    <ZParagraph>
      等间距布局（类 antd Space）。与 <ZCode code="ZFlex" /> 的区别：
      <ZCode code="ZSpace" /> 默认 <ZCode code="align: center" /> + <ZCode code="gap: _small" />，
      专为「行内一组元素自动留固定间距」设计（工具栏按钮组、表单字段组、Tag 列表）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="默认间距 / 自定义 gap / 垂直方向 / wrap" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="size" /> prop 控制间距（gap carrier factory）；
        <ZCode code="direction" /> 切换横/纵排；
        <ZCode code="wrap" /> 控制换行。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">交叉轴对齐</ZTitle>
    <DemoBlock title="align: center（默认） vs flex-start" :source="AlignDemoSource">
      <template #desc>
        子项高度不一致时,<ZCode code="align" /> 决定它们在交叉轴的对齐;默认 <ZCode code="center" />。
      </template>
      <AlignDemo />
    </DemoBlock>

    <ZTitle :level="2">ZSpace vs ZFlex</ZTitle>
    <ApiTable
      :columns="[
        { key: 'feature', label: '特性',   width: '180px' },
        { key: 'space',   label: 'ZSpace', mono: true },
        { key: 'flex',    label: 'ZFlex',  mono: true },
      ]"
      :rows="[
        { feature: 'display',    space: 'flex',     flex: 'flex' },
        { feature: 'gap 默认',   space: '_small',   flex: '无（0）' },
        { feature: 'align 默认', space: 'center',   flex: '浏览器默认 stretch' },
        { feature: '间距 prop',  space: 'size',     flex: 'gap' },
        { feature: '适用场景',   space: '行内元素组、按钮组', flex: '通用布局容器' },
      ]"
    />

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '320px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'direction', type: '(c: flexDirection carrier) => void', default: '—',         desc: '排列方向 carrier factory，默认不写 = row。' },
        { name: 'size',      type: '(g: gap carrier) => void',           default: '_small',    desc: '子元素间距（gap carrier factory），默认 _small。' },
        { name: 'align',     type: '(c: alignItems carrier) => void',    default: 'center',    desc: '交叉轴对齐 carrier factory，默认 center。' },
        { name: 'wrap',      type: '(c: flexWrap carrier) => void',      default: '—',         desc: '换行 carrier factory，默认不写 = nowrap。' },
        { name: 'inline',    type: 'boolean',                             default: 'false',     desc: 'true → display: inline-flex。' },
        { name: 'css',       type: '(s: Chain) => void',                 default: '—',         desc: '根元素 CSS 兜底。' },
        { name: 'tag',       type: 'string',                              default: `'div'`,     desc: '根元素 tag。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '等间距排列的子元素列表。' },
      ]"
    />
  </section>
</template>
