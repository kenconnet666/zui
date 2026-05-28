<script lang="ts">
/**
 * `ZBackTop` —— 回到顶部按钮(fixed,scrollY > visibilityHeight 时显示)。
 *
 * - `visibilityHeight?: number` —— 触发显示的滚动距离,默认 400
 * - `target?: () => Element | Window` —— 监听 scroll 的容器,默认 window
 * - `right?: factory` / `bottom?: factory` —— 定位 carrier factory(2026-05-24 B7:数字尺寸 → factory)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZBackTopProps {
  visibilityHeight?: number
  target?: () => Element | Window
  /**
   * 按钮边长 —— `number`(iem 倍数,默认 2.5 = 40px @ 16px iem)。width + height 镜像。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   */
  size?: number
  /**
   * 右边距 factory —— 接 `right` carrier。默认 `(r) => r.iem(1.5)`。
   *
   * @example
   * <ZBackTop :right="(r) => r.iem(2)" />
   * <ZBackTop :right="(r) => r.px(40)" />
   */
  right?: ((c: Chain<ZuiSchema>['right']) => void) | undefined
  /**
   * 下边距 factory —— 接 `bottom` carrier。默认 `(b) => b.iem(3)`。
   *
   * @example
   * <ZBackTop :bottom="(b) => b.iem(4)" />
   */
  bottom?: ((c: Chain<ZuiSchema>['bottom']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, h, onMounted, onScopeDispose, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ (页面 / target 容器)                           │
 *   │                                                  │
 *   │                          ┌──────┐                │   按钮:
 *   │                          │  ▲  │                │     inline-flex / fixed
 *   │                          │      │                │     width: `size` iem
 *   │                          │ size │                │     height: `size` iem
 *   │                          │ iem  │                │     默认 size=2.5(40px @ 1080p)
 *   │                          └──────┘                │     border-radius: _full(正圆)
 *   │                            ↑                     │     bg _bg / color _primary
 *   │                            right 1.5iem(默认)  │     boxShadow _middle
 *   │                            bottom 3iem(默认)   │     hover → boxShadow _large
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → width / height 等比缩(始终正方形)。
 * right / bottom 走 factory 单独覆盖。scrollY >= visibilityHeight 时显示(默认 400px),
 * Teleport to body。非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZBackTopProps>(), {
  visibilityHeight: 400,
  size: 2.5,
  right: (r: Chain<ZuiSchema>['right']) => {
    r.iem(1.5)
  },
  bottom: (b: Chain<ZuiSchema>['bottom']) => {
    b.iem(3)
  },
})

const theme = useZTheme()
const visible = ref(false)

function getScrollTop(): number {
  const t = props.target?.() ?? window
  if (t === window) return window.pageYOffset || document.documentElement.scrollTop
  return (t as Element).scrollTop
}

function onScroll(): void {
  visible.value = getScrollTop() >= props.visibilityHeight
}

function scrollToTop(): void {
  const t = props.target?.() ?? window
  if (t === window) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    ;(t as Element).scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  const t = props.target?.() ?? window
  t.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onScopeDispose(() => {
  const t = props.target?.() ?? window
  t.removeEventListener('scroll', onScroll)
})

const btnClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 2.5
    s.position.fixed
    if (props.right) s.right(props.right)
    if (props.bottom) s.bottom(props.bottom)
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.iem(size)
    s.height.iem(size)
    s.borderRadius._full
    s.backgroundColor._bg
    s.color._primary
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.cursor.pointer
    s.zIndex._popover
    s.transitionProperty._default
    s.transitionDuration._small
    s._hover(h2 => {
      h2.boxShadow._large
    })
    props.css?.(s)
  }),
)

const upIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronUp }))

const fadeActiveClass = computed(() =>
  icss(theme.value, s => {
    s.transitionProperty._opacity
    s.transitionDuration._small
    s.transitionTimingFunction.ease
  }),
)
const fadeBoundaryClass = computed(() => icss(theme.value, s => s.opacity._none))
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-from-class="fadeBoundaryClass"
      :enter-active-class="fadeActiveClass"
      :leave-active-class="fadeActiveClass"
      :leave-to-class="fadeBoundaryClass"
    >
      <button
        v-if="visible"
        type="button"
        :class="btnClass"
        aria-label="回到顶部"
        @click="scrollToTop"
      >
        <component :is="upIcon" />
      </button>
    </Transition>
  </Teleport>
</template>
