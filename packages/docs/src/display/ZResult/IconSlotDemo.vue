<script setup lang="ts">
import { ZResult, ZButton, ZIcon, BuiltinIcons } from '@kenconnet666/zui-vue'
</script>

<!--
  #icon slot 演示：比 icon prop 更灵活，可放任意内容（组合图标、emoji、自定义 HTML）。
  slot 优先级高于 icon prop。
-->
<template>
  <ZResult title="自定义 #icon slot" description="通过 #icon slot 可放置任意内容，不限于单一图标组件。">
    <template #icon>
      <!-- 叠加两个图标，用 relative/absolute 定位形成徽标效果 -->
      <span style="position: relative; display: inline-flex;">
        <ZIcon
          :component="BuiltinIcons.info"
          :size="4"
          :color="c => c._info"
        />
        <ZIcon
          :component="BuiltinIcons.success"
          :size="1.5"
          :color="c => c._success"
          :css="s => {
            s.position.absolute
            s.bottom.px(0)
            s.right.px(0)
            s.backgroundColor._bg
            s.borderRadius.pct(50)
          }"
        />
      </span>
    </template>
    <ZButton :size="0.875">了解详情</ZButton>
  </ZResult>
</template>
