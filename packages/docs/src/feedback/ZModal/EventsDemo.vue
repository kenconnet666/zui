<script setup lang="ts">
import { ZModal, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 是否显示对话框 */
const visible = ref(false)
/** 事件日志（最多显示最近 5 条） */
const eventLog = ref<string[]>([])

/** 关闭按钮 / ESC 触发 */
function onClose() {
  pushLog('close')
}

/** 点击遮罩触发 */
function onMaskClick() {
  pushLog('mask-click')
}

/** 追加日志，最多保留 5 条 */
function pushLog(name: string) {
  eventLog.value.unshift(`[${new Date().toLocaleTimeString()}] ${name}`)
  if (eventLog.value.length > 5) eventLog.value.pop()
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._small">
    <ZButton :size="0.875" @click="visible = true">打开（监听 close / mask-click）</ZButton>
    <ZFlex v-if="eventLog.length" :direction="d => d.column" :gap="g => g._tiny">
      <ZText v-for="log in eventLog" :key="log" :size="0.75">{{ log }}</ZText>
    </ZFlex>
  </ZFlex>

  <!-- 同时监听 close（按钮/ESC）与 mask-click（遮罩点击）两个事件 -->
  <ZModal
    v-model:visible="visible"
    title="事件监听"
    @close="onClose"
    @mask-click="onMaskClick"
  >
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>点击右上角 × 或按 ESC → <strong>close</strong> 事件。</ZText>
      <ZText>点击对话框外遮罩区域 → <strong>mask-click</strong> 事件，同时关闭。</ZText>
    </ZFlex>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd">
        <ZButton :size="0.875" variant="ghost" @click="visible = false">手动关闭</ZButton>
      </ZFlex>
    </template>
  </ZModal>
</template>
