<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZMessage/BasicDemo.vue'
import BasicDemoSource from './ZMessage/BasicDemo.vue?raw'

const apiRows = [
  { name: 'info',       type: '(content: string, duration?: number) => id',    desc: '普通消息。' },
  { name: 'success',    type: '(content: string, duration?: number) => id',    desc: '成功消息。' },
  { name: 'warning',    type: '(content: string, duration?: number) => id',    desc: '警告消息。' },
  { name: 'error',      type: '(content: string, duration?: number) => id',    desc: '错误消息。' },
  { name: 'loading',    type: '(content: string, duration?: number) => id',    desc: '加载中消息，默认不自动关闭（duration=0）。' },
  { name: 'close',      type: '(id: string | number) => void',                 desc: '手动关闭指定 id 的消息。' },
  { name: 'destroyAll', type: '() => void',                                    desc: '关闭所有消息并销毁容器。' },
]

const propsRows = [
  { name: 'messages', type: 'ZMessageItem[]',           default: '—（必传）', desc: 'message 数组，业务方自管 state。' },
  { name: 'css',      type: '(s: Chain) => void',       default: '—',         desc: '容器 CSS 兜底（fixed 吸顶居中）。' },
]

const itemRows = [
  { name: 'id',       type: 'string | number',          default: '—（必传）', desc: '唯一 id，工厂模式自动生成。' },
  { name: 'content',  type: 'string',                   default: '—（必传）', desc: '消息文本内容。' },
  { name: 'duration', type: 'number',                   default: '3000',      desc: '持续时间 ms，0 = 不自动关闭（loading 默认 0）。' },
  { name: 'color',    type: '(c: Chain) => void',       default: '_info',     desc: '图标及文字颜色 factory。' },
  { name: 'icon',     type: 'Component',                default: '语义图标',  desc: '自定义图标组件，传给 ZIcon。' },
  { name: 'loading',  type: 'boolean',                  default: 'false',     desc: '是否旋转 loading 图标。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZMessage 消息提示</ZTitle>
    <ZParagraph>
      顶部居中 Toast 消息，通过 <ZCode code="Teleport" /> 渲染到 <ZCode code="body" />，
      支持 info / success / warning / error / loading 五种语义。
      推荐使用 <ZCode code="createMessageApi()" /> 工厂模式，在应用任意位置调用，无需手动管理组件状态。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="五种语义 / loading → success" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="createMessageApi()" /> 返回工厂对象；
        <ZCode code="msg.loading()" /> 返回 id，调 <ZCode code="msg.close(id)" /> 可手动关闭。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">工厂 API（createMessageApi）</ZTitle>
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
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">ZMessageItem 字段</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '字段',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="itemRows"
    />
  </section>
</template>
