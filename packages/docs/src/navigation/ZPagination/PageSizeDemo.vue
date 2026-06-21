<script setup lang="ts">
import { ZPagination, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 演示 pageSize 每页条数：5 / 10 / 20 三档，总 100 条。 */
const page1 = ref(1)
const page2 = ref(1)
const page3 = ref(1)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>pageSize=5（每页 5 条）</ZText>
      <ZPagination v-model:page="page1" :total="100" :page-size="5" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>pageSize=10（默认）</ZText>
      <ZPagination v-model:page="page2" :total="100" :page-size="10" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>pageSize=20（每页 20 条）</ZText>
      <ZPagination v-model:page="page3" :total="100" :page-size="20" />
    </ZFlex>
  </ZFlex>
</template>
