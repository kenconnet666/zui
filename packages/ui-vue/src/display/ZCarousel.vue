<script lang="ts">
/**
 * `ZCarousel` —— 轮播图(滑动卡片切换)。
 *
 * **API**:
 * - `v-model:current?: number` —— 当前 index(0-based)
 * - `items: unknown[]` —— 简化:任意数组,通过 `#default` slot scope `{ item, index }` 渲染
 * - `autoplay?: boolean` —— 自动播放,默认 false
 * - `interval?: number` —— 自动播放间隔 ms(默认 3000)
 * - `showDots?: boolean` —— 指示点(默认 true)
 * - `showArrows?: boolean` —— 左右箭头(默认 true)
 * - `loop?: boolean` —— 循环,默认 true
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCarouselProps<T = unknown> {
  current?: number
  items: T[]
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  loop?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCarouselEmits {
  (e: 'update:current', value: number): void
  (e: 'change', value: number): void
}
</script>

<script lang="ts" setup generic="T">
import { computed, h, onMounted, onScopeDispose } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │ ZCarousel root                                       │   position: relative
 *   │   bg: _bgMuted  border-radius: _small                │   overflow: hidden
 *   │                                                      │
 *   │  ┌────────────────────────────────────────────────┐  │
 *   │  │ track  flex  width: total*100%                 │  │   translateX 滑动切换
 *   │  │  ┌────────┐ ┌────────┐ ┌────────┐             │  │
 *   │  │  │ slide  │ │ slide  │ │ slide  │  (...)      │  │   各 width: 100%/total
 *   │  │  │ #default scope { item, index }              │  │
 *   │  │  └────────┘ └────────┘ └────────┘             │  │
 *   │  └────────────────────────────────────────────────┘  │
 *   │                                                      │
 *   │  ◀ arrow left   width/height: 2iem  圆形 _full      │   left:0.5iem,top:50%
 *   │  ▶ arrow right  bg: _bg  boxShadow: _small          │   right:0.5iem
 *   │                                                      │
 *   │  ●●○○ dots  bottom:0.75iem,flex gap _tiny          │   dot: 0.5iem 圆形
 *   │                                                      │   active: width 1.25iem 胶囊
 *   └──────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZCarouselProps<T>>(), {
  current: 0,
  autoplay: false,
  interval: 3000,
  showDots: true,
  showArrows: true,
  loop: true,
})

const emit = defineEmits<ZCarouselEmits>()

const theme = useZTheme()

const total = computed(() => props.items.length)

function go(idx: number): void {
  let next = idx
  if (props.loop) {
    next = ((idx % total.value) + total.value) % total.value
  } else {
    next = Math.max(0, Math.min(total.value - 1, idx))
  }
  if (next === props.current) return
  emit('update:current', next)
  emit('change', next)
}

function prev(): void {
  go(props.current - 1)
}
function next(): void {
  go(props.current + 1)
}

let timer: ReturnType<typeof setInterval> | null = null
function startTimer(): void {
  stopTimer()
  if (!props.autoplay) return
  timer = setInterval(() => {
    next()
  }, props.interval)
}
function stopTimer(): void {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => startTimer())
onScopeDispose(() => stopTimer())

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.position.relative
    s.display.block
    s.overflow.hidden
    s.borderRadius._small
    s.backgroundColor._bgMuted
    props.css?.(s)
  }),
)

const trackClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.width.pct(total.value * 100)
    s.transform(`translateX(-${(props.current / total.value) * 100}%)`)
    s.transitionProperty._transform
    s.transitionDuration._middle
    s.transitionTimingFunction('cubic-bezier(0.4, 0, 0.2, 1)')
  }),
)

const slideClass = computed(() =>
  icss(theme.value, s => {
    s.width.pct(100 / total.value)
    s.flexShrink(0)
  }),
)

const arrowClass = (side: 'left' | 'right'): string =>
  icss(theme.value, s => {
    s.position.absolute
    s.top.pct(50)
    if (side === 'left') s.left.px(sizePx(0.5))
    else s.right.px(sizePx(0.5))
    s.transform('translateY(-50%)')
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.px(sizePx(2))
    s.height.px(sizePx(2))
    s.borderRadius._full
    s.backgroundColor._bg
    s.color._text
    s.borderStyle.none
    s.cursor.pointer
    s.boxShadow._small
    s.zIndex._small
    s._hover(h2 => {
      h2.boxShadow._middle
    })
  })

const dotsClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.bottom.px(sizePx(0.75))
    s.left.pct(50)
    s.transform('translateX(-50%)')
    s.display.flex
    s.gap._tiny
    s.zIndex._small
  }),
)

const dotClass = (active: boolean): string =>
  icss(theme.value, s => {
    s.width.px(sizePx(0.5))
    s.height.px(sizePx(0.5))
    s.borderRadius._full
    s.borderStyle.none
    s.cursor.pointer
    s.padding.px(0)
    s.transitionProperty._sizes
    s.transitionDuration._small
    if (active) {
      s.backgroundColor._bg
      s.width.px(sizePx(1.25))
    } else {
      s.backgroundColor._bg.alpha(50)
    }
  })

const leftIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronLeft }))
const rightIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))
</script>

<template>
  <div :class="rootClass" role="region" aria-label="carousel">
    <div :class="trackClass">
      <div v-for="(item, idx) in items" :key="idx" :class="slideClass">
        <slot :item="item" :index="idx" />
      </div>
    </div>

    <button
      v-if="showArrows && total > 1"
      type="button"
      :class="arrowClass('left')"
      aria-label="上一张"
      @click="prev"
    >
      <component :is="leftIcon" />
    </button>
    <button
      v-if="showArrows && total > 1"
      type="button"
      :class="arrowClass('right')"
      aria-label="下一张"
      @click="next"
    >
      <component :is="rightIcon" />
    </button>

    <div v-if="showDots && total > 1" :class="dotsClass">
      <button
        v-for="(_, idx) in items"
        :key="idx"
        type="button"
        :class="dotClass(idx === current)"
        :aria-label="`第 ${idx + 1} 张`"
        :aria-current="idx === current"
        @click="go(idx)"
      />
    </div>
  </div>
</template>
