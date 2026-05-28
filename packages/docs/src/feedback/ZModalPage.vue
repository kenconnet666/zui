<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZModal/BasicDemo.vue'
import BasicDemoSource from './ZModal/BasicDemo.vue?raw'
import NoMaskCloseDemo from './ZModal/NoMaskCloseDemo.vue'
import NoMaskCloseDemoSource from './ZModal/NoMaskCloseDemo.vue?raw'
import CustomFooterDemo from './ZModal/CustomFooterDemo.vue'
import CustomFooterDemoSource from './ZModal/CustomFooterDemo.vue?raw'
import NestedDemo from './ZModal/NestedDemo.vue'
import NestedDemoSource from './ZModal/NestedDemo.vue?raw'

const propsRows = [
  { name: 'visible',      type: 'boolean',             default: 'false',  desc: '是否显示（v-model:visible）。' },
  { name: 'title',        type: 'string',              default: '—',      desc: '头部标题（#head slot 优先级更高）。' },
  { name: 'width',        type: 'number',              default: '30',     desc: '对话框宽度 iem 倍数（默认 480px @ 16px iem）。' },
  { name: 'centered',     type: 'boolean',             default: 'true',   desc: '垂直居中。' },
  { name: 'closable',     type: 'boolean',             default: 'true',   desc: '头部显示关闭按钮。' },
  { name: 'maskClosable', type: 'boolean',             default: 'true',   desc: '点击遮罩关闭。' },
  { name: 'to',           type: 'string | HTMLElement', default: "'body'", desc: 'Teleport target。' },
  { name: 'zIndex',       type: 'number',              default: '—',      desc: '自定义 z-index（dialog = zIndex + 1）。' },
  { name: 'css',          type: '(s: Chain) => void',  default: '—',      desc: '根元素 CSS 兜底。' },
]

const slotsRows = [
  { name: 'default',   desc: '对话框主体内容（body）。' },
  { name: 'head',      desc: '自定义头部（完全替换标题行）。' },
  { name: 'foot',      desc: '底部按钮区域。' },
  { name: 'closeIcon', desc: '自定义关闭图标。' },
]

const emitsRows = [
  { name: 'update:visible', args: 'boolean', desc: '显示状态变更。' },
  { name: 'close',          args: '—',       desc: '关闭时触发（按钮或 ESC）。' },
  { name: 'mask-click',     args: '—',       desc: '点击遮罩时触发。' },
]

const exposeRows = [
  { name: 'rootRef', type: 'Ref<HTMLElement | null>', desc: '遮罩根元素 DOM 引用。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZModal 对话框</ZTitle>
    <ZParagraph>
      居中对话框，基于 Teleport 渲染到 body，支持 ESC / mask 关闭、自定义宽度、头部和底部。
      <ZCode code="v-model:visible" /> 控制显示，<ZCode code="#foot" /> slot 放置确认/取消按钮。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础对话框 / 自定义宽度" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">禁用遮罩关闭</ZTitle>
    <DemoBlock title="maskClosable=false" :source="NoMaskCloseDemoSource">
      <template #desc>
        关键确认场景设置 <ZCode code="maskClosable=false" />,防止误点关闭。仍可 ESC / 关闭按钮关闭。
      </template>
      <NoMaskCloseDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义底部</ZTitle>
    <DemoBlock title="#foot slot + 异步 loading" :source="CustomFooterDemoSource">
      <template #desc>
        <ZCode code="#foot" /> slot 完全自定义底部布局,支持 loading 按钮做异步提交。
      </template>
      <CustomFooterDemo />
    </DemoBlock>

    <ZTitle :level="2">嵌套 + ESC 栈</ZTitle>
    <DemoBlock title="多层 Modal 与 useEscapeStack" :source="NestedDemoSource">
      <template #desc>
        多层弹窗共享 ESC 栈,按 ESC 仅关闭最顶层;z-index 自动叠加。
      </template>
      <NestedDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',  mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="slotsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '160px' },
        { key: 'args', label: '参数',  mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">Expose</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="exposeRows"
    />
  </section>
</template>
