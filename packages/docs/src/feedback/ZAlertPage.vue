<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZAlert/BasicDemo.vue'
import BasicDemoSource from './ZAlert/BasicDemo.vue?raw'
import TypesDemo from './ZAlert/TypesDemo.vue'
import TypesDemoSource from './ZAlert/TypesDemo.vue?raw'
import ClosableDemo from './ZAlert/ClosableDemo.vue'
import ClosableDemoSource from './ZAlert/ClosableDemo.vue?raw'
import NoIconDemo from './ZAlert/NoIconDemo.vue'
import NoIconDemoSource from './ZAlert/NoIconDemo.vue?raw'
import SxAndSlotDemo from './ZAlert/SxAndSlotDemo.vue'
import SxAndSlotDemoSource from './ZAlert/SxAndSlotDemo.vue?raw'
import SlotDemo from './ZAlert/SlotDemo.vue'
import SlotDemoSource from './ZAlert/SlotDemo.vue?raw'
import SxIconCloseDemo from './ZAlert/SxIconCloseDemo.vue'
import SxIconCloseDemoSource from './ZAlert/SxIconCloseDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZAlert 警告</ZTitle>
    <ZParagraph>
      警示横幅，适合展示需要用户注意的页面级提示信息。
      <ZCode code="color" /> 接受 chain factory，可使用全部 schema color token；
      <ZCode code="size" /> 为 px 倍数（1 单位 = 16px），控制字号与内边距等比缩放；
      <ZCode code="closable" /> 开启右侧关闭按钮，触发 <ZCode code="@close" /> 事件。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="颜色 / 可关闭 / 无图标 / 尺寸" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">4 种语义色</ZTitle>
    <DemoBlock title="info / success / warning / danger" :source="TypesDemoSource">
      <template #desc>
        通过 <ZCode code="color" /> factory 切换语义色,内置图标会随颜色自动响应。
      </template>
      <TypesDemo />
    </DemoBlock>

    <ZTitle :level="2">可关闭</ZTitle>
    <DemoBlock title="closable + @close" :source="ClosableDemoSource">
      <template #desc>
        <ZCode code="closable" /> 开启右侧关闭按钮,触发 <ZCode code="@close" /> 事件,通常配合 v-if /
        v-show 隐藏。
      </template>
      <ClosableDemo />
    </DemoBlock>

    <ZTitle :level="2">隐藏图标</ZTitle>
    <DemoBlock title="showIcon=false" :source="NoIconDemoSource">
      <template #desc> 关闭左侧图标,显示更紧凑;也可只显示描述、只显示标题。 </template>
      <NoIconDemo />
    </DemoBlock>

    <ZTitle :level="2">子节点与 sx</ZTitle>
    <DemoBlock title="default slot + sxBody + size 缩放" :source="SxAndSlotDemoSource">
      <template #desc>
        默认插槽追加在描述下方，适合放操作按钮；<ZCode code="size" /> px 倍数（1 单位 = 16px）等比缩放内边距与字号。
      </template>
      <SxAndSlotDemo />
    </DemoBlock>

    <ZTitle :level="2">具名插槽（#icon / #title / #description）</ZTitle>
    <DemoBlock title="#icon / #title / #description 三个具名插槽" :source="SlotDemoSource">
      <template #desc>
        <ZCode code="#icon" /> 覆盖左侧内置图标；
        <ZCode code="#title" /> / <ZCode code="#description" /> 支持任意富文本内容，
        优先级高于同名 prop。
      </template>
      <SlotDemo />
    </DemoBlock>

    <ZTitle :level="2">sxIcon / sxClose / tag 定制</ZTitle>
    <DemoBlock title="sxIcon 图标区 / sxClose 关闭按钮 / tag 根元素 / @close 事件" :source="SxIconCloseDemoSource">
      <template #desc>
        <ZCode code="sxIcon" /> 覆盖左侧图标容器样式（字号、对齐等）；
        <ZCode code="sxClose" /> 覆盖右侧关闭按钮样式（需 <ZCode code="closable=true" />）；
        <ZCode code="tag" /> 改变根元素标签；
        <ZCode code="@close" /> 事件配合 <ZCode code="v-if" /> 控制显隐。
      </template>
      <SxIconCloseDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '180px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'color',
          type: '(c: ColorCarrier) => void',
          default: '_info',
          desc: '颜色 factory，影响图标色和背景浅色。',
        },
        { name: 'title', type: 'string', default: '—', desc: '标题文本（也可走 #title slot）。' },
        {
          name: 'description',
          type: 'string',
          default: '—',
          desc: '描述文本（也可走 #description slot）。',
        },
        {
          name: 'size',
          type: 'number',
          default: '0.875',
          desc: 'px 倍数（1 单位 = 16px），字号 / 内边距 / 间距等比缩放。',
        },
        { name: 'showIcon', type: 'boolean', default: 'true', desc: '是否显示左侧图标。' },
        { name: 'closable', type: 'boolean', default: 'false', desc: '是否显示右侧关闭按钮。' },
        { name: 'tag', type: 'string', default: `'div'`, desc: '根元素 tag。' },
        { name: 'sxIcon', type: 'SxObject', default: '—', desc: '左侧图标容器 sx 覆盖（字号、对齐等）。' },
        { name: 'sxBody', type: 'SxObject', default: '—', desc: '主体（title + description + default）容器 sx 覆盖。' },
        { name: 'sxClose', type: 'SxObject', default: '—', desc: '右侧关闭按钮 sx 覆盖（需 closable=true）。' },
        { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
      ]"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '120px' },
        { key: 'type', label: '参数', mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'close',
          type: '(evt: MouseEvent) => void',
          desc: '点击关闭按钮时触发（需开启 closable）。',
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
        { name: 'icon', desc: '自定义左侧图标（覆盖默认内置图标）。' },
        { name: 'title', desc: '自定义标题内容。' },
        { name: 'description', desc: '自定义描述内容。' },
        { name: 'default', desc: '默认插槽，追加在描述下方（适合操作按钮）。' },
      ]"
    />
  </section>
</template>
