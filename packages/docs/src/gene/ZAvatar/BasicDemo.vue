<script setup lang="ts">
import { ZAvatar, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="(g) => g.iem(1)" :wrap="(w) => w.wrap" :align="(a) => a.center">
    <!-- 图片 -->
    <ZAvatar src="https://api.dicebear.com/9.x/thumbs/svg?seed=zui" alt="user" />

    <!-- 图片加载失败 → 文字 fallback -->
    <ZAvatar src="https://broken-url.example.com/404.jpg" text="ZU" />

    <!-- 纯文字 -->
    <ZAvatar text="KC" :color="(c) => c._primary" />

    <!-- 大小 -->
    <ZAvatar text="S" :size="1.5" />
    <ZAvatar text="M" :size="2.5" />
    <ZAvatar text="L" :size="4" />

    <!-- 方形 -->
    <ZAvatar text="方" :square="true" :color="(c) => c._success" />

    <!-- slot 自定义内容 -->
    <ZAvatar :size="2.5" :color="(c) => c._warning">
      <span style="font-size: 1.2em">🤖</span>
    </ZAvatar>
  </ZFlex>
</template>
