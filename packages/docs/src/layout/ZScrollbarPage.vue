<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'

import BasicDemo from './ZScrollbar/BasicDemo.vue'
import BasicDemoSource from './ZScrollbar/BasicDemo.vue?raw'
import HorizontalDemo from './ZScrollbar/HorizontalDemo.vue'
import HorizontalDemoSource from './ZScrollbar/HorizontalDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZScrollbar 自定义滚动条</ZTitle>
    <ZParagraph>
      浮层滚动条容器。原生滚动条完全隐藏（不占布局宽度），替换为自定义 6px 半透明 thumb，
      浮在内容上方，鼠标悬停或容器内有焦点时淡入显示，暗/亮色主题自动适配。
    </ZParagraph>
    <ZParagraph>
      <strong>使用要求</strong>：父级或 <ZCode code=":css" /> prop 必须给根元素提供明确高度
      （<ZCode code="height: 100%" /> / <ZCode code="flex-grow: 1; min-height: 0" /> 等），
      否则内容区为 0 高。也可用 <ZCode code="maxHeight" /> prop 直接设置最大高度。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="maxHeight / 外部 css 设高度" :source="BasicDemoSource">
      <template #desc>
        悬停容器可看到自定义滚动条淡入效果。
        <ZCode code="maxHeight" /> 模式：超出最大高度后才滚动；
        外部 <ZCode code=":css" /> 模式：需自行设定固定高度。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">横向滚动</ZTitle>
    <DemoBlock title="内容超出宽度时横向滚动" :source="HorizontalDemoSource">
      <template #desc>
        子元素 <ZCode code="flex-shrink: 0" /> + <ZCode code="nowrap" /> 不换行,容器宽度不足即横向滚动。
      </template>
      <HorizontalDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'maxHeight', type: 'number', default: '—', desc: '容器最大高度（iem 倍数）。设置后容器超出时滚动；不设则由外部 css 控制高度。' },
        { name: 'css',       type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底（常用于设固定 height / flex-grow）。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'default', desc: '可滚动内容，渲染到内层 scroller div 内。超出容器高度时显示自定义滚动条。' },
      ]"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性',   mono: true, width: '160px' },
        { key: 'type', label: '类型',   mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'scrollerRef', type: 'Ref<HTMLElement | null>', desc: '内层可滚动 div 的 ref，可用于编程式滚动（scrollTop = 0 等）。' },
        { name: '$el',         type: 'Ref<HTMLElement | null>', desc: 'scrollerRef 的别名，向后兼容。' },
      ]"
    />
  </section>
</template>
