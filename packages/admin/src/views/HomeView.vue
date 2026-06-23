<script lang="ts" setup>
/** 首页占位 —— 验证脚手架与后端对接地址。 */
const baseURL = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <div class="home">
    <h1>zadmin 管理后台</h1>
    <p>前端脚手架已就绪。</p>
    <p>后端 API base：<code>{{ baseURL }}</code></p>
  </div>
</template>

<style scoped>
.home {
  padding: 48px;
}
</style>
