<script setup lang="ts">
import { ZDescriptions, ZFlex } from '@kenconnet666/zui-vue'

const items = [
  { label: '姓名', value: '张三' },
  { label: '年龄', value: 28 },
  { label: '部门', value: '工程技术部' },
  { label: '职位', value: '高级工程师' },
  { label: '入职时间', value: '2022-03-15' },
  { label: '工号', value: 'EMP-20220315' },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <!-- 方式一：title prop -->
    <ZDescriptions title="员工信息（prop 标题）" :items="items" :bordered="true" />

    <!-- 方式二：#title slot（可自定义富文本） -->
    <ZDescriptions :items="items" :bordered="true">
      <template #title>
        员工信息
        <span
          style="
            margin-left: 8px;
            font-size: 12px;
            font-weight: normal;
            opacity: 0.6;
          "
        >
          slot 自定义标题
        </span>
      </template>
    </ZDescriptions>
  </ZFlex>
</template>
