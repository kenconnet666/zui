<script setup lang="ts">
import { ref } from 'vue'
import { ZInput, ZFlex, ZIcon, BuiltinIcons } from '@kenconnet666/zui-vue'

const v1 = ref('')
const v2 = ref('自定义前缀/后缀色')
const v3 = ref('有内容可清空')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- sxInput：自定义内层 input 字色 -->
    <ZInput
      v-model:value="v1"
      placeholder="sxInput 自定义 input 斜体"
      :sx-input="{
        css: s => {
          s.fontStyle('italic')
          s.color._primary
        },
      }"
    />

    <!-- sxPrefix / sxSuffix：自定义前后缀颜色 -->
    <ZInput v-model:value="v2" placeholder="前缀绿色 / 后缀主色">
      <template #prefix>
        <ZIcon
          :component="BuiltinIcons.search"
          :css="s => { s.color._success }"
        />
      </template>
      <template #suffix>
        <ZIcon
          :component="BuiltinIcons.chevronDown"
          :css="s => { s.color._primary }"
        />
      </template>
    </ZInput>

    <!-- sxClear：自定义清空按钮颜色 -->
    <ZInput
      v-model:value="v3"
      :clearable="true"
      placeholder="清空按钮用 sxClear 染色"
      :sx-clear="{
        css: s => {
          s.color._warning
        },
      }"
    />
  </ZFlex>
</template>
