<script setup lang="ts">
import { ZAlert, ZFlex, ZButton } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZAlert
      :color="c => c._success"
      title="带操作按钮"
      description="default slot 渲染在描述下方,适合放操作按钮。"
      :sxBody="{
        css: s => {
          s.gap.iem(0.5)
          s.display.flex
          s.flexDirection.column
        },
      }"
    >
      <ZFlex :gap="g => g._small">
        <ZButton :size="0.75" :color="c => c._success">查看</ZButton>
        <ZButton :size="0.75" variant="ghost">忽略</ZButton>
      </ZFlex>
    </ZAlert>

    <ZAlert :size="0.75" :color="c => c._info" title="小尺寸 size=0.75" />
    <ZAlert :size="1.125" :color="c => c._success" title="大尺寸 size=1.125" />
  </ZFlex>
</template>
