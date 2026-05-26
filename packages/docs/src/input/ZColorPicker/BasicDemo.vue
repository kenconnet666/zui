<script setup lang="ts">
import { ZColorPicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const color1 = ref('#3b82f6')
const color2 = ref('#10b981')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._large" :align="a => a.center">
      <ZColorPicker v-model:value="color1" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">{{ color1 }}</ZText>
    </ZFlex>

    <ZFlex :gap="g => g._large" :align="a => a.center">
      <ZColorPicker v-model:value="color2" :show-text="false" />
      <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">隐藏文字：{{ color2 }}</ZText>
    </ZFlex>

    <ZColorPicker value="#999999" :disabled="true" />
  </ZFlex>
</template>
