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
import { icss, ikeyframes } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZMarqueeProps>(), {
  duration: 10000,
  direction: 'left',
  pauseOnHover: true,
})

const theme = useZTheme()

const marqueeLeft = ikeyframes((k) => {
  k.from({ transform: 'translateX(0)' })
  k.to({ transform: 'translateX(-50%)' })
})
const marqueeRight = ikeyframes((k) => {
  k.from({ transform: 'translateX(-50%)' })
  k.to({ transform: 'translateX(0)' })
})

const wrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.block
    s.overflow.hidden
    s.whiteSpace.nowrap
    if (props.pauseOnHover) {
      s._hover((h) => {
        h._selector('& > div', (c) => {
          c.animationPlayState.paused
        })
      })
    }
    props.css?.(s)
  }),
)

const trackClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.animationName(props.direction === 'left' ? marqueeLeft : marqueeRight)
    s.animationDuration.ms(props.duration)
    s.animationTimingFunction.linear
    s.animationIterationCount.infinite
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
