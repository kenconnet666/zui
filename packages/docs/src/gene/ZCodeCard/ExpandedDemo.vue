<script setup lang="ts">
import { ZCodeCard } from '@kenconnet666/zui-vue'
import { ZText, ZCode } from '@kenconnet666/zui-vue'

/**
 * ZCodeCard 高级用法：
 * - defaultExpanded：默认展开代码区
 * - showImports：保留 import 语句
 * - #desc slot：描述区，位于 header 下方、预览区上方
 */
const sampleSource = `<script setup lang="ts">
import { ZText } from '@kenconnet666/zui-vue'
<\/script>

<template>
  <ZText>使用 defaultExpanded 默认展开代码，showImports 显示 import 行。</ZText>
</template>`
</script>

<template>
  <ZCodeCard
    title="defaultExpanded + showImports + desc slot"
    :source="sampleSource"
    :default-expanded="true"
    :show-imports="true"
  >
    <template #desc>
      传 <ZCode code=":default-expanded='true'" /> 后代码区默认展开；传
      <ZCode code=":show-imports='true'" /> 后保留源码里的 import 行。
      <ZCode code="#desc" /> slot 可放本段说明文字。
    </template>
    <ZText>使用 defaultExpanded 默认展开代码，showImports 显示 import 行。</ZText>
  </ZCodeCard>
</template>
