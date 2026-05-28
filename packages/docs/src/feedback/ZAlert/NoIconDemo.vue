<script setup lang="ts">
import { ZAlert, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZAlert :showIcon="false" title="无图标模式" description="通过 :showIcon='false' 隐藏左侧图标。" />
    <ZAlert :showIcon="false" :color="c => c._success" title="纯文本成功提示" />
    <ZAlert :showIcon="false" :color="c => c._warning" description="只有描述,没有标题。" />
  </ZFlex>
</template>
