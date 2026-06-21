<script setup lang="ts">
import { ZPagination, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/**
 * 演示 size（字号 px 倍数）与 itemSize（item 尺寸独立控制）。
 * - size 改变整体字号，item 尺寸默认跟 size*2 联动。
 * - itemSize 单独覆盖 item 的宽/高，不影响字号。
 */
const page = ref(1)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=0.875（小号，字号 14px，item 高 28px）</ZText>
      <ZPagination v-model:page="page" :total="100" :size="0.875" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=1（默认，字号 16px，item 高 32px）</ZText>
      <ZPagination v-model:page="page" :total="100" :size="1" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=1.25（大号，字号 20px，item 高 40px）</ZText>
      <ZPagination v-model:page="page" :total="100" :size="1.25" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=1 itemSize=3（字号 16px，但 item 高 48px 独立控制）</ZText>
      <ZPagination v-model:page="page" :total="100" :size="1" :item-size="3" />
    </ZFlex>
  </ZFlex>
</template>
