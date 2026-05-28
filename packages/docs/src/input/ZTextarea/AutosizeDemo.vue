<script setup lang="ts">
import { ref } from 'vue'
import { ZTextarea } from '@kenconnet666/zui-vue'

const value = ref('随着输入,高度自动撑开\n试试多敲几行回车')
</script>

<template>
  <ZTextarea v-model:value="value" :autosize="true" placeholder="自适应高度,无 maxRows 限制" />
</template>
