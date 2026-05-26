<script setup lang="ts">
import { ZCountdown, ZFlex, ZText, ZTag, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const target = ref(Date.now() + 3 * 60 * 60 * 1000)

function reset() {
  target.value = Date.now() + 3 * 60 * 60 * 1000
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>默认格式 (h:m:s)：</ZText>
      <ZTag :css="s => { s.fontSize._large; s.fontWeight._semibold }">
        <ZCountdown :value="target" />
      </ZTag>
    </ZFlex>

    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>显示天数：</ZText>
      <ZTag>
        <ZCountdown :value="target" format="{d}天 {h}:{m}:{s}" />
      </ZTag>
    </ZFlex>

    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>毫秒精度：</ZText>
      <ZTag>
        <ZCountdown :value="Date.now() + 30000" format="{s}.{ms}" precision="ms" />
      </ZTag>
    </ZFlex>

    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>finish 事件：</ZText>
      <ZTag>
        <ZCountdown :value="Date.now() + 5000" @finish="() => {}" />
      </ZTag>
      <ZButton :size="0.875" @click="reset">重置</ZButton>
    </ZFlex>
  </ZFlex>
</template>
