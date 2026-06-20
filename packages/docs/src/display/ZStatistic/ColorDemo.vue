<script setup lang="ts">
import { ZStatistic, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._huge" :wrap="w => w.wrap">
    <ZStatistic
      title="主色"
      :value="9527"
      :color="c => c._primary"
    />
    <ZStatistic
      title="成功"
      :value="99.8"
      :precision="1"
      suffix="%"
      :color="c => c._success"
    />
    <ZStatistic
      title="警告"
      :value="3"
      :color="c => c._warning"
    />
    <ZStatistic
      title="危险 / 错误"
      :value="12"
      :color="c => c._danger"
    />
  </ZFlex>
</template>
