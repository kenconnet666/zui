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
import DialogApiDemo from './ZModal/DialogApiDemo.vue'
import DialogApiDemoSource from './ZModal/DialogApiDemo.vue?raw'
import WidthDemo from './ZModal/WidthDemo.vue'
import WidthDemoSource from './ZModal/WidthDemo.vue?raw'
import CenteredDemo from './ZModal/CenteredDemo.vue'
import CenteredDemoSource from './ZModal/CenteredDemo.vue?raw'
import EventsDemo from './ZModal/EventsDemo.vue'
import EventsDemoSource from './ZModal/EventsDemo.vue?raw'
import HeadSlotDemo from './ZModal/HeadSlotDemo.vue'
import HeadSlotDemoSource from './ZModal/HeadSlotDemo.vue?raw'
import SxDemo from './ZModal/SxDemo.vue'
import SxDemoSource from './ZModal/SxDemo.vue?raw'

const propsRows = [
  { name: 'visible', type: 'boolean', default: 'false', desc: '是否显示（v-model:visible）。' },
  { name: 'title', type: 'string', default: '—', desc: '头部标题（#head slot 优先级更高）。' },
  {
    name: 'width',
    type: 'number',
    default: '30',
    desc: '对话框宽度 px 倍数（1 单位 = 16px，默认 30 = 480px）。',
  },
  { name: 'centered', type: 'boolean', default: 'true', desc: '垂直居中；false 时对话框顶部对齐（marginTop _huge）。' },
  { name: 'closable', type: 'boolean', default: 'true', desc: '头部显示关闭按钮。' },
  { name: 'maskClosable', type: 'boolean', default: 'true', desc: '点击遮罩关闭。' },
  { name: 'to', type: 'string | HTMLElement', default: "'body'", desc: 'Teleport target，挂载位置。' },
  { name: 'zIndex', type: 'number', default: '—', desc: '自定义 z-index（mask = zIndex，dialog = zIndex + 1）。' },
  { name: 'sxMask', type: 'SxObject', default: '—', desc: '遮罩层 sx 样式定制。' },
  { name: 'sxDialog', type: 'SxObject', default: '—', desc: '对话框容器 sx 样式定制。' },
  { name: 'sxHead', type: 'SxObject', default: '—', desc: '头部区域 sx 样式定制。' },
  { name: 'sxBody', type: 'SxObject', default: '—', desc: '正文区域 sx 样式定制。' },
  { name: 'sxFoot', type: 'SxObject', default: '—', desc: '底栏区域 sx 样式定制。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '对话框容器 CSS 兜底（非标准尺寸走这里）。' },
]

const slotsRows = [
  { name: 'default', desc: '对话框主体内容（body）。' },
  { name: 'head', desc: '自定义头部（完全替换标题行）。' },
  { name: 'foot', desc: '底部按钮区域。' },
  { name: 'closeIcon', desc: '自定义关闭图标（替换默认 SVG，按钮外壳保留）。' },
]

const emitsRows = [
  { name: 'update:visible', args: 'boolean', desc: '显示状态变更。' },
  { name: 'close', args: '—', desc: '关闭时触发（按钮或 ESC）。' },
  { name: 'mask-click', args: '—', desc: '点击遮罩时触发。' },
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
      <template #desc> 多层弹窗共享 ESC 栈,按 ESC 仅关闭最顶层;z-index 自动叠加。 </template>
      <NestedDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义宽度 (width)</ZTitle>
    <DemoBlock title="width prop — px 倍数（1 单位 = 16px）" :source="WidthDemoSource">
      <template #desc>
        <code>width</code> 为 <strong>px 倍数</strong>，20 = 320px / 30 = 480px（默认）/ 40 = 640px / 50 = 800px。
        非标准尺寸（百分比 / vh）走 <ZCode code=":css='s => s.width.pct(80)'" />。
      </template>
      <WidthDemo />
    </DemoBlock>

    <ZTitle :level="2">居中 vs 顶部对齐 (centered)</ZTitle>
    <DemoBlock title="centered=true（默认）/ centered=false 顶部对齐" :source="CenteredDemoSource">
      <template #desc>
        <ZCode code="centered=true" />（默认）：对话框垂直居中于视口。
        <ZCode code="centered=false" />：对话框顶部对齐，marginTop 走 <ZCode code="_huge" /> spacing token，
        适合内容较长、需要从顶部向下浏览的场景。
      </template>
      <CenteredDemo />
    </DemoBlock>

    <ZTitle :level="2">事件监听 (close / mask-click)</ZTitle>
    <DemoBlock title="@close + @mask-click 事件" :source="EventsDemoSource">
      <template #desc>
        <ZCode code="@close" /> 在关闭按钮点击或 ESC 键触发时发出；
        <ZCode code="@mask-click" /> 在用户点击遮罩时发出（无论 maskClosable 是否为 true）。
      </template>
      <EventsDemo />
    </DemoBlock>

    <ZTitle :level="2">自定义头部 (#head / #closeIcon slot)</ZTitle>
    <DemoBlock title="#head slot 替换标题 / #closeIcon slot 替换图标" :source="HeadSlotDemoSource">
      <template #desc>
        <ZCode code="#head" /> slot 完全替换标题区域，可放状态标签、图标等。
        <ZCode code="#closeIcon" /> slot 仅替换关闭按钮内部图标，外层按钮不变。
        两者可单独或同时使用。
      </template>
      <HeadSlotDemo />
    </DemoBlock>

    <ZTitle :level="2">sx 深度定制</ZTitle>
    <DemoBlock title="sxMask / sxDialog / sxHead / sxBody / sxFoot" :source="SxDemoSource">
      <template #desc>
        五个 <ZCode code="sx*" /> prop 分别注入到遮罩、对话框容器、头部、正文、底栏，
        支持 <ZCode code="style" /> / <ZCode code="class" /> / HTML attrs 三种形式，
        无需覆盖全局样式即可深度定制。
      </template>
      <SxDemo />
    </DemoBlock>

    <ZTitle :level="2">命令式 createDialogApi</ZTitle>
    <ZParagraph>
      不想用 <ZCode code="v-model:visible" /> 管理状态时,用 <ZCode code="createDialogApi()" /> 以
      <strong>Promise</strong> 方式弹确认 / 提示框(对齐 <ZCode code="createMessageApi" /> /
      <ZCode code="createNotificationApi" /> 工厂模式)。<ZCode code="confirm" /> 双按钮 resolve
      <ZCode code="boolean" />(确定=true);<ZCode code="info/success/warning/error" />
      单"确定"按钮。任意关闭方式(取消 / 遮罩 / ESC)均 resolve。
    </ZParagraph>
    <DemoBlock title="dialog.confirm / info / success(Promise)" :source="DialogApiDemoSource">
      <DialogApiDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
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

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '80px' },
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
