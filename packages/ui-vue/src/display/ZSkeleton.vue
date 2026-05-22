<script lang="ts">
/**
 * `ZSkeleton` —— 骨架屏。
 *
 * 三种形态(可组合):
 * - **配置式**:`rows: number` 多行文本骨架,`avatar: boolean` 加左侧头像圆,`title: boolean` 加顶部标题条
 * - **slot 式**:用户在 default slot 自己用 `<ZSkeletonRect>` / `<ZSkeletonCircle>` 拼,但本 v1 暂不引入子组件,只走配置式
 *
 * **API**:
 * - `loading?: boolean` —— true 显骨架,false 显 default slot(数据加载完后切换)
 * - `rows?: number` —— 文本行数,默认 3
 * - `avatar?: boolean` —— 左侧头像圆,默认 false
 * - `title?: boolean` —— 顶部加粗标题条,默认 false
 * - `animated?: boolean` —— 闪烁动画,默认 true
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZSkeletonProps {
  loading?: boolean
  rows?: number
  avatar?: boolean
  title?: boolean
  animated?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZSkeletonProps>(), {
  loading: true,
  rows: 3,
  avatar: false,
  title: false,
  animated: true,
})

const theme = useZTheme()

const SHIMMER_STYLE_ID = 'zui-skeleton-shimmer'
// 全局注入 keyframes(一次性)
if (typeof document !== 'undefined' && !document.getElementById(SHIMMER_STYLE_ID)) {
  const style = document.createElement('style')
  style.id = SHIMMER_STYLE_ID
  style.textContent = `
@keyframes zui-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`
  document.head.appendChild(style)
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.gap._middle
    s.alignItems.flexStart
    props.css?.(s)
  }),
)

const avatarClass = computed(() =>
  icss(theme.value, (s) => {
    s._prop('width', 'calc(2.5 * var(--zui-iem, 16px))')
    s._prop('height', 'calc(2.5 * var(--zui-iem, 16px))')
    s.borderRadius._full
    s.backgroundColor._bgMuted
    s.flexShrink(0)
    if (props.animated) applyShimmer(s)
  }),
)

const linesContainerClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
  }),
)

const titleBarClass = computed(() =>
  icss(theme.value, (s) => {
    s._prop('height', 'calc(1.25 * var(--zui-iem, 16px))')
    s._prop('width', '40%')
    s.borderRadius._tiny
    s.backgroundColor._bgMuted
    s.marginBottom._tiny
    if (props.animated) applyShimmer(s)
  }),
)

function rowClass(isLast: boolean): string {
  return icss(theme.value, (s) => {
    s._prop('height', 'calc(0.875 * var(--zui-iem, 16px))')
    s._prop('width', isLast ? '60%' : '100%')
    s.borderRadius._tiny
    s.backgroundColor._bgMuted
    if (props.animated) applyShimmer(s)
  })
}

function applyShimmer(s: Chain<ZuiSchema>): void {
  s._prop(
    'backgroundImage',
    'linear-gradient(90deg, rgba(0,0,0,0) 25%, rgba(255,255,255,0.4) 50%, rgba(0,0,0,0) 75%)',
  )
  s._prop('backgroundSize', '200% 100%')
  s._prop('animation', 'zui-skeleton-shimmer 1.4s ease-in-out infinite')
}
</script>

<template>
  <div v-if="loading" :class="rootClass" role="status" aria-busy="true">
    <div v-if="avatar" :class="avatarClass" />
    <div :class="linesContainerClass">
      <div v-if="title" :class="titleBarClass" />
      <div v-for="i in rows" :key="i" :class="rowClass(i === rows && rows > 1)" />
    </div>
  </div>
  <slot v-else />
</template>
