<script setup lang="ts">
import { ZTimeline } from '@kenconnet666/zui-vue'

/** 每项仅有 title，无 description，适合简洁步骤列表。 */
const items = [
  { title: '创建账号' },
  { title: '完善资料' },
  { title: '邮箱验证' },
  { title: '开始使用' },
]
</script>

<template>
  <ZTimeline :items="items" />
</template>
