<script setup lang="ts">
import { ZPopover, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const disabled = ref(true)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZPopover title="气泡内容" :disabled="disabled">
        <template #content>
          <ZText>禁用状态解除后才能看到这段内容。</ZText>
        </template>
        <ZButton :size="0.875" :disabled="disabled">{{ disabled ? '已禁用（不弹出）' : '点我弹出' }}</ZButton>
      </ZPopover>

      <ZButton :size="0.875" variant="outlined" @click="disabled = !disabled">
        {{ disabled ? '启用 Popover' : '禁用 Popover' }}
      </ZButton>
    </ZFlex>

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">
      disabled = {{ disabled }}
    </ZText>
  </ZFlex>
</template>
