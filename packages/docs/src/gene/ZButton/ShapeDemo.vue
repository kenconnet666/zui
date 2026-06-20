<script setup lang="ts">
import { ZButton, ZFlex, ZIcon, BuiltinIcons } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- default: 默认圆角 -->
    <ZFlex :gap="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZButton shape="default">default</ZButton>
      <ZButton shape="default" variant="outlined">default</ZButton>
    </ZFlex>

    <!-- round: 全圆角胶囊 -->
    <ZFlex :gap="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZButton shape="round">round</ZButton>
      <ZButton shape="round" variant="outlined">round</ZButton>
    </ZFlex>

    <!-- circle: 等宽高圆形，只放图标 -->
    <ZFlex :gap="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZButton shape="circle">
        <ZIcon :component="BuiltinIcons.add" />
      </ZButton>
      <ZButton shape="circle" variant="outlined">
        <ZIcon :component="BuiltinIcons.close" />
      </ZButton>
      <ZButton shape="circle" variant="secondary">
        <ZIcon :component="BuiltinIcons.search" />
      </ZButton>
    </ZFlex>

    <!-- square: 等宽高方形（无圆角），只放图标 -->
    <ZFlex :gap="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZButton shape="square">
        <ZIcon :component="BuiltinIcons.add" />
      </ZButton>
      <ZButton shape="square" variant="outlined">
        <ZIcon :component="BuiltinIcons.close" />
      </ZButton>
      <ZButton shape="square" variant="secondary">
        <ZIcon :component="BuiltinIcons.search" />
      </ZButton>
    </ZFlex>
  </ZFlex>
</template>
