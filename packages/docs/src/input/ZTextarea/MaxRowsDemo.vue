<script setup lang="ts">
import { ref } from 'vue'
import { ZTextarea } from '@kenconnet666/zui-vue'

const value = ref('')
</script>

<template>
  <ZTextarea
    v-model:value="value"
    :autosize="true"
    :max-rows="4"
    :show-count="true"
    :maxlength="200"
    placeholder="最多自动撑到 4 行,超出滚动 + 显示字数"
  />
</template>
