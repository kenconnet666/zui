<script setup lang="ts">
import { h } from 'vue'
import { ZResult, ZButton } from '@kenconnet666/zui-vue'

/** 自定义大图标 —— 简笔锁形 SVG。 */
const LockIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 64 64',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 3,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        width: '1em',
        height: '1em',
      },
      [
        h('rect', { x: 14, y: 28, width: 36, height: 28, rx: 4 }),
        h('path', { d: 'M22 28 V20 a10 10 0 0 1 20 0 V28' }),
      ],
    )
  },
}
</script>

<template>
  <ZResult
    :icon="LockIcon"
    :color="(c) => c._warning"
    title="账号已锁定"
    description="检测到异常登录,系统已临时冻结此账号。请通过邮箱验证后解锁。"
  >
    <ZButton :size="0.875">前往验证</ZButton>
  </ZResult>
</template>
