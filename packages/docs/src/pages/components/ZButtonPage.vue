<script setup lang="ts">
/**
 * ZButton 文档页 —— DemoBlock 范式首个落地。
 *
 * **每个 demo 双重身份**:
 * - `XxxDemo` —— 运行组件,进 `<DemoBlock>` 的 default slot
 * - `XxxDemoSource` —— vite `?raw` 字符串,喂给 `:source`
 *
 * 一个 `.vue` 文件同步源码 + 运行时,零漂移。
 */
import { ZParagraph, ZTitle } from '@kenconnet666/zui-vue'
import DemoBlock from '../../shared/DemoBlock.vue'

import VariantsDemo from './demos/ZButton/VariantsDemo.vue'
import VariantsDemoSource from './demos/ZButton/VariantsDemo.vue?raw'

import ColorDemo from './demos/ZButton/ColorDemo.vue'
import ColorDemoSource from './demos/ZButton/ColorDemo.vue?raw'

import SizeDemo from './demos/ZButton/SizeDemo.vue'
import SizeDemoSource from './demos/ZButton/SizeDemo.vue?raw'

import StateDemo from './demos/ZButton/StateDemo.vue'
import StateDemoSource from './demos/ZButton/StateDemo.vue?raw'

import IconDemo from './demos/ZButton/IconDemo.vue'
import IconDemoSource from './demos/ZButton/IconDemo.vue?raw'

import CssDemo from './demos/ZButton/CssDemo.vue'
import CssDemoSource from './demos/ZButton/CssDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZButton 按钮</ZTitle>
    <ZParagraph>
      Material 风按钮,<strong>5 种 variant</strong> + <strong>chain factory color</strong>
      + <strong>iem 等比缩放 size</strong>。启用 ripple 波纹效果, hover / active /
      focus-visible 三态自动接入 Material state layer。
    </ZParagraph>

    <ZTitle :level="2">变体 (variant)</ZTitle>
    <DemoBlock title="5 种 variant" :source="VariantsDemoSource">
      <template #desc>
        <code>filled</code> 默认 / <code>outlined</code> 描边 / <code>text</code> 文字 /
        <code>ghost</code> 半透明 / <code>link</code> 链接。
      </template>
      <VariantsDemo />
    </DemoBlock>

    <ZTitle :level="2">主色 (color factory)</ZTitle>
    <DemoBlock title="color factory + modifier 链" :source="ColorDemoSource">
      <template #desc>
        <code>:color="(c) =&gt; c._primary"</code> 传入 chain factory,IDE 补全 schema 全部
        color token + 146 CSS 命名色 + modifier 链 (alpha / darken / lighten / mix / shade / tint
        / saturate / desaturate / complement / rotateHue / invert)。用户扩展的 brand
        token(<code>_brandRoyal</code> 等)也自动可用。
      </template>
      <ColorDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸 (size)</ZTitle>
    <DemoBlock title="number 类型,iem 倍数(默认 1)" :source="SizeDemoSource">
      <template #desc>
        <code>size</code> 是 <strong>iem 倍数</strong>,组件内部按比例算 fontSize / height /
        padding / borderRadius / gap —— 整体比例不变,只是物理像素随 ZBox 字号缩放。
      </template>
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">状态 (loading / disabled / block)</ZTitle>
    <DemoBlock title="loading 自动注入旋转 icon" :source="StateDemoSource">
      <template #desc>
        <code>loading</code> 时 prefix 位置自动渲染 spin icon(走 ZIcon + presetAnimations.spin);
        <code>disabled</code> 走 opacity._dim + cursor.notAllowed;<code>block</code> 满宽。
      </template>
      <StateDemo />
    </DemoBlock>

    <ZTitle :level="2">图标插槽 (prefixIcon / suffixIcon)</ZTitle>
    <DemoBlock title="两侧 icon slot" :source="IconDemoSource">
      <template #desc>
        <code>#prefixIcon</code> / <code>#suffixIcon</code> 两个具名 slot 填 ZIcon
        (或任意 inline-flex 内容)。loading 态会临时占据 prefix 位置。
      </template>
      <IconDemo />
    </DemoBlock>

    <ZTitle :level="2">兜底:css factory</ZTitle>
    <DemoBlock title="任意属性 / 伪类 / 嵌套选择器" :source="CssDemoSource">
      <template #desc>
        在 base + variant + color + size 全部计算之后应用,可覆盖任何属性。
        <strong>圆形按钮 / 渐变背景 / 自定义 hover transform</strong> 等需求一律走这里。
      </template>
      <CssDemo />
    </DemoBlock>
  </section>
</template>
