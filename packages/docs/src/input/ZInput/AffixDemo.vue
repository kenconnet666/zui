<script setup lang="ts">
import { ref } from 'vue'
import { ZInput, ZSpace, ZIcon, BuiltinIcons } from '@kenconnet666/zui-vue'

const user = ref('')
const amount = ref('')
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g.iem(0.75)">
    <ZInput v-model:value="user" placeholder="搜索...">
      <template #prefix>
        <ZIcon :component="BuiltinIcons.search" />
      </template>
    </ZInput>
    <ZInput v-model:value="amount" placeholder="输入金额">
      <template #prefix>¥</template>
      <template #suffix>RMB</template>
    </ZInput>
  </ZSpace>
</template>
