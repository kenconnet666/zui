<script setup lang="ts">
import { ZInputOTP, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const code = ref('')
const completed = ref('')

function onComplete(v: string): void {
  completed.value = v
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZInputOTP v-model:value="code" :length="6" @complete="onComplete" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >当前值：「{{ code }}」<template v-if="completed">
          —— 已完成：{{ completed }}</template
        ></ZText
      >
    </ZFlex>

    <ZInputOTP :value="'12'" :length="4" :disabled="true" />
  </ZFlex>
</template>
