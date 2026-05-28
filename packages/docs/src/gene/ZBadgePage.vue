<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZBadge/BasicDemo.vue'
import BasicDemoSource from './ZBadge/BasicDemo.vue?raw'

import DotDemo from './ZBadge/DotDemo.vue'
import DotDemoSource from './ZBadge/DotDemo.vue?raw'

import MaxDemo from './ZBadge/MaxDemo.vue'
import MaxDemoSource from './ZBadge/MaxDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZBadge 徽标</ZTitle>
    <ZParagraph>
      角标组件，支持<strong>数字 / 字符串 / 红点</strong>三种模式。 有 default slot
      时，徽标绝对定位于子元素右上角；无 slot 时行内显示徽标本体。 默认颜色
      <ZCode code="_danger" />（红色）。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="数字 / dot / offset / inline / showZero" :source="BasicDemoSource">
      <template #desc>
        数字超过 <ZCode code="max" />（默认 99）显示 <ZCode code="N+" />；
        <ZCode code="dot=true" /> 忽略 value 显示小圆点； <ZCode code="showZero=true" /> 让 value=0
        也显示。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">红点模式 (dot)</ZTitle>
    <DemoBlock title="dot=true 忽略 value，显示小圆点" :source="DotDemoSource">
      <template #desc>
        红点常用于「有未读」「在线/忙碌/离线」等状态标识，无具体数量。 无 slot 时退化为 inline
        圆点，可与文字行内组合。
      </template>
      <DotDemo />
    </DemoBlock>

    <ZTitle :level="2">max + showZero</ZTitle>
    <DemoBlock title="数字上限与零值显示" :source="MaxDemoSource">
      <template #desc>
        <ZCode code="value &gt; max" /> 时显示 <ZCode code="${max}+" />；
        <ZCode code="value=0" /> 默认隐藏，<ZCode code="showZero=true" /> 强制显示。
      </template>
      <MaxDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'value',
          type: 'number | string',
          default: '—',
          desc: '徽标显示内容（数字或字符串）。',
        },
        {
          name: 'dot',
          type: 'boolean',
          default: 'false',
          desc: '红点模式，忽略 value，只显示小圆点。',
        },
        { name: 'max', type: 'number', default: '99', desc: '数字超过 max 时显示 max+。' },
        { name: 'showZero', type: 'boolean', default: 'false', desc: 'value=0 时是否显示徽标。' },
        {
          name: 'size',
          type: 'number',
          default: '0.75',
          desc: 'iem 倍数（默认 0.75 ≈ 12px @ 16px）。padding / min-width / height / fontSize 等比缩放。',
        },
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: '_danger',
          desc: '徽标背景色 factory。',
        },
        {
          name: 'offset',
          type: '[number, number]',
          default: '[0, 0]',
          desc: '[x, y] 偏移 px（有 slot 时生效）。',
        },
        {
          name: 'css',
          type: '(s: Chain) => void',
          default: '—',
          desc: '根元素（wrapper）CSS 兜底。',
        },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'default',
          desc: '被徽标修饰的子元素（如头像、图标）。传入时徽标绝对定位于右上角；不传时仅 inline 渲染徽标本体。',
        },
      ]"
    />
  </section>
</template>
