<script setup lang="ts">
import { ref } from 'vue'
import { ZDynamicTags, ZSpace, ZText } from '@kenconnet666/zui-vue'

const t1 = ref(['前端', '后端'])
const t2 = ref(['只读标签'])
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">max = 5 限制数量 + 自定义 placeholder</ZText>
    <ZDynamicTags v-model:value="t1" :max="5" placeholder="添加标签" />

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">addable = false(禁止新增,仅展示/删除)</ZText>
    <ZDynamicTags v-model:value="t2" :addable="false" />
  </ZSpace>
</template>
