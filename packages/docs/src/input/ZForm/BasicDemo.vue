<script setup lang="ts">
import { ZForm, ZFormItem, ZInput, ZSelect, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const formRef = ref()

const model = ref({
  username: '',
  email: '',
  role: null as string | null,
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 3, message: '最少 3 个字符', trigger: 'change' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'change' },
    { type: 'email' as const, message: '邮箱格式不正确', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑' },
  { value: 'viewer', label: '访客' },
]

const log = ref('')

async function handleSubmit(): Promise<void> {
  try {
    await formRef.value?.validate()
    log.value = `提交成功：${JSON.stringify(model.value)}`
  } catch {
    log.value = '校验失败，请检查表单'
  }
}

function handleReset(): void {
  formRef.value?.reset()
  log.value = ''
  model.value = { username: '', email: '', role: null }
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZForm ref="formRef" :model="model" :rules="rules">
      <ZFormItem prop="username" label="用户名" :required="true">
        <ZInput v-model:value="model.username" placeholder="至少 3 个字符" />
      </ZFormItem>
      <ZFormItem prop="email" label="邮箱" :required="true">
        <ZInput v-model:value="model.email" type="email" placeholder="example@mail.com" />
      </ZFormItem>
      <ZFormItem prop="role" label="角色" :required="true">
        <ZSelect v-model:value="model.role" :options="roleOptions" placeholder="请选择" />
      </ZFormItem>
      <ZFormItem prop="">
        <ZFlex :gap="g => g._small">
          <ZButton :size="0.875" @click="handleSubmit">提交</ZButton>
          <ZButton :size="0.875" variant="ghost" @click="handleReset">重置</ZButton>
        </ZFlex>
      </ZFormItem>
    </ZForm>

    <ZText
      v-if="log"
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >{{ log }}</ZText
    >
  </ZFlex>
</template>
