<script setup lang="ts">
import { ZProgress, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="(d) => d.column" :gap="(g) => g._small">
    <ZText>_primary (默认)</ZText>
    <ZProgress :value="40" :show-text="true" />

    <ZText>_success</ZText>
    <ZProgress :value="100" :color="(c) => c._success" :show-text="true" />

    <ZText>_warning</ZText>
    <ZProgress :value="55" :color="(c) => c._warning" :show-text="true" />

    <ZText>_danger</ZText>
    <ZProgress :value="20" :color="(c) => c._danger" :show-text="true" />

    <ZText>命名色 + alpha modifier (deeppink.alpha(0.8))</ZText>
    <ZProgress
      :value="70"
      :color="(c) => c.deeppink.alpha(0.8)"
      :show-text="true"
    />
  </ZFlex>
</template>
