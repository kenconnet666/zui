<script lang="ts">
/**
 * `DocToc` —— 文档页右侧页内目录（锚点导航）。
 *
 * 自动扫描 scrollEl 内所有 h2/h3，用 scroll 事件追踪当前阅读位置，
 * 点击条目平滑滚动到对应标题。路由切换后自动重建。
 *
 * - h2 无缩进，h3 缩进 0.75iem
 * - 仅当页面含 h2/h3 时渲染（v-if）
 */
export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export interface DocTocProps {
  /** ZScrollbar 的根 div（内容区可滚动元素）。 */
  scrollEl: HTMLElement | null
}
</script>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { icss, useZTheme, ZScrollbar } from '@kenconnet666/zui-vue'

const props = defineProps<DocTocProps>()
const route = useRoute()
const theme = useZTheme()

const items = ref<TocItem[]>([])
const activeId = ref<string>('')
let rafId = 0

// ─── 提取标题 ───
function buildToc(): void {
  const el = props.scrollEl
  if (!el) {
    items.value = []
    return
  }
  const headings = Array.from(el.querySelectorAll<HTMLElement>('h2, h3'))
  headings.forEach((h, i) => {
    if (!h.id) h.id = `toc-${i}`
  })
  items.value = headings.map(h => ({
    id: h.id,
    text: h.textContent?.trim() ?? '',
    level: parseInt(h.tagName.charAt(1), 10) as 2 | 3,
  }))
  activeId.value = items.value[0]?.id ?? ''
}

// ─── 滚动追踪 ───
function updateActive(): void {
  const el = props.scrollEl
  if (!el || items.value.length === 0) return
  const containerTop = el.getBoundingClientRect().top
  const threshold = 100
  let found = ''
  for (let i = items.value.length - 1; i >= 0; i--) {
    const item = items.value[i]
    if (!item) continue
    const heading = el.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`)
    if (!heading) continue
    if (heading.getBoundingClientRect().top - containerTop <= threshold) {
      found = item.id
      break
    }
  }
  activeId.value = found || (items.value[0]?.id ?? '')
}

function onScroll(): void {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(updateActive)
}

function bindScroll(): void {
  props.scrollEl?.addEventListener('scroll', onScroll, { passive: true })
}
function unbindScroll(): void {
  props.scrollEl?.removeEventListener('scroll', onScroll)
}

async function refresh(): Promise<void> {
  unbindScroll()
  await nextTick()
  await nextTick()
  buildToc()
  updateActive()
  bindScroll()
}

onMounted(refresh)
onBeforeUnmount(() => {
  unbindScroll()
  cancelAnimationFrame(rafId)
})
watch(() => route.path, refresh)
watch(() => props.scrollEl, refresh)

// ─── 点击锚点 ───
function scrollTo(id: string): void {
  const heading = props.scrollEl?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
  if (heading) {
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeId.value = id
  }
}

// ─── 样式 ───
const rootClass = computed(() =>
  icss(theme.value, s => {
    s.flexShrink(0)
    s.width.pct(15)
    s.borderLeftWidth._thin
    s.borderLeftStyle.solid
    s.borderLeftColor._border
    s.display.flex
    s.flexDirection.column
    s.minHeight.px(0)
    s._media('(max-width: 1400px)', m => {
      m.display.none
    })
    s._media('(orientation: portrait)', m => {
      m.display.none
    })
  }),
)

const innerClass = computed(() =>
  icss(theme.value, s => {
    s.paddingTop.iem(1.75)
    s.paddingLeft.iem(1)
    s.paddingRight.iem(0.75)
    s.paddingBottom.iem(2)
  }),
)

const listClass = computed(() =>
  icss(theme.value, s => {
    s.listStyle('none')
    s.margin.px(0)
    s.padding.px(0)
    s.display.flex
    s.flexDirection.column
    s.gap.iem(0.125)
  }),
)

function itemClass(item: TocItem): string {
  const isActive = item.id === activeId.value
  return icss(theme.value, s => {
    s.display.block
    s.width.pct(100)
    s.textAlign.left
    s.borderStyle.none
    s.borderRadius._small
    s.cursor.pointer
    s.fontSize._small
    s.lineHeight._relaxed
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
    s.paddingRight.iem(0.5)
    s.paddingLeft.iem(item.level === 3 ? 1.25 : 0.5)
    s.transitionProperty._default
    s.transitionDuration._tiny
    s.backgroundColor.transparent
    if (isActive) {
      s.color._primary
      s.fontWeight._medium
    } else {
      s.color._textSecondary
      s._hover(h => {
        h.color._text
        h.backgroundColor._textSecondary.alpha(6)
      })
    }
  })
}
</script>

<template>
  <nav v-if="items.length > 0" :class="rootClass" aria-label="页内目录">
    <ZScrollbar
      :css="
        s => {
          s.flexGrow(1)
          s.minHeight.px(0)
        }
      "
    >
      <div :class="innerClass">
        <ul :class="listClass">
          <li v-for="item in items" :key="item.id" role="none">
            <button type="button" :class="itemClass(item)" @click="scrollTo(item.id)">
              {{ item.text }}
            </button>
          </li>
        </ul>
      </div>
    </ZScrollbar>
  </nav>
</template>
