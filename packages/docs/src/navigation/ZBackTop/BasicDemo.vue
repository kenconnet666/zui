<script setup lang="ts">
import { ZBackTop, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

// 注意:ref 必须放在原生元素上才能拿到 DOM(放组件上拿到的是实例)。
const scrollRef = ref<HTMLElement | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small" :css="s => s.position.relative">
    <ZText>向下滚动容器，右下角将出现回到顶部按钮（全局固定）。</ZText>
    <div
      ref="scrollRef"
      style="
        height: 192px;
        overflow-y: auto;
        border: 1px solid rgba(128, 128, 128, 0.3);
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      "
    >
      <ZText v-for="i in 20" :key="i">这是第 {{ i }} 行内容，向下滚动查看效果。</ZText>
    </div>
    <ZBackTop
      :visibility-height="100"
      :target="() => scrollRef!"
      :bottom="b => b.px(16)"
      :right="r => r.px(16)"
      :css="s => s.position.absolute"
    />
  </ZFlex>
</template>
