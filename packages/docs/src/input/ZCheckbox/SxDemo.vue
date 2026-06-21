<script setup lang="ts">
import { ref } from 'vue'
import { ZCheckbox, ZFlex } from '@kenconnet666/zui-vue'

const v1 = ref(true)
const v2 = ref(false)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- sxBox：自定义方框圆角与颜色 -->
    <ZCheckbox
      v-model:checked="v1"
      label="sxBox 圆形方框"
      :sx-box="{
        css: s => {
          s.borderRadius.px(50)
        },
      }"
    />

    <!-- sxLabel：自定义文字标签样式 -->
    <ZCheckbox
      v-model:checked="v2"
      label="sxLabel 标签加粗 + 主色"
      :sx-label="{
        css: s => {
          s.fontWeight._bold
          s.color._primary
        },
      }"
    />

    <!-- 同时使用 sxBox + sxLabel -->
    <ZCheckbox
      v-model:checked="v1"
      label="sxBox + sxLabel 组合定制"
      :sx-box="{
        css: s => {
          s.borderRadius.px(4)
          s.width.px(20)
          s.height.px(20)
        },
      }"
      :sx-label="{
        css: s => {
          s.fontSize._large
        },
      }"
    />
  </ZFlex>
</template>
