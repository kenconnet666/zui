<script setup lang="ts">
import { ref } from 'vue'
import { ZInput, ZFlex, ZText } from '@kenconnet666/zui-vue'

const name = ref('')
const phone = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <!-- autocomplete、name 等原生属性透传 -->
    <ZInput
      v-model:value="name"
      placeholder="姓名（autocomplete=name）"
      :input-attrs="{ autocomplete: 'name', name: 'full-name' }"
    />

    <!-- inputmode 控制移动端软键盘类型 -->
    <ZInput
      v-model:value="phone"
      placeholder="手机号（inputmode=tel）"
      :input-attrs="{ inputmode: 'tel', autocomplete: 'tel' }"
    />

    <ZText
      :css="s => {
        s.color._textSecondary
        s.fontSize._small
      }"
    >inputAttrs 透传到内层 &lt;input&gt;，可注入 autocomplete / inputmode / aria-* 等原生属性。</ZText>
  </ZFlex>
</template>
