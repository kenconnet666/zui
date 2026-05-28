<script setup lang="ts">
import { ZTimeline } from '@kenconnet666/zui-vue'

const items = [
  { title: '项目立项', description: '2026-01-15  完成需求文档撰写和评审。' },
  {
    title: '开发阶段',
    description: '2026-02-01  前后端并行开发，API 联调。',
    color: (c: any) => {
      c._primary
    },
  },
  {
    title: '测试上线',
    description: '2026-03-20  QA 测试通过，发布到生产环境。',
    color: (c: any) => {
      c._success
    },
  },
  {
    title: '已归档',
    description: '2026-04-01  项目结束，归档文档。',
    color: (c: any) => {
      c._textSecondary
    },
  },
]
</script>

<template>
  <ZTimeline :items="items" />
</template>
