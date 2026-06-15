<script setup lang="ts">
/**
 * ZButton 文档页。
 */
import { ZParagraph, ZTitle } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import VariantsDemo from './ZButton/VariantsDemo.vue'
import VariantsDemoSource from './ZButton/VariantsDemo.vue?raw'

import ColorDemo from './ZButton/ColorDemo.vue'
import ColorDemoSource from './ZButton/ColorDemo.vue?raw'

import SizeDemo from './ZButton/SizeDemo.vue'
import SizeDemoSource from './ZButton/SizeDemo.vue?raw'

import StateDemo from './ZButton/StateDemo.vue'
import StateDemoSource from './ZButton/StateDemo.vue?raw'

import IconDemo from './ZButton/IconDemo.vue'
import IconDemoSource from './ZButton/IconDemo.vue?raw'

import CssDemo from './ZButton/CssDemo.vue'
import CssDemoSource from './ZButton/CssDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZButton 按钮</ZTitle>
    <ZParagraph>
      Material 风按钮,<strong>5 种 variant</strong> + <strong>chain factory color</strong> +
      <strong>iem 等比缩放 size</strong>。启用 ripple 波纹效果, hover / active / focus-visible
      三态自动接入 Material state layer。
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
        <code>:color="(c) =&gt; c._primary"</code> 传入 chain factory,IDE 补全 schema 全部 color
        token + 146 CSS 命名色 + modifier 链 (alpha / darken / lighten / mix / shade / tint /
        saturate / desaturate / complement / rotateHue / invert)。用户扩展的 brand token(<code
          >_brandRoyal</code
        >
        等)也自动可用。
      </template>
      <ColorDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸 (size)</ZTitle>
    <DemoBlock title="number 类型,iem 倍数(默认 1)" :source="SizeDemoSource">
      <template #desc>
        <code>size</code> 是 <strong>iem 倍数</strong>,组件内部按比例算 fontSize / height / padding
        / borderRadius / gap —— 整体比例不变,只是物理像素随 ZBox 字号缩放。
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
        <code>#prefixIcon</code> / <code>#suffixIcon</code> 两个具名 slot 填 ZIcon (或任意
        inline-flex 内容)。loading 态会临时占据 prefix 位置。
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

    <!-- ─── API ─── -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'variant',
          type: `'filled' | 'outlined' | 'text' | 'ghost' | 'link'`,
          default: `'filled'`,
          desc: '按钮外观变体。filled=实心, outlined=描边, text=文字, ghost=半透明, link=内联链接。',
        },
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: '_primary',
          desc: '主色 factory。传入 chain color carrier,IDE 全量补全 schema token + CSS 命名色 + modifier 链(alpha/darken/…)。',
        },
        {
          name: 'size',
          type: 'number',
          default: '1',
          desc: 'iem 倍数。所有尺寸维度（fontSize / height / padding / borderRadius / gap）同比缩放。',
        },
        {
          name: 'height',
          type: 'number',
          default: 'size × 2',
          desc: '按钮高度（iem 倍数）。可单独覆盖，不影响其他维度。',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          desc: '加载态。prefix 位置自动渲染旋转 icon，并屏蔽点击事件。',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          desc: '禁用态。opacity._dim + cursor.notAllowed，同时屏蔽点击事件。',
        },
        {
          name: 'block',
          type: 'boolean',
          default: 'false',
          desc: '撑满父容器宽度（width: 100%）。',
        },
        {
          name: 'ripple',
          type: 'boolean',
          default: 'true',
          desc: 'Material 波纹效果。text / link variant 可关闭。',
        },
        {
          name: 'type',
          type: `'button' | 'submit' | 'reset'`,
          default: `'button'`,
          desc: '原生 HTML type 属性，透传到 <button>。',
        },
        {
          name: 'sxIcon',
          type: 'SxObject',
          default: '—',
          desc: 'prefix/suffix icon 容器的 sx 覆盖。',
        },
        { name: 'sxRipple', type: 'SxObject', default: '—', desc: '波纹层 sx 覆盖。' },
        {
          name: 'css',
          type: '(s: Chain) => void',
          default: '—',
          desc: '兜底 CSS factory，在所有内置样式之后应用。',
        },
      ]"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'event', label: '事件', mono: true, width: '120px' },
        { key: 'payload', label: '参数', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          event: 'click',
          payload: 'evt: MouseEvent',
          desc: '按钮点击。disabled=true 或 loading=true 时不触发。',
        },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '按钮文字内容。' },
        {
          name: 'prefixIcon',
          desc: '左侧图标区。loading=true 时被加载旋转 icon 占位，此 slot 隐藏。',
        },
        { name: 'suffixIcon', desc: '右侧图标区。不受 loading 影响。' },
      ]"
    />

    <ZTitle :level="2">尺寸参考（iem = 16px）</ZTitle>
    <ZParagraph>
      <code>size</code> 是 <strong>iem 倍数</strong>，1iem 的物理像素由
      <code>&lt;ZBox :iem&gt;</code> 决定。 默认使用
      <code>.default = '0.8333vw'</code>，在 1920px 宽屏下等于
      16px，随视口宽度自适应缩放。 下表以 <strong>iem = 16px</strong>（固定基准）为例换算各档位的 px
      值：
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'size', label: 'size', mono: true, width: '80px' },
        { key: 'fontSize', label: 'font-size', mono: true },
        { key: 'height', label: 'height', mono: true },
        { key: 'paddingY', label: 'padding-y', mono: true },
        { key: 'paddingX', label: 'padding-x', mono: true },
        { key: 'borderRadius', label: 'border-radius', mono: true },
        { key: 'gap', label: 'gap', mono: true },
      ]"
      :rows="[
        {
          size: '0.5',
          fontSize: '8px',
          height: '16px',
          paddingY: '4px',
          paddingX: '8px',
          borderRadius: '3px',
          gap: '4px',
        },
        {
          size: '0.75',
          fontSize: '12px',
          height: '24px',
          paddingY: '6px',
          paddingX: '12px',
          borderRadius: '4.5px',
          gap: '6px',
        },
        {
          size: '1（默认）',
          fontSize: '16px',
          height: '32px',
          paddingY: '8px',
          paddingX: '16px',
          borderRadius: '6px',
          gap: '8px',
        },
        {
          size: '1.25',
          fontSize: '20px',
          height: '40px',
          paddingY: '10px',
          paddingX: '20px',
          borderRadius: '7.5px',
          gap: '10px',
        },
        {
          size: '1.5',
          fontSize: '24px',
          height: '48px',
          paddingY: '12px',
          paddingX: '24px',
          borderRadius: '9px',
          gap: '12px',
        },
        {
          size: '2',
          fontSize: '32px',
          height: '64px',
          paddingY: '16px',
          paddingX: '32px',
          borderRadius: '12px',
          gap: '16px',
        },
      ]"
    />
  </section>
</template>
