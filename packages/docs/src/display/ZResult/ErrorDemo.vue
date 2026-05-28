<script setup lang="ts">
import { ZResult, ZButton } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZResult
    title="支付失败"
    description="网络异常导致支付未完成,余额已原路退回。如有疑问请联系客服。"
    :color="c => c._danger"
  >
    <ZButton :size="0.875" :color="c => c._danger">重新支付</ZButton>
  </ZResult>
</template>
