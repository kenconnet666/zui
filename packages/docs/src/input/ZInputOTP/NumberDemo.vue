<script setup lang="ts">
import { ZInputOTP, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const pinCode = ref('')
const done = ref(false)

function onComplete(v: string): void {
  done.value = v.length === 6
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZInputOTP
      v-model:value="pinCode"
      :length="6"
      type="number"
      placeholder="0"
      @complete="onComplete"
    />
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
    >
      <template v-if="done">验证码已填写完成 ✓</template>
      <template v-else>仅接受数字输入（0-9），已输入 {{ pinCode.length }} / 6 位</template>
    </ZText>
  </ZFlex>
</template>
