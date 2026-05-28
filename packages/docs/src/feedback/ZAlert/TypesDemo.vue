<script setup lang="ts">
import { ZAlert, ZFlex } from '@kenconnet666/zui-vue'
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZAlert title="信息提示" description="默认 _info,用于一般提示信息。" />
    <ZAlert :color="c => c._success" title="操作成功" description="数据已保存,变更将在下次同步时生效。" />
    <ZAlert :color="c => c._warning" title="警告" description="当前环境为测试环境,请勿提交生产数据。" />
    <ZAlert :color="c => c._danger" title="错误" description="请求失败,服务器返回 500,请稍后重试。" />
  </ZFlex>
</template>
