<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZLoadingBar/BasicDemo.vue'
import BasicDemoSource from './ZLoadingBar/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZLoadingBar 加载条</ZTitle>
    <ZParagraph>
      顶部线性进度条，类似 NProgress，通过 <ZCode code="Teleport" /> 渲染到 <ZCode code="body" />，
      <ZCode code="position: fixed" /> 吸顶。<ZCode code="value" /> 传 <ZCode code="null" /> 时隐藏。
      通常配合页面路由切换使用，也可配合 <ZCode code="createLoadingBarApi" /> 在应用任意位置调用。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="进度控制 / 错误态 / 静态展示" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="value" /> 为 0~100 的进度值；
        <ZCode code="null" /> 时隐藏；
        <ZCode code=":error='true'" /> 切换为错误色（<ZCode code="_danger" />）。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '120px' },
        { key: 'type',    label: '类型',   mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'value', type: 'number | null', default: 'null',  desc: '进度值 0~100。null 时隐藏进度条。' },
        { name: 'error', type: 'boolean',       default: 'false', desc: '错误态，进度条变为 _danger 色。' },
        { name: 'css',   type: '(s: Chain) => void', default: '—', desc: '容器 CSS 兜底（默认 fixed 吸顶，可覆盖）。' },
      ]"
    />
  </section>
</template>
