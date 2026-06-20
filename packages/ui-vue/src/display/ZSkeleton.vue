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
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(纯 px,1 单位 = 16px):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ ZSkeleton root                                   │   flex / gap _middle / alignFlexStart
 *   │                                                  │
 *   │  ┌────────┐  ┌──────────────────────────────┐    │
 *   │  │ avatar │  │ lines container              │    │   avatar(条件渲染):
 *   │  │  40px  │  │  ┌────────────────────────┐  │    │     width/height 40px(= 2.5 × 16px)
 *   │  │ 正圆   │  │  │ title bar(条件)      │  │    │     border-radius _full
 *   │  └────────┘  │  │  height 20px(= 1.25 × 16px)│  │    bg _bgMuted
 *   │              │  │  width 40%             │  │    │
 *   │              │  └────────────────────────┘  │    │   text rows:
 *   │              │  ┌────────────────────────┐  │    │     height 14px(= 0.875 × 16px)
 *   │              │  │ row 1...n              │  │    │     最后一行 width 60%
 *   │              │  │  (最后行 width 60%)    │  │    │     其它 width 100%
 *   │              │  └────────────────────────┘  │    │
 *   │              └──────────────────────────────┘    │
 *   └──────────────────────────────────────────────────┘
 *
 * animated=true → 给所有骨架元素叠 opacity 脉冲动画(1.5s 循环,主题无关)。
 */
const props = withDefaults(defineProps<ZSkeletonProps>(), {
  loading: true,
  rows: 3,
  avatar: false,
  title: false,
  animated: true,
})

const theme = useZTheme()

const PULSE_STYLE_ID = 'zui-skeleton-pulse'
// 全局注入 keyframes(一次性)。**用 opacity 脉冲而非写死颜色的高光 sweep** ——
// 骨架块底色走 `_bgMuted` token,opacity 脉冲在亮/暗主题下都正确(原先 `rgba(255,255,255,0.4)`
// 高光在暗色背景上过亮,且完全绕过主题)。
if (typeof document !== 'undefined' && !document.getElementById(PULSE_STYLE_ID)) {
  const style = document.createElement('style')
  style.id = PULSE_STYLE_ID
  style.textContent = `
@keyframes zui-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
`
  document.head.appendChild(style)
}

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.gap._middle
    s.alignItems.flexStart
    props.css?.(s)
  }),
)

const avatarClass = computed(() =>
  icss(theme.value, s => {
    s.width.px(sizePx(2.5))
    s.height.px(sizePx(2.5))
    s.borderRadius._full
    s.backgroundColor._bgMuted
    s.flexShrink(0)
    if (props.animated) applyPulse(s)
  }),
)

const linesContainerClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
  }),
)

const titleBarClass = computed(() =>
  icss(theme.value, s => {
    s.height.px(sizePx(1.25))
    s.width.pct(40)
    s.borderRadius._tiny
    s.backgroundColor._bgMuted
    s.marginBottom._tiny
    if (props.animated) applyPulse(s)
  }),
)

const rowClass = (isLast: boolean): string =>
  icss(theme.value, s => {
    s.height.px(sizePx(0.875))
    s.width.pct(isLast ? 60 : 100)
    s.borderRadius._tiny
    s.backgroundColor._bgMuted
    if (props.animated) applyPulse(s)
  })

function applyPulse(s: Chain<ZuiSchema>): void {
  s.animation('zui-skeleton-pulse 1.5s ease-in-out infinite')
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
