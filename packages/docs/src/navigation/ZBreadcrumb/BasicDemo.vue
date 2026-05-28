<script setup lang="ts">
import { ZBreadcrumb, ZFlex } from '@kenconnet666/zui-vue'

const items1 = [
  { label: '首页', href: '#' },
  { label: '组件', href: '#' },
  { label: 'ZBreadcrumb 面包屑' },
]

const items2 = [
  { label: 'Home' },
  { label: 'Components' },
  { label: 'Navigation' },
  { label: 'Breadcrumb' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZBreadcrumb :items="items1" />

    <ZBreadcrumb :items="items2" separator=">" />

    <ZBreadcrumb :items="items1" separator="/" />
  </ZFlex>
</template>
