<script setup lang="ts">
import { ZBackTop, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const scrollRef = ref<HTMLElement | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZText>向下滚动容器，右下角将出现回到顶部按钮（全局固定）。</ZText>
    <ZFlex
      ref="scrollRef"
      :direction="d => d.column"
      :gap="g => g._small"
      :css="s => { s.height.iem(12); s.overflowY.auto; s.borderWidth._thin; s.borderStyle.solid; s.borderColor._border; s.borderRadius._small; s.padding._middle }"
    >
      <ZText v-for="i in 20" :key="i" :css="s => { s.padding._tiny }">
        这是第 {{ i }} 行内容，向下滚动查看效果。
      </ZText>
    </ZFlex>
    <ZBackTop
      :visibility-height="100"
      :target="() => scrollRef as HTMLElement"
      :bottom="b => b.iem(1)"
      :right="r => r.iem(1)"
      :css="s => { s.position.absolute }"
    />
  </ZFlex>
</template>
