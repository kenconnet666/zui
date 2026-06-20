<script setup lang="ts">
import { ZDrawer, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

type Placement = 'left' | 'top' | 'right' | 'bottom'

const visible = ref(false)
const placement = ref<Placement>('right')

function open(p: Placement) {
  placement.value = p
  visible.value = true
}
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" variant="ghost" @click="open('left')">左侧</ZButton>
    <ZButton :size="0.875" variant="ghost" @click="open('top')">顶部</ZButton>
    <ZButton :size="0.875" @click="open('right')">右侧（默认）</ZButton>
    <ZButton :size="0.875" variant="ghost" @click="open('bottom')">底部</ZButton>
  </ZFlex>

  <ZDrawer
    v-model:visible="visible"
    :placement="placement"
    :title="`${placement} 方向抽屉`"
  >
    <ZText>当前 placement：<strong>{{ placement }}</strong></ZText>
    <ZText>抽屉从 {{ placement }} 侧滑入，left/right 控制宽度，top/bottom 控制高度。</ZText>
  </ZDrawer>
</template>
