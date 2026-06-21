<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ZForm, ZFormItem, ZInput, ZButton, ZFlex, ZText } from '@kenconnet666/zui-vue'

const formRef = ref()

const model = reactive({
  username: '',
  bio: '',
})

const rules = {
  username: [
    { required: true, message: '用户名不能为空' },
    { min: 2, max: 20, message: '长度 2–20 个字符' },
  ],
  bio: [{ max: 100, message: '简介不超过 100 字' }],
}

const log = ref('')

async function handleSubmit(): Promise<void> {
  try {
    await formRef.value?.validate()
    log.value = `提交成功：${JSON.stringify(model)}`
  } catch {
    log.value = '校验未通过'
  }
}

function handleReset(): void {
  formRef.value?.reset()
  Object.assign(model, { username: '', bio: '' })
  log.value = ''
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZForm ref="formRef" :model="model" :rules="rules">
      <!--
        #label 插槽：自定义 label 内容，可嵌套富文本/图标。
        sxLabel：为 label 节点追加 CSS / class / style。
      -->
      <ZFormItem
        prop="username"
        :required="true"
        :sx-label="{ css: s => { s.color._primary; s.fontWeight._semibold } }"
      >
        <template #label>
          用户名
          <ZText
            :css="s => { s.color._textSecondary; s.fontSize._small; s.marginLeft._tiny }"
          >（2–20 字）</ZText>
        </template>
        <ZInput v-model:value="model.username" placeholder="请输入用户名" />
      </ZFormItem>

      <!--
        #error 插槽：自定义错误信息渲染，scoped slot 提供 error 字符串。
        sxError：为错误节点追加 CSS。
        sxControl：控件包裹区。
      -->
      <ZFormItem
        prop="bio"
        label="个人简介"
        :sx-control="{ css: s => { s.gap._tiny } }"
        :sx-error="{ css: s => { s.fontStyle('italic') } }"
      >
        <ZInput v-model:value="model.bio" placeholder="最多 100 字" />
        <template #error="{ error }">
          ⚠ {{ error }}
        </template>
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
      :css="s => { s.color._textSecondary; s.fontSize._small }"
    >{{ log }}</ZText>
  </ZFlex>
</template>
