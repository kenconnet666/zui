<script setup lang="ts">
import { ZFlex, ZIcon } from '@kenconnet666/zui-vue'
import { FavoriteBorderOutlined as HeartOutline } from '@vicons/material'
</script>

<template>
  <ZFlex :gap="g => g.iem(1)" :wrap="w => w.wrap" :align="a => a.center">
    <ZFlex
      v-for="item in [
        { label: 'currentColor', color: (c: any) => c.currentColor },
        { label: '_primary', color: (c: any) => c._primary },
        { label: '_success', color: (c: any) => c._success },
        { label: '_warning', color: (c: any) => c._warning },
        { label: '_danger', color: (c: any) => c._danger },
        { label: '_info', color: (c: any) => c._info },
        { label: '_primary.alpha(50)', color: (c: any) => c._primary.alpha(50) },
        { label: '_danger.darken(20)', color: (c: any) => c._danger.darken(20) },
      ]"
      :key="item.label"
      :direction="d => d.column"
      :gap="g => g.iem(0.375)"
      :align="a => a.center"
    >
      <ZIcon :component="HeartOutline" :color="item.color" :size="1.5" />
      <code style="font-size: 11px; white-space: nowrap">{{ item.label }}</code>
    </ZFlex>
  </ZFlex>
</template>
