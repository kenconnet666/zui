<script setup lang="ts">
import { ZDrawer, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const rightVisible = ref(false)
const bottomVisible = ref(false)
</script>

<template>
  <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
    <ZButton :size="0.875" @click="rightVisible = true">右侧抽屉（默认）</ZButton>
    <ZButton :size="0.875" :variant="v => v._ghost" @click="bottomVisible = true">底部抽屉</ZButton>
  </ZFlex>

  <ZDrawer v-model:visible="rightVisible" title="右侧抽屉" :size="20">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>这是右侧抽屉的内容区域。</ZText>
      <ZText>可以在这里放置表单、详情信息等。</ZText>
    </ZFlex>
    <template #foot>
      <ZFlex :justify="j => j.flexEnd" :gap="g => g._small">
        <ZButton :size="0.875" :variant="v => v._ghost" @click="rightVisible = false">取消</ZButton>
        <ZButton :size="0.875" @click="rightVisible = false">保存</ZButton>
      </ZFlex>
    </template>
  </ZDrawer>

  <ZDrawer v-model:visible="bottomVisible" title="底部抽屉" placement="bottom" :size="12">
    <ZText>底部抽屉，常用于移动端操作面板。</ZText>
  </ZDrawer>
</template>
