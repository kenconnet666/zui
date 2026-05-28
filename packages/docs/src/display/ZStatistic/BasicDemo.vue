<script setup lang="ts">
import { ZStatistic, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._huge" :wrap="w => w.wrap">
    <ZStatistic title="日活用户" :value="123456" />

    <ZStatistic title="收入（元）" :value="98765.43" :precision="2" />

    <ZStatistic title="增长率" :value="12.5" :precision="1" suffix="%" :color="c => c._success" />

    <ZStatistic title="亏损" :value="3200" prefix="¥" :color="c => c._danger" />

    <ZStatistic title="无分隔符" :value="1000000" separator="" />
  </ZFlex>
</template>
