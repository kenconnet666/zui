<script setup lang="ts">
import { ZResult, ZFlex, ZButton } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :gap="g => g._large" :wrap="w => w.wrap" :align="a => a.flexStart">
    <ZResult
      title="操作成功"
      description="您的订单已提交，预计 3 个工作日内处理完成。"
      :color="c => c._success"
    >
      <ZButton :size="0.875">查看订单</ZButton>
    </ZResult>

    <ZResult
      title="请求失败"
      description="服务器繁忙，请稍后重试。"
      :color="c => c._danger"
    >
      <ZButton :size="0.875" :color="c => c._danger">重新提交</ZButton>
    </ZResult>

    <ZResult
      :not-found="true"
      title="页面不存在"
      description="您访问的页面已被删除或不存在。"
    >
      <ZButton :size="0.875">返回首页</ZButton>
    </ZResult>
  </ZFlex>
</template>
