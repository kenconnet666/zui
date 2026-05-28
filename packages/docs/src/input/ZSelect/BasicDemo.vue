<script setup lang="ts">
import { ZSelect, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const city = ref<string | null>(null)
const tags = ref<string[]>([])

const cityOptions = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳', disabled: true },
  { value: 'hangzhou', label: '杭州' },
]

const tagOptions = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZSelect
        v-model:value="city"
        :options="cityOptions"
        placeholder="请选择城市"
        :clearable="true"
      />
      <ZText
        v-if="city"
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >已选：{{ city }}</ZText
      >
    </ZFlex>

    <ZSelect
      v-model:value="city"
      :options="cityOptions"
      placeholder="可搜索"
      :filterable="true"
      :clearable="true"
    />

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZSelect
        v-model:value="tags"
        :options="tagOptions"
        placeholder="多选框架"
        :multiple="true"
        :clearable="true"
      />
      <ZText
        v-if="tags.length"
        :css="
          s => {
            s.color._textSecondary
            s.fontSize._small
          }
        "
        >已选：{{ tags.join(', ') }}</ZText
      >
    </ZFlex>

    <ZSelect :options="cityOptions" placeholder="已禁用" :disabled="true" />
  </ZFlex>
</template>
