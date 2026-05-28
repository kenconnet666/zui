<script setup lang="ts">
import { ZInput, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g.iem(0.75)">
    <ZInput value="只读内容" :readonly="true" placeholder="只读" />
    <ZInput value="禁用内容" :disabled="true" placeholder="禁用" />
  </ZSpace>
</template>
