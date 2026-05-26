<script setup lang="ts">
import { ZSegmented, ZFlex } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const tab1 = ref<string | number>('day')
const tab2 = ref<string | number>('b')
const tab3 = ref<string | number>('medium')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="(g) => g.iem(1)">
    <!-- 基础 -->
    <ZSegmented
      v-model:value="tab1"
      :options="[
        { value: 'day', label: '日' },
        { value: 'week', label: '周' },
        { value: 'month', label: '月' },
        { value: 'year', label: '年' },
      ]"
    />

    <!-- 含禁用项 -->
    <ZSegmented
      v-model:value="tab2"
      :options="[
        { value: 'a', label: '选项 A' },
        { value: 'b', label: '选项 B' },
        { value: 'c', label: '选项 C（禁用）', disabled: true },
        { value: 'd', label: '选项 D' },
      ]"
    />

    <!-- size + block -->
    <ZSegmented
      v-model:value="tab3"
      :block="true"
      :size="0.875"
      :options="[
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ]"
    />
  </ZFlex>
</template>
