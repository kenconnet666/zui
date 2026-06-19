<script setup lang="ts">
import { ZImage, ZFlex, ZText } from '@kenconnet666/zui-vue'

const fits = ['fill', 'contain', 'cover', 'none', 'scaleDown'] as const
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap">
    <ZFlex
      v-for="fit in fits"
      :key="fit"
      :direction="d => d.column"
      :gap="g => g._tiny"
      :align="a => a.center"
    >
      <ZImage
        src="https://picsum.photos/seed/zui-fit/200/100"
        :alt="fit"
        :width="7.5"
        :height="7.5"
        :fit="f => f[fit]"
      />
      <ZText>{{ fit }}</ZText>
    </ZFlex>
  </ZFlex>
</template>
