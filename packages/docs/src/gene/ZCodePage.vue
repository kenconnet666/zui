<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZCode/BasicDemo.vue'
import BasicDemoSource from './ZCode/BasicDemo.vue?raw'

import LangDemo from './ZCode/LangDemo.vue'
import LangDemoSource from './ZCode/LangDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZCode 代码</ZTitle>
    <ZParagraph>
      代码渲染组件，内置 <ZCode code="shiki" /> 语法高亮（optional peer）。
      支持<strong>三种模式</strong>：行内 <ZCode code="&lt;code&gt;" />、
      块级 fallback <ZCode code="&lt;pre&gt;&lt;code&gt;" />、
      块级 shiki 高亮（需安装 <ZCode code="shiki" />）。
    </ZParagraph>

    <ZTitle :level="2">三种模式演示</ZTitle>
    <DemoBlock title="inline / block fallback / block highlighted" :source="BasicDemoSource">
      <template #desc>
        行内模式（默认）：<ZCode code="inline=true" />，不需要 lang。
        块级高亮：<ZCode code="inline=false" /> + <ZCode code="lang" />（需 <ZCode code="pnpm add shiki" />）。
        未装 shiki 时自动 fallback 为纯文本 pre，控制台 warn 一次。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">多语言高亮</ZTitle>
    <DemoBlock title="ts / json / bash / css" :source="LangDemoSource">
      <template #desc>
        <ZCode code="lang" /> 接受任意 shiki 支持的语言标识。
        装了 shiki 时按语言渲染配色，未装 shiki 时统一 fallback 为纯文本 pre。
      </template>
      <LangDemo />
    </DemoBlock>

    <ZTitle :level="2">安装 shiki</ZTitle>
    <ZCode :inline="false" lang="bash" code="pnpm add shiki" />
    <ZParagraph>
      <ZCode code="shiki" /> 是 optional peer dependency，未安装时 ZCode 优雅降级为纯文本展示，
      不影响其他组件功能。
    </ZParagraph>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '160px' },
        { key: 'type',    label: '类型',   mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '140px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'code',        type: 'string',                         default: '—',             desc: '代码文本（高亮模式必传，slot 内容无法可靠提取）。' },
        { name: 'inline',      type: 'boolean',                        default: 'true',          desc: 'false = 块级（pre）；true = 行内（code）。' },
        { name: 'lang',        type: 'string',                         default: '—',             desc: 'shiki 语言标识：ts / js / vue / json / bash / css / text 等。' },
        { name: 'themes',      type: '{ light: string; dark: string }', default: 'light-plus / tokyo-night', desc: 'shiki 双主题对。' },
        { name: 'colorScheme', type: `'auto' | 'light' | 'dark'`,      default: `'auto'`,        desc: '颜色模式，auto 跟随 OS prefers-color-scheme。' },
        { name: 'color',       type: '(c: ColorCarrier) => void',      default: '—',             desc: '文字色（fallback / 未高亮时生效；高亮模式由 shiki 控制）。' },
        { name: 'css',         type: '(s: Chain) => void',             default: '—',             desc: '根元素 CSS 兜底。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: 'fallback 模式（未启用 shiki 高亮）下的代码内容。高亮模式以 code prop 为准，slot 不参与。' },
      ]"
    />
  </section>
</template>
