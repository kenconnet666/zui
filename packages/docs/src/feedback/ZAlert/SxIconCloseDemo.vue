<script setup lang="ts">
import { ref } from 'vue'
import { ZAlert, ZSpace } from '@kenconnet666/zui-vue'

const visible = ref(true)

function onClose(): void {
  visible.value = false
}
</script>

<template>
  <!-- 演示 sxIcon / sxClose / tag / close 事件 -->
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <!-- sxIcon：放大图标区域字号 -->
    <ZAlert
      :color="c => { c._primary }"
      title="sxIcon 定制图标区域"
      description="通过 sxIcon 可调整图标容器的字号、对齐等样式。"
      :sxIcon="{
        css: s => {
          s.fontSize._large
        },
      }"
    />

    <!-- sxClose + closable + @close -->
    <ZAlert
      v-if="visible"
      :color="c => { c._warning }"
      title="sxClose 定制关闭按钮 + @close 事件"
      description="通过 sxClose 覆盖关闭按钮样式；@close 事件触发后父组件控制 v-if 隐藏。"
      :closable="true"
      :sxClose="{
        css: s => {
          s.color._danger
        },
      }"
      @close="onClose"
    />
    <ZAlert
      v-else
      :color="c => { c._success }"
      title="警告已关闭"
      description="@close 事件触发，v-if 隐藏了上方警告框。"
    />

    <!-- tag 属性：渲染为 aside -->
    <ZAlert
      tag="aside"
      :color="c => { c._info }"
      title="tag='aside' 根元素"
      description="通过 tag prop 可将根元素渲染为任意 HTML 标签（如 aside、section）。"
    />
  </ZSpace>
</template>
