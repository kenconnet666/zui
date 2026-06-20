<script setup lang="ts">
/**
 * ZIcon 文档页。
 */
import { ZParagraph, ZTitle } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZIcon/BasicDemo.vue'
import BasicDemoSource from './ZIcon/BasicDemo.vue?raw'

import SizeDemo from './ZIcon/SizeDemo.vue'
import SizeDemoSource from './ZIcon/SizeDemo.vue?raw'

import ColorDemo from './ZIcon/ColorDemo.vue'
import ColorDemoSource from './ZIcon/ColorDemo.vue?raw'

import SpinDemo from './ZIcon/SpinDemo.vue'
import SpinDemoSource from './ZIcon/SpinDemo.vue?raw'

import CssDemo from './ZIcon/CssDemo.vue'
import CssDemoSource from './ZIcon/CssDemo.vue?raw'

import DepthDemo from './ZIcon/DepthDemo.vue'
import DepthDemoSource from './ZIcon/DepthDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZIcon 图标</ZTitle>
    <ZParagraph>
      框架无关图标容器，支持任意 SVG 图标库（<code>@vicons/material</code>、<code
        >@vicons/ionicons5</code
      >
      等）。 提供 <strong>4 个 chain factory props</strong>（<code>size</code> /
      <code>color</code> / <code>depth</code> / <code>spin</code>）+ <code>css</code> 兜底。
    </ZParagraph>

    <ZTitle :level="2">接入方式</ZTitle>
    <DemoBlock title="slot 模式 vs :component prop 模式" :source="BasicDemoSource">
      <template #desc>
        两种方式等价：slot 模式适合在模板里直接嵌入图标组件；<code>:component</code> prop
        模式适合动态切换图标（<code>shallowRef</code> + <code>watchEffect</code>）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸 (size)</ZTitle>
    <DemoBlock title="number 类型，px 倍数（1 单位 = 16px，默认 1）" :source="SizeDemoSource">
      <template #desc>
        <code>size</code> 接受 <strong>number（px 倍数，1 单位 = 16px）</strong>，height 自动镜像 width。
        非正方形场景走 <code>:css</code>。
      </template>
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">颜色 (color)</ZTitle>
    <DemoBlock title="color factory + modifier 链" :source="ColorDemoSource">
      <template #desc>
        默认继承父元素 <code>currentColor</code>。传入 chain factory 可使用全部 schema token + CSS
        命名色 + modifier 链（<code>alpha / darken / lighten</code> 等）。
      </template>
      <ColorDemo />
    </DemoBlock>

    <ZTitle :level="2">旋转动画 (spin)</ZTitle>
    <DemoBlock title="spin factory — animationDuration carrier" :source="SpinDemoSource">
      <template #desc>
        <code>spin</code> 接受 <code>animationDuration</code> carrier，用户只控制旋转速度；
        <code>animationName</code>（presetAnimations.spin）+ <code>infinite</code> +
        <code>linear</code> 自动加上。需要自定义 easing / 反向旋转走 <code>:css</code>。
      </template>
      <SpinDemo />
    </DemoBlock>

    <ZTitle :level="2">透明度 (depth)</ZTitle>
    <DemoBlock title="depth factory — opacity carrier" :source="DepthDemoSource">
      <template #desc>
        <code>depth</code> 接 <code>opacity</code> carrier，用 schema token 或字面量控制透明度。
        6 个档位：<code>_faint(5%)</code> / <code>_dim(25%)</code> / <code>_half(50%)</code>
        / <code>_strong(75%)</code> / <code>_solid(95%)</code> / <code>_full(100%)</code>，
        也可字面量 <code>o =&gt; o(0.3)</code>。
      </template>
      <DepthDemo />
    </DemoBlock>

    <ZTitle :level="2">css 兜底</ZTitle>
    <DemoBlock title="任意 CSS 属性 / 伪类 / 非正方形" :source="CssDemoSource">
      <template #desc>
        在 4 个维度之后应用，可覆盖任意属性。<code>_hover</code> / <code>_media</code> / 伪元素等
        Chain 内建方法均可使用。
      </template>
      <CssDemo />
    </DemoBlock>

    <!-- ─── API ─── -->
    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '300px' },
        { key: 'default', label: '默认值', mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'component',
          type: 'Component | undefined',
          default: '—',
          desc: '图标组件（:component prop 模式）。与 default slot 二选一。',
        },
        {
          name: 'size',
          type: 'number',
          default: '1',
          desc: 'px 倍数（1 单位 = 16px），width = height = size × 16px。',
        },
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: 'currentColor',
          desc: '图标颜色 factory。',
        },
        {
          name: 'depth',
          type: '(o: OpacityCarrier) => void',
          default: '—（opacity: 1）',
          desc: '透明度 factory，走 opacity carrier。',
        },
        {
          name: 'spin',
          type: '(d: DurationCarrier) => void',
          default: '—（不旋转）',
          desc: '旋转动画速度 factory，走 animationDuration carrier。启用后自动加 spin 关键帧。',
        },
        {
          name: 'label',
          type: 'string',
          default: '—',
          desc: '无障碍标签。传入后添加 aria-label + role=img；不传则 aria-hidden=true（装饰性图标）。',
        },
        {
          name: 'css',
          type: '(s: Chain) => void',
          default: '—',
          desc: '兜底 CSS factory，在所有内置样式之后应用。',
        },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'default',
          desc: '图标内容（slot 模式）。与 :component prop 二选一，同时传入时 default slot 优先（component prop 作为 slot 缺省内容，slot 有内容时不渲染）。',
        },
      ]"
    />
  </section>
</template>
