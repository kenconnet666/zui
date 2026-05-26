<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZNotification/BasicDemo.vue'
import BasicDemoSource from './ZNotification/BasicDemo.vue?raw'

const apiRows = [
  { name: 'info',       type: '(title: string, desc?: string, duration?: number) => id', desc: '普通通知。' },
  { name: 'success',    type: '(title: string, desc?: string, duration?: number) => id', desc: '成功通知。' },
  { name: 'warning',    type: '(title: string, desc?: string, duration?: number) => id', desc: '警告通知。' },
  { name: 'error',      type: '(title: string, desc?: string, duration?: number) => id', desc: '错误通知。' },
  { name: 'loading',    type: '(title: string, desc?: string, duration?: number) => id', desc: '加载中通知，默认不自动关闭。' },
  { name: 'close',      type: '(id: string | number) => void',                           desc: '手动关闭指定 id 的通知。' },
  { name: 'destroyAll', type: '() => void',                                              desc: '关闭所有通知并销毁容器。' },
]

const propsRows = [
  { name: 'items',     type: 'ZNotificationItem[]',     default: '—（必传）', desc: '通知数组，业务方自管 state。' },
  { name: 'placement', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", desc: '通知位置。' },
  { name: 'maxWidth',  type: 'number',                  default: '22.5',      desc: '通知容器最大宽度（iem 倍数，22.5 ≈ 360px）。' },
  { name: 'css',       type: '(s: Chain) => void',      default: '—',         desc: '容器 CSS 兜底。' },
]

const itemRows = [
  { name: 'id',          type: 'string | number',       default: '—（必传）', desc: '唯一 id。' },
  { name: 'title',       type: 'string',                default: '—（必传）', desc: '通知标题。' },
  { name: 'description', type: 'string',                default: '—',         desc: '通知描述文字（可选）。' },
  { name: 'duration',    type: 'number',                default: '4500',      desc: '持续时间 ms，0 = 不自动关闭（loading 默认 0）。' },
  { name: 'closable',    type: 'boolean',               default: 'true',      desc: '是否显示关闭按钮。' },
  { name: 'color',       type: '(c: Chain) => void',    default: '_info',     desc: '图标颜色 factory。' },
  { name: 'icon',        type: 'Component',             default: '语义图标',  desc: '自定义图标组件。' },
  { name: 'loading',     type: 'boolean',               default: 'false',     desc: '是否旋转 loading 图标。' },
]

const eventsRows = [
  { name: 'close', type: '(id: string | number) => void', desc: '点击关闭按钮或到期自动关闭时触发。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZNotification 通知</ZTitle>
    <ZParagraph>
      角落弹出通知，比 ZMessage 功能更丰富：支持 <ZCode code="title" /> + <ZCode code="description" /> 两行内容、
      可关闭按钮、自定义位置（右上角 / 左上角 / 右下角 / 左下角）。
      推荐使用 <ZCode code="createNotificationApi()" /> 工厂模式。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="五种语义 / 无描述 / loading → success" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="createNotificationApi()" /> 返回工厂对象；
        通知默认 4500ms 后自动关闭；
        loading 通知默认不自动关闭，需手动 <ZCode code="close(id)" />。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">工厂 API（createNotificationApi）</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '方法',  mono: true, width: '120px' },
        { key: 'type', label: '签名',  mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="apiRows"
    />

    <ZTitle :level="2">Props（组件模式）</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '280px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZNotificationItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '字段',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="itemRows"
    />

    <ZTitle :level="2">Events（组件模式）</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件',  mono: true, width: '120px' },
        { key: 'type', label: '参数',  mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="eventsRows"
    />
  </section>
</template>
