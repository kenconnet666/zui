<script setup lang="ts">
import { ZCard, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <!-- 演示 tag 属性 / 极简无 header 场景 / #head 旧别名 vs #header 新约定 -->
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <!-- 极简无 header：只有默认 body slot -->
    <ZCard>
      <p>极简卡片 —— 不传 title / 不用 #header，只渲染 body 区域。</p>
      <p style="margin-top: 8px;">适合纯内容容器场景，无顶部分割线。</p>
    </ZCard>

    <!-- tag 属性：渲染为 article -->
    <ZCard tag="article" title="tag='article' 卡片">
      <p>根元素被渲染为 &lt;article&gt; 标签，语义更准确。</p>
    </ZCard>

    <!-- #header 新约定（推荐） -->
    <ZCard>
      <template #header>
        <span><strong>#header</strong> 插槽（推荐，优先级高于 title prop）</span>
      </template>
      <p>使用 <code>#header</code> 插槽自定义头部内容。</p>
    </ZCard>

    <!-- #head 旧别名（兼容，将在下版本删除） -->
    <ZCard>
      <template #head>
        <span><strong>#head</strong>（旧别名，下版本将删除，请迁移到 #header）</span>
      </template>
      <p><code>#head</code> 是 <code>#header</code> 的旧别名，当前版本仍兼容。</p>
    </ZCard>
  </ZSpace>
</template>
