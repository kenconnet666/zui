<script setup lang="ts">
import { ZSwitch, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const value1 = ref(false)
const value2 = ref(true)
const loading = ref(false)

async function handleChange(v: boolean): Promise<void> {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  value2.value = v
  loading.value = false
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :gap="g => g._large" :align="a => a.center">
      <ZSwitch v-model:value="value1" />
      <ZSwitch v-model:value="value1" checked-label="开" unchecked-label="关" />
      <ZSwitch :value="true" :disabled="true" />
      <ZSwitch :value="false" :disabled="true" />
    </ZFlex>

    <ZFlex :gap="g => g._large" :align="a => a.center">
      <ZSwitch :size="2" v-model:value="value1" />
      <ZSwitch :size="2.5" v-model:value="value1" />
      <ZSwitch :size="3.5" v-model:value="value1" />
    </ZFlex>

    <ZFlex :gap="g => g._large" :align="a => a.center">
      <ZSwitch :value="value2" :loading="loading" @update:value="handleChange" />
      <ZText
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
      >
        {{ loading ? '切换中...' : value2 ? '已开启' : '已关闭' }}
      </ZText>
    </ZFlex>

    <ZText
      :css="
        s => {
          s.color._textSecondary
          s.fontSize._small
        }
      "
      >状态：{{ value1 ? '开' : '关' }}</ZText
    >
  </ZFlex>
</template>
