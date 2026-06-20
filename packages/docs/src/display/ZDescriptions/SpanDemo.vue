<script setup lang="ts">
import { ZDescriptions } from '@kenconnet666/zui-vue'

/** span > 1 时，value 单元格跨相应列数（用于长文本字段）。 */
const items = [
  { label: '商品名称', value: 'ZUI Design Token 高级订阅' },
  { label: '订单编号', value: 'ORD-20260619-8866' },
  { label: '数量', value: 1 },
  { label: '单价（元）', value: '999.00' },
  { label: '合计（元）', value: '999.00' },
  { label: '收货地址', value: '上海市浦东新区张江高科技园区博云路 2 号', span: 2 },
  { label: '备注', value: '请在工作日 9:00-18:00 配送，联系电话见订单详情。', span: 2 },
]
</script>

<template>
  <ZDescriptions title="订单详情" :items="items" :bordered="true" :column="3" />
</template>
