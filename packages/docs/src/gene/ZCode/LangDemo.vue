<script setup lang="ts">
import { ZCode, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.iem(0.75)">
    <!-- TypeScript -->
    <ZCode
      :inline="false"
      lang="ts"
      :code="`interface User { id: number; name: string }
const users: User[] = [{ id: 1, name: 'kc' }]`"
    />

    <!-- JSON -->
    <ZCode
      :inline="false"
      lang="json"
      :code="`{
  &quot;name&quot;: &quot;@kenconnet666/zui-vue&quot;,
  &quot;version&quot;: &quot;0.2.0&quot;
}`"
    />

    <!-- Bash -->
    <ZCode
      :inline="false"
      lang="bash"
      :code="`pnpm add @kenconnet666/zui-vue @kenconnet666/zui-core
pnpm add shiki        # 可选：启用 ZCode 语法高亮`"
    />

    <!-- CSS -->
    <ZCode
      :inline="false"
      lang="css"
      :code="`.btn {
  color: var(--zui-color-primary);
  padding: calc(0.5 * var(--zui-iem));
}`"
    />
  </ZFlex>
</template>
