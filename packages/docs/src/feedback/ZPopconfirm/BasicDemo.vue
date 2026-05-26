<script setup lang="ts">
import { ZPopconfirm, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const log = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
      <ZPopconfirm
        title="确认删除？"
        description="删除后无法恢复，请谨慎操作。"
        @confirm="log = '已确认删除'"
        @cancel="log = '已取消'"
      >
        <ZButton :size="0.875" :color="c => c._danger">删除</ZButton>
      </ZPopconfirm>

      <ZPopconfirm
        title="提交确认"
        ok-text="提交"
        cancel-text="再想想"
        placement="right"
        @confirm="log = '已提交'"
        @cancel="log = '已取消'"
      >
        <ZButton :size="0.875">自定义文字</ZButton>
      </ZPopconfirm>

      <ZPopconfirm title="已禁用" :disabled="true" @confirm="log = '不应触发'">
        <ZButton :size="0.875" :variant="v => v._ghost">禁用确认框</ZButton>
      </ZPopconfirm>
    </ZFlex>

    <ZText v-if="log" :css="s => { s.color._textSecondary; s.fontSize._small }">操作结果：{{ log }}</ZText>
  </ZFlex>
</template>
