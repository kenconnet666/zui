<script lang="ts">
/**
 * `ZAnchor` —— 页内锚点列表(右侧 TOC),点击平滑滚动 + scroll spy 同步高亮。
 *
 * **典型用法**:文档站右侧目录,基于页面 `<h2>` / `<h3>` 自动抽取(用户在外部维护
 * items 列表;通常一个 `useDocHeadings()` composable 在 mount 后扫一遍 DOM)。
 *
 * **API**:
 * - `items: ZAnchorItem[]` —— 锚点列表(`href: '#id' + title` 必填,`level` 可选)
 * - `offsetTop?: number` —— 滚动留白(默认 `0`;固定 header 时设其高度)
 * - `indentStep?: number` —— 每 level 缩进步长，单位 px(默认 `0.75`，即 12px = 0.75 × 16px)
 * - `color?: factory` —— active 高亮色(默认 `_primary`)
 * - `css?: factory` —— 根元素覆盖
 *
 * **emit**:
 * - `change(href: string)` —— scroll spy 切到新 anchor
 * - `click(href: string, event: MouseEvent)` —— 用户点击
 *
 * **scroll spy 实现**:基于 `scroll` 事件 + `getBoundingClientRect`,简单可靠;
 * 高频场景可改 IntersectionObserver,但目前文档站锚点数量级 (10–50) scroll listener
 * passive 模式已足够。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZAnchorItem {
  /** 锚点目标,`#id` 形式。 */
  href: string
  /** 显示文字。 */
  title: string
  /** 缩进级别(`1`=无缩进 / `2`=h2 / `3`=h3 / `4`=h4)。默认 `1`(向后兼容)。 */
  level?: number
}

export interface ZAnchorProps {
  items: ZAnchorItem[]
  offsetTop?: number
  indentStep?: number
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZAnchorEmits {
  /** scroll spy 切到新 anchor(`null` = 全部不在视口上方,例如页首)。 */
  (e: 'change', href: string | null): void
  /** 用户点击 anchor。 */
  (e: 'click', href: string, event: MouseEvent): void
}
</script>

<script lang="ts" setup>
import { computed, onMounted, onScopeDispose, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(纯 px,1 单位 = 16px):
 *
 *   ┌───────────────────────────────┐
 *   │ <nav> (flex column)           │   border-left _thin _border
 *   │   padding-left _small         │   (左侧轨道)
 *   │                               │
 *   │   ▎ Section A (level 1)       │   padding-left: small + (level-1)*indentStep × 16px
 *   │   ▎   Subsection A.1 (lv 2)   │   active: margin-left -border / color _primary
 *   │   ▎ Section B (lv 1)          │     border-left 2px primary / fontWeight medium
 *   │   ▎   Subsection B.1 (lv 2)   │   hover: color _primary
 *   └───────────────────────────────┘
 *
 * scroll spy:每次 scroll 找到所有 anchor 中 `top <= scrollY + offsetTop + 4` 的最后一个
 * (页面流向下),设为 active。点击则平滑滚 + 立刻 emit change。
 */
const props = withDefaults(defineProps<ZAnchorProps>(), {
  offsetTop: 0,
  indentStep: 0.75,
})
const emit = defineEmits<ZAnchorEmits>()

const theme = useZTheme()
const activeHref = ref<string | null>(null)

function getOffsetTop(el: Element): number {
  return el.getBoundingClientRect().top + window.scrollY
}

function setActive(href: string | null): void {
  if (activeHref.value === href) return
  activeHref.value = href
  emit('change', href)
}

function onScroll(): void {
  const scrollY = window.scrollY
  let bestHref: string | null = null
  for (const item of props.items) {
    const el = document.querySelector(item.href)
    if (!el) continue
    if (getOffsetTop(el) - props.offsetTop - 4 <= scrollY) {
      bestHref = item.href
    }
  }
  setActive(bestHref)
}

function onLinkClick(item: ZAnchorItem, e: MouseEvent): void {
  e.preventDefault()
  emit('click', item.href, e)
  const el = document.querySelector(item.href)
  if (!el) return
  const top = getOffsetTop(el) - props.offsetTop
  window.scrollTo({ top, behavior: 'smooth' })
  setActive(item.href)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onScopeDispose(() => {
  window.removeEventListener('scroll', onScroll)
})

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.borderLeftWidth._thin
    s.borderLeftStyle.solid
    s.borderLeftColor._border
    s.paddingLeft._small
    props.css?.(s)
  }),
)

/** active 高亮色 token(carrier 桥接;color factory 用户覆盖优先)。 */
const activeColorFactory =
  props.color ??
  ((c: Chain<ZuiSchema>['color']) => {
    c._primary
  })

const linkClass = (item: ZAnchorItem, active: boolean): string =>
  icss(theme.value, s => {
    const level = item.level ?? 1
    const extraIndent = Math.max(0, level - 1) * props.indentStep
    s.display.block
    s.padding._tiny
    s.fontSize._small
    s.textDecorationLine.none
    s.paddingLeft.px(sizePx(extraIndent))
    if (active) {
      s.color(activeColorFactory)
      s.fontWeight._medium
      s.marginLeft.px(-9)
      s.borderLeftWidth._middle
      s.borderLeftStyle.solid
      s.borderLeftColor.currentColor
      s.paddingLeft.px(sizePx(extraIndent + 0.5))
    } else {
      s.color._textSecondary
    }
    s._hover(h => {
      h.color(activeColorFactory)
    })
  })
</script>

<template>
  <nav :class="rootClass" aria-label="page anchor">
    <a
      v-for="item in items"
      :key="item.href"
      :class="linkClass(item, activeHref === item.href)"
      :href="item.href"
      @click="onLinkClick(item, $event)"
    >
      {{ item.title }}
    </a>
  </nav>
</template>
