<script setup lang="ts">
import { ZDatePicker, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/**
 * 演示 css prop 定制根元素样式：
 * - css 接收 Chain 回调，可覆盖 border-color、border-radius、font-weight 等。
 */
const value = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>默认样式</ZText>
      <ZDatePicker v-model:value="value" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>css 自定义：圆角加大 + 主色边框</ZText>
      <ZDatePicker
        v-model:value="value"
        :css="
          s => {
            s.borderRadius._large
            s.borderColor._primary
          }
        "
      />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>css 自定义：宽度固定 200px + 方形圆角</ZText>
      <ZDatePicker
        v-model:value="value"
        :css="
          s => {
            s.width.px(200)
            s.borderRadius.px(2)
          }
        "
      />
    </ZFlex>
  </ZFlex>
</template>
