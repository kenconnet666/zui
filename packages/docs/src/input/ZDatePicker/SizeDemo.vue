<script setup lang="ts">
import { ZDatePicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/**
 * 演示 size / height：
 * - size 控制字号 px 倍数（1 单位 = 16px），height 默认跟随 size*2。
 * - height 可独立覆盖高度，与 size 解耦。
 */
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const v4 = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=0.875（小号，高度 28px）</ZText>
      <ZDatePicker v-model:value="v1" :size="0.875" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=1（默认，高度 32px）</ZText>
      <ZDatePicker v-model:value="v2" :size="1" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=1.25（大号，高度 40px）</ZText>
      <ZDatePicker v-model:value="v3" :size="1.25" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>size=1 height=3（字号 16px，但高度独立 48px）</ZText>
      <ZDatePicker v-model:value="v4" :size="1" :height="3" />
    </ZFlex>
  </ZFlex>
</template>
