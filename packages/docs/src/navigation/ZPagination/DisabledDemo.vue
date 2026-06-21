<script setup lang="ts">
import { ZPagination, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 演示 disabled 整体禁用。 */
const page = ref(3)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>正常状态</ZText>
      <ZPagination v-model:page="page" :total="100" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>disabled=true（整体禁用，所有按钮不可交互）</ZText>
      <ZPagination v-model:page="page" :total="100" :disabled="true" />
    </ZFlex>
  </ZFlex>
</template>
