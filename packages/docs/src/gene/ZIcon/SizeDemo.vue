<script setup lang="ts">
import { ZFlex, ZIcon } from '@kenconnet666/zui-vue'
import { StarBorderOutlined as StarOutline } from '@vicons/material'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(1.5)" :align="(a) => a.center" :wrap="(w) => w.wrap">
    <ZFlex v-for="s in [0.75, 1, 1.25, 1.5, 2, 3]" :key="s"
      :direction="(d) => d.column" :gap="(g) => g.iem(0.5)" :align="(a) => a.center">
      <ZIcon :component="StarOutline" :size="s" />
      <code style="font-size: 11px">{{ s }}</code>
    </ZFlex>
  </ZFlex>
</template>
