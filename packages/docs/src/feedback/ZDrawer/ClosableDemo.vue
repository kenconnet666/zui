<script setup lang="ts">
import { ZDrawer, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 是否显示抽屉 */
const visible = ref(false)
/** 记录最近一次触发的事件名 */
const lastEvent = ref('')

/** 关闭按钮 / ESC 触发 */
function onClose() {
  lastEvent.value = 'close'
}

/** 点击遮罩触发（maskClosable=true 时同时关闭） */
function onMaskClick() {
  lastEvent.value = 'mask-click'
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZButton :size="0.875" @click="visible = true">打开（点遮罩或 × 可关闭）</ZButton>
    <ZText v-if="lastEvent">最近触发事件：{{ lastEvent }}</ZText>
  </ZFlex>

  <!-- closable=true（默认）；maskClosable=true（默认）；监听 close / mask-click 事件 -->
  <ZDrawer
    v-model:visible="visible"
    title="closable & maskClosable"
    :closable="true"
    :mask-closable="true"
    @close="onClose"
    @mask-click="onMaskClick"
  >
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>点右上角 × 按钮 → 触发 <strong>close</strong> 事件。</ZText>
      <ZText>点遮罩区域 → 触发 <strong>mask-click</strong> 事件，同时关闭。</ZText>
    </ZFlex>
  </ZDrawer>
</template>
