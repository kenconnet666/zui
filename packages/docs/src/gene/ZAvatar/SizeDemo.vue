<script setup lang="ts">
import { ZAvatar, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(1)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <ZAvatar text="XS" :size="1.5" />
    <ZAvatar text="SM" :size="2" />
    <ZAvatar text="MD" :size="2.5" />
    <ZAvatar text="LG" :size="3" />
    <ZAvatar text="XL" :size="4" />
  </ZFlex>
</template>
