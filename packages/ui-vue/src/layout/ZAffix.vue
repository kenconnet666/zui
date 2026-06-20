<script lang="ts">
/**
 * `ZAffix` —— 吸附固定(scroll 到指定偏移时切到 fixed)。
 *
 * - `offsetTop?: number` —— 距顶 px,默认 0(0 时永远吸顶)
 * - `target?: () => Element | Window` —— scroll 容器
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZAffixProps {
  offsetTop?: number
  target?: () => Element | Window
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, onMounted, onScopeDispose, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZAffixProps>(), {
  offsetTop: 0,
})

const theme = useZTheme()
const placeholderRef = ref<HTMLElement | null>(null)
const fixed = ref(false)
const placeholderHeight = ref(0)
const placeholderWidth = ref(0)

function onScroll(): void {
  if (!placeholderRef.value) return
  const rect = placeholderRef.value.getBoundingClientRect()
  // 根据 scrollTarget 类型决定取哪里的滚动量:
  //   window → window.scrollY（文档级滚动）
  //   自定义 Element 容器 → Element.scrollTop（容器内滚动）
  const scrollTop =
    scrollTarget === window ? window.scrollY : (scrollTarget as Element).scrollTop
  // 占位元素本身在固定状态下不会动,我们改用 wrapper:这里 placeholderRef 是 wrapper
  // 真正测量:wrapper 在文档流中的 top（相对 scrollTarget 容器顶部）
  const docTop = rect.top + scrollTop
  const shouldFix = scrollTop + props.offsetTop >= docTop
  if (shouldFix && !fixed.value) {
    placeholderHeight.value = placeholderRef.value.offsetHeight
    placeholderWidth.value = placeholderRef.value.offsetWidth
    fixed.value = true
  } else if (!shouldFix && fixed.value) {
    fixed.value = false
  }
}

// 缓存解析后的 scroll 目标,确保 add/removeEventListener 作用于同一对象(target 工厂可能每次返回新引用,否则解绑失败→监听泄漏)
let scrollTarget: Element | Window | null = null
onMounted(() => {
  // 防御:target 工厂可能返回非 Element(如误传 Vue ref 对象)→ 回退到 window,避免崩溃
  const t = props.target?.()
  scrollTarget =
    t && typeof (t as Element).addEventListener === 'function' ? (t as Element | Window) : window
  scrollTarget.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onScopeDispose(() => {
  scrollTarget?.removeEventListener('scroll', onScroll)
  scrollTarget = null
})

const wrapperClass = computed(() =>
  icss(theme.value, s => {
    if (fixed.value) {
      s.height.px(placeholderHeight.value)
    }
    props.css?.(s)
  }),
)

const innerClass = computed(() =>
  icss(theme.value, s => {
    if (fixed.value) {
      s.position.fixed
      s.top.px(props.offsetTop)
      s.width.px(placeholderWidth.value)
      s.zIndex._small
    }
  }),
)
</script>

<template>
  <div ref="placeholderRef" :class="wrapperClass">
    <div :class="innerClass">
      <slot />
    </div>
  </div>
</template>
