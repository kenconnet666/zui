<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ZForm, ZFormItem, ZInput, ZButton, ZFlex, ZSelect } from '@kenconnet666/zui-vue'
import type { ZFormValidateTrigger } from '@kenconnet666/zui-vue'

// 全局触发时机
const trigger = ref<ZFormValidateTrigger>('change')
const triggerOptions = [
  { value: 'change', label: '输入时（change）' },
  { value: 'blur', label: '失焦时（blur）' },
  { value: 'submit', label: '提交时（submit）' },
]

const formRef = ref()

const model = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, message: '最少 3 个字符' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少 6 位' },
  ],
}

const log = ref('')

async function handleSubmit(): Promise<void> {
  try {
    await formRef.value?.validate()
    log.value = '提交成功'
  } catch {
    log.value = '校验失败，请检查表单'
  }
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <!-- 切换全局 validateTrigger -->
    <ZFlex :gap="g => g._small" :align="a => a.center">
      <ZSelect
        v-model:value="trigger"
        :options="triggerOptions"
        :css="s => { s.width.px(200) }"
      />
    </ZFlex>

    <!--
      validateTrigger 控制整表校验时机：
      - change：每次输入立即校验
      - blur：离开输入框时校验
      - submit：只在调用 validate() 时校验
    -->
    <ZForm ref="formRef" :model="model" :rules="rules" :validate-trigger="trigger">
      <ZFormItem prop="username" label="用户名" :required="true">
        <ZInput v-model:value="model.username" placeholder="至少 3 个字符" />
      </ZFormItem>
      <ZFormItem prop="password" label="密码" :required="true">
        <ZInput v-model:value="model.password" type="password" placeholder="至少 6 位" />
      </ZFormItem>
      <ZFormItem prop="">
        <ZButton :size="0.875" @click="handleSubmit">提交校验</ZButton>
      </ZFormItem>
    </ZForm>

    <!-- 日志输出 -->
    <span
      v-if="log"
      :style="{ fontSize: '13px', color: 'var(--color-textSecondary, #888)' }"
    >{{ log }}</span>
  </ZFlex>
</template>
