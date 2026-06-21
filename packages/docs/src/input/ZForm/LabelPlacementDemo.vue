<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ZForm, ZFormItem, ZInput, ZButton, ZFlex, ZSelect } from '@kenconnet666/zui-vue'

// 当前选中的 labelPlacement 值
const placement = ref<'left' | 'top'>('left')
const placementOptions = [
  { value: 'left', label: '左对齐（left）' },
  { value: 'top', label: '顶部（top）' },
]

const model = reactive({
  username: '',
  email: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email' as const, message: '邮箱格式不正确' },
  ],
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <!-- 切换 labelPlacement -->
    <ZFlex :gap="g => g._small" :align="a => a.center">
      <ZSelect
        v-model:value="placement"
        :options="placementOptions"
        :css="s => { s.width.px(200) }"
      />
    </ZFlex>

    <!-- 演示 labelPlacement 效果 -->
    <ZForm :model="model" :rules="rules" :label-placement="placement">
      <ZFormItem prop="username" label="用户名" :required="true">
        <ZInput v-model:value="model.username" placeholder="请输入用户名" />
      </ZFormItem>
      <ZFormItem
        prop="email"
        label="邮箱地址"
        :required="true"
        v-bind="placement === 'left' ? { labelWidth: 80 } : {}"
      >
        <ZInput v-model:value="model.email" type="email" placeholder="请输入邮箱" />
      </ZFormItem>
      <ZFormItem prop="">
        <ZButton :size="0.875">提交</ZButton>
      </ZFormItem>
    </ZForm>
  </ZFlex>
</template>
