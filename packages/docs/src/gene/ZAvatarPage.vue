<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZAvatar/BasicDemo.vue'
import BasicDemoSource from './ZAvatar/BasicDemo.vue?raw'

import SizeDemo from './ZAvatar/SizeDemo.vue'
import SizeDemoSource from './ZAvatar/SizeDemo.vue?raw'

import ShapeDemo from './ZAvatar/ShapeDemo.vue'
import ShapeDemoSource from './ZAvatar/ShapeDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZAvatar 头像</ZTitle>
    <ZParagraph>
      头像组件，内容优先级：<strong
        >default slot &gt; src（图片）&gt; text（缩写）&gt; 默认占位</strong
      >。 图片加载失败自动 fallback 到 text。 <ZCode code="size" /> 是 px 倍数（1 单位 = 16px，默认 2.5 = 40px），<ZCode code="square" /> 切换方圆。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="图片 / 文字 / 大小 / 方圆 / slot" :source="BasicDemoSource">
      <template #desc>
        图片加载失败时自动切到 text fallback；color factory 控制文字/图标模式背景色，
        不影响图片模式。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸档位 (size)</ZTitle>
    <DemoBlock title="px 倍数（1 单位 = 16px），width / height / fontSize 等比缩放" :source="SizeDemoSource">
      <template #desc>
        参考档位：<ZCode code="1.5" />(24px) / <ZCode code="2" />(32px) / <ZCode code="2.5" />(默认
        40px) / <ZCode code="3" />(48px) / <ZCode code="4" />(64px)。
      </template>
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">方圆 (square)</ZTitle>
    <DemoBlock title="square=false 圆形 / square=true 方形" :source="ShapeDemoSource">
      <template #desc>
        默认 <ZCode code="square=false" /> 走 <ZCode code="borderRadius._full" /> 圆形；
        <ZCode code="square=true" /> 改为 <ZCode code="size*0.15" /> 倍数轻圆角方形。
      </template>
      <ShapeDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'src',
          type: 'string',
          default: '—',
          desc: '图片地址，加载失败自动 fallback 到 text。',
        },
        { name: 'alt', type: 'string', default: `''`, desc: '图片 alt 文字。' },
        {
          name: 'text',
          type: 'string',
          default: '—',
          desc: '文字 fallback（通常 1-2 个字符首字母缩写）。',
        },
        {
          name: 'size',
          type: 'number',
          default: '2.5',
          desc: 'px 倍数（1 单位 = 16px）。默认 2.5 = 40px，头像直径（width + height 镜像保证正方形）。参考档位：1.5(24px) / 2(32px) / 2.5(40px) / 3(48px) / 4(64px)。',
        },
        {
          name: 'square',
          type: 'boolean',
          default: 'false',
          desc: '方形（borderRadius = size*0.15 倍数），默认圆形（_full）。',
        },
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: '_textSecondary',
          desc: '文字/图标模式背景色 factory（图片模式下不生效）。',
        },
        { name: 'css', type: '(s: Chain) => void', default: '—', desc: '兜底 CSS factory。' },
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
          desc: '自定义头像内容，优先级最高（高于 src / text）。可放图标、emoji 等。',
        },
      ]"
    />
  </section>
</template>
