<script setup lang="ts">
import { ZAlert, ZSpace } from '@kenconnet666/zui-vue'
</script>

<template>
  <!-- 演示 #icon / #title / #description 三个具名插槽 -->
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <!-- #icon 覆盖内置图标 -->
    <ZAlert :color="c => { c._success }">
      <template #icon>🌟</template>
      <template #title>自定义 #icon 插槽</template>
      <template #description>用任意内容替换左侧默认内置图标。</template>
    </ZAlert>

    <!-- #title 自定义富文本标题 -->
    <ZAlert :color="c => { c._warning }">
      <template #title>
        <span>
          <strong>自定义 #title 插槽</strong>
          <code style="font-size: 0.8em; margin-left: 8px;">可含任意元素</code>
        </span>
      </template>
      <template #description>通过 #title slot 可放置任意富文本内容。</template>
    </ZAlert>

    <!-- #description 自定义描述 -->
    <ZAlert :color="c => { c._info }" title="标准 title prop">
      <template #description>
        <span>
          #description 插槽也支持 <em>富文本</em>，优先级高于 description prop。
        </span>
      </template>
    </ZAlert>
  </ZSpace>
</template>
