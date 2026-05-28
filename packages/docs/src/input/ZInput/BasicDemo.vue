<script setup lang="ts">
import { ZInput, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value = ref('')
const password = ref('')
const search = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZInput v-model:value="value" placeholder="请输入用户名" :clearable="true" />
      <ZInput v-model:value="password" type="password" placeholder="请输入密码" />
      <ZInput
        v-model:value="search"
        type="search"
        placeholder="搜索..."
        :clearable="true"
        :show-count="true"
        :maxlength="50"
      />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZInput placeholder="尺寸 0.875" :size="0.875" />
      <ZInput placeholder="尺寸 1（默认）" />
      <ZInput placeholder="尺寸 1.25" :size="1.25" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZInput placeholder="只读" :readonly="true" value="只读内容" />
      <ZInput placeholder="已禁用" :disabled="true" value="禁用状态" />
    </ZFlex>

    <ZText
      v-if="value"
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >当前值：{{ value }}</ZText
    >
  </ZFlex>
</template>
