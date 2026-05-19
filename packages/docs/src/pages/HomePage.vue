<script setup lang="ts">
/**
 * 首页 —— zui 一句话定位 + 跳转入口。
 */
</script>

<template>
  <article>
    <h1>zui</h1>
    <p>
      <strong>框架无关</strong>的 CSS-in-JS 工具库 monorepo：核心 `@kenconnet666/zui-core` 提供
      Chain + Theme + Variants 抽象，`@kenconnet666/zui-vue` 提供 ZConfigProvider 与 Vue 3 组件。
    </p>
    <h2>看演示</h2>
    <ul>
      <li><RouterLink to="/icon">ZIcon — 完整 12 token + 5 阶 depth + 双模式接入</RouterLink></li>
    </ul>
  </article>
</template>

<style scoped>
article {
  line-height: 1.7;
}
h1 {
  margin-top: 0;
}
h2 {
  margin-top: 32px;
}
a {
  color: #2563eb;
}
</style>
