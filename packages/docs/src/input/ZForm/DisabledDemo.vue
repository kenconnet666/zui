<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ZForm, ZFormItem, ZInput, ZButton, ZFlex, ZSelect } from '@kenconnet666/zui-vue'

// 整表禁用开关
const disabled = ref(true)

const model = reactive({
  username: 'alice',
  email: 'alice@example.com',
  role: 'admin',
})

const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑' },
  { value: 'viewer', label: '访客' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <!-- 切换禁用状态 -->
    <ZFlex :gap="g => g._small" :align="a => a.center">
      <ZButton
        :size="0.875"
        :variant="disabled ? 'filled' : 'outlined'"
        @click="disabled = !disabled"
      >
        {{ disabled ? '点击启用表单' : '点击禁用表单' }}
      </ZButton>
    </ZFlex>

    <!--
      ZForm :disabled 整表禁用：子组件（ZInput/ZSelect 等）通过 inject 读取并应用 disabled 状态。
    -->
    <ZForm :model="model" :disabled="disabled">
      <ZFormItem prop="username" label="用户名">
        <ZInput v-model:value="model.username" :disabled="disabled" />
      </ZFormItem>
      <ZFormItem prop="email" label="邮箱">
        <ZInput v-model:value="model.email" type="email" :disabled="disabled" />
      </ZFormItem>
      <ZFormItem prop="role" label="角色">
        <ZSelect v-model:value="model.role" :options="roleOptions" :disabled="disabled" />
      </ZFormItem>
      <ZFormItem prop="">
        <ZButton :size="0.875" :disabled="disabled">提交</ZButton>
      </ZFormItem>
    </ZForm>
  </ZFlex>
</template>
