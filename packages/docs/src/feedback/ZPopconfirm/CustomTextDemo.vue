<script setup lang="ts">
import { ZPopconfirm, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const lastAction = ref<string | null>(null)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._small" :wrap="w => w.wrap">
      <!-- 英文按钮文字 -->
      <ZPopconfirm
        title="Confirm this action?"
        description="This operation cannot be undone."
        ok-text="Yes"
        cancel-text="No"
        @confirm="lastAction = 'Confirmed!'"
        @cancel="lastAction = 'Cancelled'"
      >
        <ZButton :size="0.875">英文按钮（Yes / No）</ZButton>
      </ZPopconfirm>

      <!-- 危险操作强调 -->
      <ZPopconfirm
        title="立即清空日志？"
        description="系统日志将被永久删除。"
        ok-text="清空"
        cancel-text="保留"
        @confirm="lastAction = '日志已清空'"
        @cancel="lastAction = '操作已取消'"
      >
        <ZButton :size="0.875" :color="c => c._danger">危险操作</ZButton>
      </ZPopconfirm>

      <!-- 提交场景 -->
      <ZPopconfirm
        title="提交申请？"
        ok-text="提交"
        cancel-text="再看看"
        @confirm="lastAction = '申请已提交'"
        @cancel="lastAction = '继续编辑'"
      >
        <ZButton :size="0.875" variant="outlined">提交 / 再看看</ZButton>
      </ZPopconfirm>
    </ZFlex>

    <ZText
      v-if="lastAction !== null"
      :css="s => { s.color._textSecondary; s.fontSize._small }"
    >操作结果：{{ lastAction }}</ZText>
  </ZFlex>
</template>
