<script setup lang="ts">
import { ZFlex, ZIcon } from '@kenconnet666/zui-vue'
import { RefreshOutlined as Reload } from '@vicons/material'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(1.5)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <ZFlex v-for="item in [
      { label: 'd.s(0.3) 最快', spin: (d: any) => d.s(0.3) },
      { label: 'd.s(0.8)', spin: (d: any) => d.s(0.8) },
      { label: 'd.s(1.5)', spin: (d: any) => d.s(1.5) },
      { label: 'd.s(3) 最慢', spin: (d: any) => d.s(3) },
      { label: 'd._middle token', spin: (d: any) => d._middle },
    ]" :key="item.label"
      :direction="(d) => d.column" :gap="(g) => g.iem(0.5)" :align="(a) => a.center">
      <ZIcon :component="Reload" :spin="item.spin" :size="1.5" />
      <code style="font-size: 11px">{{ item.label }}</code>
    </ZFlex>
  </ZFlex>
</template>
