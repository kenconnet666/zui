<script setup lang="ts">
import { ZTimeline } from '@kenconnet666/zui-vue'

/** 用 dot 颜色语义化表示不同状态节点。 */
const items = [
  {
    title: '订单创建',
    description: '2026-06-01  已支付，等待备货。',
    color: (c: any) => {
      c._success
    },
  },
  {
    title: '仓库备货中',
    description: '2026-06-02  部分库存不足，延迟发货。',
    color: (c: any) => {
      c._warning
    },
  },
  {
    title: '物流异常',
    description: '2026-06-04  包裹在中转站滞留，已联系快递处理。',
    color: (c: any) => {
      c._danger
    },
  },
  {
    title: '等待签收',
    description: '2026-06-06  已派送，等待用户签收。',
    color: (c: any) => {
      c._primary
    },
  },
]
</script>

<template>
  <ZTimeline :items="items" />
</template>
