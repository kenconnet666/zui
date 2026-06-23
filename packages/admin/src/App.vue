<script lang="ts" setup>
/**
 * admin 根组件 —— 顶层 `ZBox` 注入 zui 主题（zui-vue 组件依赖此上下文获取 token）。
 * 后续接入暗色切换可参照 docs 的 `App.vue`（colorScheme + theme.extend）。
 */
import { ZBox, zuiLight } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZBox :theme="zuiLight">
    <RouterView />
  </ZBox>
</template>
