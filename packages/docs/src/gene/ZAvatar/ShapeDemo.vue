<script setup lang="ts">
import { ZAvatar, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(1)" :align="(a) => a.center">
    <!-- 圆形（默认） -->
    <ZAvatar text="圆" :color="(c) => c._primary" />
    <ZAvatar src="https://api.dicebear.com/9.x/thumbs/svg?seed=round" alt="round" />

    <!-- 方形 -->
    <ZAvatar text="方" :square="true" :color="(c) => c._success" />
    <ZAvatar
      src="https://api.dicebear.com/9.x/thumbs/svg?seed=square"
      alt="square"
      :square="true"
    />
  </ZFlex>
</template>
