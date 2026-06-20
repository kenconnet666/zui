<script setup lang="ts">
import { ZCodeCard } from '@kenconnet666/zui-vue'
import { ZText } from '@kenconnet666/zui-vue'

/**
 * ZCodeCard 基础用法示例：
 * 同一 .vue 文件以 ?raw 导入拿源码，以组件导入跑渲染；二者零漂移。
 *
 * 本 demo 自展示自身源码，展示 ZCodeCard 的基本用法。
 */
const sampleSource = `<script setup lang="ts">
import { ZText } from '@kenconnet666/zui-vue'
<\/script>

<template>
  <ZText>Hello, ZCodeCard!</ZText>
</template>`
</script>

<template>
  <ZCodeCard title="基础展示" :source="sampleSource">
    <ZText>Hello, ZCodeCard!</ZText>
  </ZCodeCard>
</template>
