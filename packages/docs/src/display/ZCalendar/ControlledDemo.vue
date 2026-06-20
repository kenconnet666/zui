<script setup lang="ts">
/**
 * ZCalendar — 受控模式演示。
 * 用 v-model:value 绑定日期，下方实时回显所选值。
 */
import { ZCalendar, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const date = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <ZCalendar v-model:value="date" />
    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
    >
      已选：{{ date || '未选择' }}
    </ZText>
  </ZFlex>
</template>
