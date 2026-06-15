<script setup lang="ts">
import { ZBlockquote, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <ZBlockquote :color="c => c._primary"> primary 主色边条 —— 适合普通引用。 </ZBlockquote>
    <ZBlockquote :color="c => c._success">
      success 边条 —— 适合操作成功提示或正面引用。
    </ZBlockquote>
    <ZBlockquote :color="c => c._warning"> warning 边条 —— 适合警告说明或注意事项。 </ZBlockquote>
    <ZBlockquote :color="c => c._danger"> danger 边条 —— 适合错误信息或重要提示。 </ZBlockquote>
    <!-- 兜底 :css 自定义非 token 颜色 -->
    <ZBlockquote :css="s => s.borderLeftColor('#8b5cf6')">
      :css 兜底自定义 #8b5cf6 紫色边条（非 schema token 走 :css）。
    </ZBlockquote>
  </ZFlex>
</template>
