<script setup lang="ts">
import { ZStatistic, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._huge" :wrap="w => w.wrap">
    <!-- prefix slot：货币符号 -->
    <ZStatistic title="交易金额" :value="88888.88" :precision="2">
      <template #prefix>¥</template>
    </ZStatistic>

    <!-- suffix slot：百分号 -->
    <ZStatistic title="完成率" :value="96.5" :precision="1">
      <template #suffix>%</template>
    </ZStatistic>

    <!-- title slot：自定义标题（含高亮） -->
    <ZStatistic :value="2048">
      <template #title>
        <span>活跃节点 <strong style="color: inherit">（实时）</strong></span>
      </template>
    </ZStatistic>

    <!-- prefix + suffix 同时使用 slot -->
    <ZStatistic title="净利润" :value="31200" :separator="','">
      <template #prefix>$</template>
      <template #suffix>USD</template>
    </ZStatistic>
  </ZFlex>
</template>
