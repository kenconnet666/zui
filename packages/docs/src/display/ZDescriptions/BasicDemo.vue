<script setup lang="ts">
import { ZDescriptions, ZFlex } from '@kenconnet666/zui-vue'

const items = [
  { label: '用户名', value: 'admin' },
  { label: '手机号', value: '138-0000-0000' },
  { label: '邮箱', value: 'admin@example.com' },
  { label: '注册时间', value: '2026-01-15 10:30:00' },
  { label: '状态', value: '正常' },
  { label: '角色', value: '超级管理员' },
]

const borderedItems = [
  { label: '产品名称', value: 'ZUI 组件库' },
  { label: '版本', value: '0.5.0' },
  { label: '协议', value: 'MIT' },
  { label: '作者', value: 'kenconnet666' },
  { label: '描述', value: '基于 CSS-in-JS 的 Vue 3 组件库', span: 2 },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZDescriptions title="用户信息" :items="items" />

    <ZDescriptions title="项目信息（带边框）" :items="borderedItems" :bordered="true" />

    <ZDescriptions :items="items" :column="2" />
  </ZFlex>
</template>
