<script setup lang="ts">
import { ZAvatarGroup, ZFlex, ZText } from '@kenconnet666/zui-vue'

const users = [
  { text: 'A' },
  { text: 'B' },
  { text: 'C' },
  { text: 'D' },
  { text: 'E' },
  { text: 'F' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large" :align="a => a.flexStart">
    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.flexStart">
      <ZText>全部展示</ZText>
      <ZAvatarGroup :items="users" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.flexStart">
      <ZText>max=4 折叠 +2</ZText>
      <ZAvatarGroup :items="users" :max="4" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.flexStart">
      <ZText>大尺寸 + primary 余量色</ZText>
      <ZAvatarGroup :items="users" :max="3" :size="3" :color="c => c._primary" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.flexStart">
      <ZText>方形 + 更小重叠</ZText>
      <ZAvatarGroup :items="users" :max="4" square :overlap="0.18" />
    </ZFlex>
  </ZFlex>
</template>
