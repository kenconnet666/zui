<script lang="ts">
/**
 * `ZBackTop` —— 回到顶部按钮(fixed,scrollY > visibilityHeight 时显示)。
 *
 * - `visibilityHeight?: number` —— 触发显示的滚动距离,默认 400
 * - `target?: () => Element | Window` —— 监听 scroll 的容器,默认 window
 * - `right?: string | number` / `bottom?: string | number` —— 定位
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZBackTopProps {
  visibilityHeight?: number
  target?: () => Element | Window
  right?: string | number
  bottom?: string | number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, h, onMounted, onScopeDispose, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZBackTopProps>(), {
  visibilityHeight: 400,
  right: '24px',
  bottom: '48px',
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
  icss(theme.value, (s) => {
    s.position.fixed
    s.right(typeof props.right === 'number' ? `${props.right}px` : props.right)
    s.bottom(typeof props.bottom === 'number' ? `${props.bottom}px` : props.bottom)
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.iem(2.5)
    s.height.iem(2.5)
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
    s._hover((h2) => {
      h2.boxShadow._large
    })
    props.css?.(s)
  }),
)

const upIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronUp }))

const fadeActiveClass = computed(() =>
  icss(theme.value, (s) => {
    s.transitionProperty._opacity
    s.transitionDuration._small
    s.transitionTimingFunction.ease
  }),
)
const fadeBoundaryClass = computed(() => icss(theme.value, (s) => s.opacity._none))
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
