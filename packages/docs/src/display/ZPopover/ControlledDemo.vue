<script setup lang="ts">
import { ZPopover, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZPopover
        v-model:visible="visible"
        trigger="manual"
        title="受控气泡"
        placement="right"
      >
        <template #content>
          <ZFlex :direction="d => d.column" :gap="g => g._small">
            <ZText>此 Popover 由外部状态控制，不响应内部点击触发。</ZText>
            <ZButton :size="0.75" @click="visible = false">关闭</ZButton>
          </ZFlex>
        </template>
        <ZButton :size="0.875" variant="outlined">触发器（manual 模式）</ZButton>
      </ZPopover>

      <ZButton :size="0.875" @click="visible = !visible">
        {{ visible ? '隐藏 Popover' : '显示 Popover' }}
      </ZButton>
    </ZFlex>

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">
      v-model:visible = {{ visible }}
    </ZText>
  </ZFlex>
</template>
