<script setup lang="ts">
import { ZDropdown, ZButton, ZFlex } from '@kenconnet666/zui-vue'

const items = [
  { key: 'view', label: '查看' },
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除', danger: true },
]

const placements = [
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'right-start',
  'right',
] as const
</script>

<template>
  <ZFlex :wrap="w => w.wrap" :gap="g => g._middle" :align="a => a.center">
    <ZFlex
      v-for="p in placements"
      :key="p"
      :direction="d => d.column"
      :align="a => a.center"
      :gap="g => g.px(4)"
    >
      <ZDropdown :items="items" :placement="p">
        <ZButton :size="0.75" variant="outlined">{{ p }}</ZButton>
      </ZDropdown>
    </ZFlex>
  </ZFlex>
</template>
