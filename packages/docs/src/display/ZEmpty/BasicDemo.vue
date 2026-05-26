<script setup lang="ts">
import { ZEmpty, ZFlex, ZButton } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.flexStart">
    <ZEmpty />

    <ZEmpty description="搜索结果为空" />

    <ZEmpty :size="2" description="小尺寸（size=2）" />

    <ZEmpty description="带操作按钮">
      <ZButton :size="0.875">重新加载</ZButton>
    </ZEmpty>
  </ZFlex>
</template>
