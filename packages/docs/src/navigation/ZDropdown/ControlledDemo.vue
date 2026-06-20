<script setup lang="ts">
import { ZDropdown, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/** 受控可见状态 */
const visible = ref(false)
const lastSelected = ref('')

const items = [
  { key: 'copy', label: '复制链接' },
  { key: 'share', label: '分享' },
  { key: 'archive', label: '归档', danger: true },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZFlex :gap="g => g._small" :align="a => a.center">
      <!-- 外部按钮控制：toggle visible -->
      <ZButton :size="0.875" @click="visible = !visible">
        {{ visible ? '关闭菜单' : '打开菜单' }}
      </ZButton>

      <!-- manual trigger + v-model:visible -->
      <ZDropdown
        v-model:visible="visible"
        trigger="manual"
        :items="items"
        @select="key => { lastSelected = key; visible = false }"
      >
        <!-- trigger 插槽仍然存在，用作菜单定位锚点 -->
        <ZButton :size="0.875" variant="outlined">锚点（manual 触发）</ZButton>
      </ZDropdown>
    </ZFlex>

    <ZText
      :css="
        s => {
          s.fontSize._small
          s.color._textSecondary
        }
      "
    >
      visible: {{ visible }}　已选：{{ lastSelected || '—' }}
    </ZText>
  </ZFlex>
</template>
