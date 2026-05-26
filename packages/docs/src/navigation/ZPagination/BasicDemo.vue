<script setup lang="ts">
import { ZPagination, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>基础分页</ZText>
      <ZPagination v-model:page="page" :total="100" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>显示总数</ZText>
      <ZPagination v-model:page="page" :total="100" :show-total="true" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>更多页码（siblings=2）</ZText>
      <ZPagination v-model:page="page" :total="200" :siblings="2" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>小尺寸（size=0.875）</ZText>
      <ZPagination v-model:page="page" :total="100" :size="0.875" />
    </ZFlex>

    <ZText :css="s => { s.color._textSecondary }">当前页：{{ page }}</ZText>
  </ZFlex>
</template>
