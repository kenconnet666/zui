<script setup lang="ts">
import { ZTooltip, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZTooltip
        trigger="manual"
        :visible="visible"
        content="这是受控 Tooltip，由外部按钮控制显示/隐藏"
        placement="right"
      >
        <ZButton :size="0.875" variant="outlined">目标元素（manual 触发器）</ZButton>
      </ZTooltip>

      <ZButton :size="0.875" @click="visible = !visible">
        {{ visible ? '隐藏 Tooltip' : '显示 Tooltip' }}
      </ZButton>
    </ZFlex>

    <ZText :css="s => { s.color._textSecondary; s.fontSize._small }">
      当前状态：{{ visible ? '显示中' : '已隐藏' }}
    </ZText>
  </ZFlex>
</template>
