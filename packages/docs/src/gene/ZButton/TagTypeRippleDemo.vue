<script setup lang="ts">
import { ref } from 'vue'
import { ZButton, ZSpace } from '@kenconnet666/zui-vue'

/** 演示 click + loading 交互：点击后进入 loading，1.5s 后恢复。 */
const loading = ref(false)

function handleSubmit(): void {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
</script>

<template>
  <!-- 演示 tag 多态 / type=submit|reset / ripple 开关 / click+loading 交互 -->
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <!-- tag 多态根元素 -->
    <ZSpace :size="g => g._small">
      <ZButton tag="a" href="#" variant="link">tag="a" 链接</ZButton>
      <ZButton tag="div" variant="secondary">tag="div" 分发器</ZButton>
      <ZButton tag="button" variant="outlined">tag="button"（默认）</ZButton>
    </ZSpace>

    <!-- type=submit / reset -->
    <form @submit.prevent @reset.prevent>
      <ZSpace :size="g => g._small">
        <ZButton type="submit" variant="filled">type="submit"</ZButton>
        <ZButton type="reset" variant="outlined">type="reset"</ZButton>
        <ZButton type="button" variant="ghost">type="button"（默认）</ZButton>
      </ZSpace>
    </form>

    <!-- ripple 开关 -->
    <ZSpace :size="g => g._small">
      <ZButton :ripple="true">ripple=true（默认）</ZButton>
      <ZButton :ripple="false" variant="secondary">ripple=false 无波纹</ZButton>
    </ZSpace>

    <!-- click + loading 交互 -->
    <ZButton
      :loading="loading"
      variant="filled"
      :color="c => { c._success }"
      @click="handleSubmit"
    >
      {{ loading ? '提交中...' : '点击触发 loading（1.5s）' }}
    </ZButton>
  </ZSpace>
</template>
