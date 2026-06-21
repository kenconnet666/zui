<script setup lang="ts">
import { ZButtonGroup, ZButton, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large" :align="a => a.flexStart">
    <!-- 横向 outlined 组 -->
    <ZButtonGroup>
      <ZButton variant="outlined">左</ZButton>
      <ZButton variant="outlined">中</ZButton>
      <ZButton variant="outlined">右</ZButton>
    </ZButtonGroup>

    <!-- 分页风格 filled 组 -->
    <ZButtonGroup>
      <ZButton>上一页</ZButton>
      <ZButton>1</ZButton>
      <ZButton>2</ZButton>
      <ZButton>3</ZButton>
      <ZButton>下一页</ZButton>
    </ZButtonGroup>

    <!-- 纵向组 -->
    <ZButtonGroup vertical>
      <ZButton variant="outlined">顶部</ZButton>
      <ZButton variant="outlined">中部</ZButton>
      <ZButton variant="outlined">底部</ZButton>
    </ZButtonGroup>

    <!-- 间隔模式(attached=false) -->
    <ZButtonGroup :attached="false" :gap="0.5">
      <ZButton variant="filled">保存</ZButton>
      <ZButton variant="ghost">取消</ZButton>
    </ZButtonGroup>
  </ZFlex>
</template>
