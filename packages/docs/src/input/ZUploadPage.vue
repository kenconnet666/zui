<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZUpload/BasicDemo.vue'
import BasicDemoSource from './ZUpload/BasicDemo.vue?raw'

const propsRows = [
  {
    name: 'fileList',
    type: 'ZUploadedFile[]',
    default: '[]',
    desc: '文件列表（v-model:fileList）。',
  },
  { name: 'accept', type: 'string', default: '—', desc: 'HTML input accept（如 image/*）。' },
  { name: 'multiple', type: 'boolean', default: 'false', desc: '多文件选择。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
  { name: 'dragDrop', type: 'boolean', default: 'true', desc: '显示拖拽区域。' },
  { name: 'showFileList', type: 'boolean', default: 'true', desc: '显示已选文件列表。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]

const fileRows = [
  { name: 'uid', type: 'string', default: '—', desc: '文件唯一标识。' },
  { name: 'name', type: 'string', default: '—', desc: '文件名。' },
  { name: 'size', type: 'number', default: '—', desc: '文件大小（字节）。' },
  { name: 'type', type: 'string', default: '—', desc: 'MIME 类型。' },
  {
    name: 'status',
    type: "'pending'|'uploading'|'success'|'error'",
    default: '—',
    desc: '上传状态。',
  },
  { name: 'raw', type: 'File', default: '—', desc: '原始 File 对象。' },
  { name: 'progress', type: 'number', default: '—', desc: '上传进度 0~100。' },
  { name: 'error', type: 'string', default: '—', desc: '错误信息（status=error 时）。' },
]

const emitsRows = [
  { name: 'update:fileList', args: 'ZUploadedFile[]', desc: '文件列表变更。' },
  { name: 'change', args: 'File[]', desc: '新增文件选择时触发（实际上传逻辑由调用方处理）。' },
  { name: 'remove', args: 'ZUploadedFile', desc: '移除文件时触发。' },
]

const slotsRows = [
  {
    name: 'default',
    desc: '自定义拖拽区内容（仅 dragDrop=true 时生效），默认显示图标和"点击或拖拽文件…"提示。',
  },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZUpload 文件上传</ZTitle>
    <ZParagraph>
      支持点击选择和拖拽上传，组件负责本地文件状态管理。实际上传逻辑由调用方在
      <ZCode code="@change" /> 事件中处理，可自由对接任意上传 API。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="拖拽上传 / 多选 / 禁用" :source="BasicDemoSource">
      <BasicDemo />
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

    <ZTitle :level="2">ZUploadedFile</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '240px' },
        { key: 'default', label: '默认值', mono: true, width: '80px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="fileRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '180px' },
        { key: 'args', label: '参数', mono: true, width: '160px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
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
