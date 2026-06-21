<script setup lang="ts">
import { ZSwitch, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

/**
 * 演示 sxRail / sxThumb 定制：
 * - sxRail 控制轨道的额外样式（覆盖背景色等）
 * - sxThumb 控制滑块的额外样式（覆盖颜色、阴影等）
 */
const v1 = ref(true)
const v2 = ref(false)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>默认样式</ZText>
      <ZSwitch v-model:value="v1" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>sxRail 自定义轨道（开启时绿色背景）</ZText>
      <ZSwitch
        v-model:value="v1"
        :sx-rail="{ css: s => { if (v1) s.backgroundColor._success } }"
      />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>sxThumb 自定义滑块（黄色滑块）</ZText>
      <ZSwitch
        v-model:value="v2"
        :sx-thumb="{ css: s => { s.backgroundColor._warning } }"
      />
    </ZFlex>
  </ZFlex>
</template>
