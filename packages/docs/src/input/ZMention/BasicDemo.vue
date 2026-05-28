<script setup lang="ts">
import { ZMention, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref('')
const members = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank']
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZMention
        v-model:value="value"
        :options="members"
        placeholder="输入 @ 触发成员提及..."
        :rows="3"
      />
      <ZText
        v-if="value"
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >内容：{{ value }}</ZText
      >
    </ZFlex>

    <ZMention :options="members" placeholder="已禁用" :disabled="true" :rows="2" />
  </ZFlex>
</template>
