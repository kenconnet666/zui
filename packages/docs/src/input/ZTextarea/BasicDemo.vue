<script setup lang="ts">
import { ZTextarea, ZFlex } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZTextarea v-model:value="value1" placeholder="请输入内容..." :rows="3" :show-count="true" :maxlength="200" />

    <ZTextarea v-model:value="value2" placeholder="自动高度（autosize）" :autosize="true" :max-rows="8" />

    <ZTextarea placeholder="已禁用" :disabled="true" value="禁用状态的内容" :rows="3" />
  </ZFlex>
</template>
