<script setup lang="ts">
import { ZImage, ZFlex, ZText } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.flexStart">
    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.center">
      <ZImage
        src="/intentionally-broken-image.png"
        :width="10"
        :height="7.5"
      >
        <template #error>
          <ZText
            :css="
              s => {
                s.color._danger
                s.fontWeight._semibold
              }
            "
          >
            自定义错误占位
          </ZText>
        </template>
      </ZImage>
      <ZText>#error slot</ZText>
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._tiny" :align="a => a.center">
      <ZImage
        src="https://picsum.photos/seed/zui-eager/160/120"
        :width="10"
        :height="7.5"
        :lazy="false"
      />
      <ZText>lazy=false (eager 立即加载)</ZText>
    </ZFlex>
  </ZFlex>
</template>
