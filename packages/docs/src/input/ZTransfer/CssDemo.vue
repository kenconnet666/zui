<script setup lang="ts">
import { ZTransfer } from '@kenconnet666/zui-vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const dataSource = [
  { key: 'ts', label: 'TypeScript' },
  { key: 'js', label: 'JavaScript' },
  { key: 'py', label: 'Python' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'java', label: 'Java' },
]

const targetKeys = ref<string[]>(['ts', 'go'])

/**
 * 通过 css prop（Chain 回调）定制根容器样式：
 * 这里加一圈 dashed 边框来直观展示根元素范围。
 */
function customCss(s: Chain<ZuiSchema>): void {
  s.padding._small
  s.borderWidth._thin
  s.borderStyle.dashed
  s.borderColor._primary
  s.borderRadius._small
}
</script>

<template>
  <!--
    css prop 接受 (s: Chain) => void 回调，可对根元素叠加任意样式，
    内部已调 props.css?.(s)，不会覆盖组件基础样式。
  -->
  <ZTransfer
    :data-source="dataSource"
    v-model:target-keys="targetKeys"
    :titles="['可选语言', '已选语言']"
    :css="customCss"
  />
</template>
