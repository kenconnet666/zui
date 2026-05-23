<script lang="ts">
/**
 * `ZMarquee` —— 跑马灯(CSS 动画 + 双倍内容衔接)。
 *
 * - `duration?: number` —— 完整一轮 ms,默认 10000
 * - `direction?: 'left' | 'right'` —— 默认 left
 * - `pauseOnHover?: boolean` —— hover 暂停,默认 true
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZMarqueeProps {
  duration?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZMarqueeProps>(), {
  duration: 10000,
  direction: 'left',
  pauseOnHover: true,
})

const theme = useZTheme()

const MARQUEE_STYLE_ID = 'zui-marquee-keyframes'
if (typeof document !== 'undefined' && !document.getElementById(MARQUEE_STYLE_ID)) {
  const style = document.createElement('style')
  style.id = MARQUEE_STYLE_ID
  style.textContent = `
@keyframes zui-marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes zui-marquee-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
`
  document.head.appendChild(style)
}

const wrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.block
    s.overflow.hidden
    s.whiteSpace.nowrap
    if (props.pauseOnHover) {
      s._hover((h) => {
        h.animationPlayState.paused
      })
    }
    props.css?.(s)
  }),
)

const trackClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.animation(`zui-marquee-${props.direction} ${props.duration}ms linear infinite`)
    if (props.pauseOnHover) {
      // 让 hover 暂停传递到子级 animation
    }
  }),
)
</script>

<template>
  <div :class="wrapClass">
    <div :class="trackClass">
      <span>
        <slot />
      </span>
      <span aria-hidden="true">
        <slot />
      </span>
    </div>
  </div>
</template>

<style scoped>
:hover > div {
  animation-play-state: paused;
}
</style>
