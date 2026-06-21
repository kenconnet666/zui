<script setup lang="ts">
import { ref } from 'vue'
import { ZTable, ZSpace } from '@kenconnet666/zui-vue'

/** 订单数据行类型 */
interface OrderRow extends Record<string, unknown> {
  id: number
  no: string
  product: string
  amount: number
}

const columns = [
  { key: 'no', title: '订单号', dataIndex: 'no' },
  { key: 'product', title: '商品', dataIndex: 'product' },
  { key: 'amount', title: '金额', dataIndex: 'amount', align: 'right' as const },
]

const data: OrderRow[] = [
  { id: 1, no: 'ORD-001', product: '键盘', amount: 399 },
  { id: 2, no: 'ORD-002', product: '鼠标', amount: 199 },
  { id: 3, no: 'ORD-003', product: '显示器', amount: 2499 },
]

/** 当前尺寸倍数，默认 1（= 16px 基准，cell padding-y = 10px） */
const size = ref(1)
const sizes = [0.75, 1, 1.5] as const
</script>

<template>
  <!-- 三种 size 预设：0.75 紧凑 / 1 默认 / 1.5 宽松 -->
  <ZSpace :direction="(d) => d.column" :size="(g) => g.px(12)">
    <ZSpace :size="(g) => g.px(8)">
      <span
        v-for="s in sizes"
        :key="s"
        style="cursor: pointer; user-select: none; margin-right: 4px"
        @click="size = s"
      >
        {{ s === 0.75 ? '紧凑' : s === 1 ? '默认' : '宽松' }}
        ({{ s }})
        <span v-if="size === s"> ✓</span>
      </span>
    </ZSpace>
    <ZTable :columns="columns" :data="data" row-key="id" :bordered="true" :size="size" />
  </ZSpace>
</template>
