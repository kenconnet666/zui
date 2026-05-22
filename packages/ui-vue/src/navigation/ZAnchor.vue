<script lang="ts">
/**
 * `ZAnchor` —— 页内锚点列表。点击跳转 + scroll 同步高亮。
 *
 * - `items: Array<{ href, title }>` —— href 是 `#anchor-id` 形式
 * - `offsetTop?: number` —— 滚动到锚点时上方留白(默认 0)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZAnchorItem {
  href: string
  title: string
}

export interface ZAnchorProps {
  items: ZAnchorItem[]
  offsetTop?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, onMounted, onScopeDispose, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZAnchorProps>(), {
  offsetTop: 0,
})

const theme = useZTheme()
const activeHref = ref<string | null>(null)

function getOffsetTop(el: Element): number {
  return el.getBoundingClientRect().top + window.scrollY
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
  activeHref.value = bestHref
}

function onLinkClick(item: ZAnchorItem, e: MouseEvent): void {
  e.preventDefault()
  const el = document.querySelector(item.href)
  if (!el) return
  const top = getOffsetTop(el) - props.offsetTop
  window.scrollTo({ top, behavior: 'smooth' })
  activeHref.value = item.href
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onScopeDispose(() => {
  window.removeEventListener('scroll', onScroll)
})

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.borderLeftWidth._thin
    s.borderLeftStyle.solid
    s.borderLeftColor._border
    s.paddingLeft._small
    props.css?.(s)
  }),
)

function linkClass(active: boolean): string {
  return icss(theme.value, (s) => {
    s.display.block
    s.padding._tiny
    s.fontSize._small
    s._prop('textDecoration', 'none')
    s.color(active ? '_primary' : '_textSecondary')
    if (active) {
      s.fontWeight._medium
      s._prop('marginLeft', '-9px')
      s._prop('borderLeftWidth', '2px')
      s._prop('borderLeftStyle', 'solid')
      s._prop('borderLeftColor', 'currentColor')
      s.paddingLeft._small
    }
    s._hover((h) => {
      h.color._primary
    })
  })
}
</script>

<template>
  <nav :class="rootClass" aria-label="page anchor">
    <a
      v-for="item in items"
      :key="item.href"
      :class="linkClass(activeHref === item.href)"
      :href="item.href"
      @click="onLinkClick(item, $event)"
    >
      {{ item.title }}
    </a>
  </nav>
</template>
