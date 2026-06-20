<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZResult/BasicDemo.vue'
import BasicDemoSource from './ZResult/BasicDemo.vue?raw'
import SuccessDemo from './ZResult/SuccessDemo.vue'
import SuccessDemoSource from './ZResult/SuccessDemo.vue?raw'
import ErrorDemo from './ZResult/ErrorDemo.vue'
import ErrorDemoSource from './ZResult/ErrorDemo.vue?raw'
import CustomIconDemo from './ZResult/CustomIconDemo.vue'
import CustomIconDemoSource from './ZResult/CustomIconDemo.vue?raw'
import IconSlotDemo from './ZResult/IconSlotDemo.vue'
import IconSlotDemoSource from './ZResult/IconSlotDemo.vue?raw'

const propsRows = [
  { name: 'title', type: 'string', default: '—', desc: '结果标题。' },
  { name: 'description', type: 'string', default: '—', desc: '结果描述文字。' },
  { name: 'color', type: '(c: Chain) => void', default: '_info', desc: '大图标颜色 factory。' },
  { name: 'icon', type: 'Component', default: 'info 图标', desc: '自定义大图标组件（Vue 组件）。' },
  { name: 'notFound', type: 'boolean', default: 'false', desc: '404 模式，默认图标改为搜索图标。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'icon', desc: '自定义大图标区域，优先级高于 icon prop。' },
  { name: 'default', desc: '底部操作按钮区域（建议放 ZButton）。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZResult 结果</ZTitle>
    <ZParagraph>
      结果状态展示组件，用于操作完成后的反馈页面。 通过 <ZCode code="color" /> factory
      控制大图标颜色， <ZCode code=":not-found='true'" /> 可快速切换为 404 场景。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="成功 / 失败 / 404" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">成功结果</ZTitle>
    <DemoBlock title="success" :source="SuccessDemoSource">
      <template #desc> 典型成功反馈页 —— 大 success 色图标 + 主操作 + 次操作。 </template>
      <SuccessDemo />
    </DemoBlock>

    <ZTitle :level="2">错误结果</ZTitle>
    <DemoBlock title="error" :source="ErrorDemoSource">
      <template #desc>
        失败反馈 —— danger 色图标 + 重试按钮(同样 danger 色 chain factory 联动)。
      </template>
      <ErrorDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义图标</ZTitle>
    <DemoBlock title="icon prop 传 Vue 组件" :source="CustomIconDemoSource">
      <template #desc>
        <code>icon</code> prop 传任意 Vue 组件覆盖默认图标，字体大小已经在 ZResult 内部锁为 64px。
      </template>
      <CustomIconDemo />
    </DemoBlock>

    <ZTitle :level="2">#icon slot 自定义图标区</ZTitle>
    <DemoBlock title="#icon slot — 比 icon prop 更灵活" :source="IconSlotDemoSource">
      <template #desc>
        <code>#icon</code> slot 优先级高于 <code>icon</code> prop，可放置任意内容（组合图标、
        自定义 SVG、emoji 等）。示例展示双图标叠加的徽标效果。
      </template>
      <IconSlotDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />
  </section>
</template>
