<script lang="ts">
/**
 * `DocLayout` —— docs 站点统一外壳:左侧栏(品牌 + ZMenu + 主题切换)+ 主区 ZScrollbar。
 *
 * **API**:
 * - `v-model:colorScheme` —— `'light' | 'dark'`
 */
export type ColorScheme = 'light' | 'dark'

export interface DocLayoutProps {
  colorScheme: ColorScheme
}

export interface DocLayoutEmits {
  (e: 'update:colorScheme', value: ColorScheme): void
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { icss, useZTheme, ZFlex, ZMenu, ZScrollbar } from '@kenconnet666/zui-vue'
import { docNav, docRouteMap } from '../config/nav'
import DocToc from './DocToc.vue'

const props = defineProps<DocLayoutProps>()
const emit = defineEmits<DocLayoutEmits>()

const theme = useZTheme()
const router = useRouter()
const route = useRoute()

// ─── 当前选中的 menu key ───
const activeKey = computed<string>(() => {
  const current = route.path
  for (const [key, path] of Object.entries(docRouteMap)) {
    if (path === current) return key
  }
  return ''
})

function onMenuSelect(key: string): void {
  const path = docRouteMap[key]
  if (path) router.push(path)
}

function onColorSchemeChange(v: ColorScheme): void {
  emit('update:colorScheme', v)
}

// ─── 布局样式 ───
const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.height.vh(100)
    s.backgroundColor._bg
    s.color._text
  }),
)

const bodyClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.minHeight.px(0)
    s.overflow.hidden
  }),
)

const sidebarClass = computed(() =>
  icss(theme.value, s => {
    s.flexShrink(0)
    s.display.flex
    s.flexDirection.column
    s.width.pct(15)
    s.borderRightWidth._thin
    s.borderRightStyle.solid
    s.borderRightColor._border
    s.backgroundColor._bgMuted
  }),
)

const brandClass = computed(() =>
  icss(theme.value, s => {
    s.flexShrink(0)
    s.paddingTop.px(20)
    s.paddingBottom.px(20)
    s.paddingLeft.px(24)
    s.paddingRight.px(24)
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    s.fontSize._middle
    s.fontWeight._semibold
    s.color._text
    s.textAlign.center
    s.cursor.pointer
    s.userSelect.none
    s.transitionProperty._default
    s.transitionDuration._tiny
    s._hover(h => {
      h.color._primary
    })
  }),
)

const menuAreaClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.minHeight.px(0)
    s.overflow.hidden
  }),
)

const menuWrapClass = computed(() =>
  icss(theme.value, s => {
    s.paddingTop.px(0)
    s.paddingLeft._tiny
    s.paddingRight._tiny
    s.paddingBottom._tiny
    s.backgroundColor.transparent
  }),
)

const themeBarClass = computed(() =>
  icss(theme.value, s => {
    s.flexShrink(0)
    s.display.flex
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
  }),
)

function makeThemeBtnClass(scheme: ColorScheme) {
  return computed(() =>
    icss(theme.value, s => {
      s.flex(1)
      s.paddingTop.px(12)
      s.paddingBottom.px(12)
      s.borderWidth.px(0)
      s.borderRadius.px(0)
      s.cursor.pointer
      s.fontSize._small
      s.fontWeight._medium
      s.transitionProperty._default
      s.transitionDuration._tiny
      if (props.colorScheme === scheme) {
        s.backgroundColor._primary.alpha(10)
        s.color._primary
        s.fontWeight._semibold
      } else {
        s.backgroundColor.transparent
        s.color._textSecondary
        s._hover(h => {
          h.backgroundColor._textSecondary.alpha(8)
          h.color._text
        })
      }
      if (scheme === 'light') {
        s.borderRightWidth._thin
        s.borderRightStyle.solid
        s.borderRightColor._border
      }
    }),
  )
}

const lightBtnClass = makeThemeBtnClass('light')
const darkBtnClass = makeThemeBtnClass('dark')

// ─── TOC：内容区滚动容器 ref ───
const contentScrollRef = ref<{ $el: HTMLElement } | null>(null)
const scrollEl = computed<HTMLElement | null>(() => contentScrollRef.value?.$el ?? null)

const contentClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.minWidth.px(0)
    s.backgroundColor._bg
  }),
)

const contentInnerClass = computed(() =>
  icss(theme.value, s => {
    s.paddingTop.px(32)
    s.paddingBottom.px(32)
    s.paddingLeft.px(32)
    s.paddingRight.px(32)
  }),
)
</script>

<template>
  <div :class="rootClass">
    <ZFlex :class="bodyClass">
      <!-- ─── 左侧栏 ─── -->
      <div :class="sidebarClass">
        <div :class="brandClass" @click="router.push('/')">zui docs</div>

        <div :class="menuAreaClass">
          <ZScrollbar
            :css="
              s => {
                s.height.pct(100)
              }
            "
          >
            <div :class="menuWrapClass">
              <ZMenu :items="docNav" :value="activeKey" @select="onMenuSelect" />
            </div>
          </ZScrollbar>
        </div>

        <div :class="themeBarClass">
          <button type="button" :class="lightBtnClass" @click="onColorSchemeChange('light')">
            亮
          </button>
          <button type="button" :class="darkBtnClass" @click="onColorSchemeChange('dark')">
            暗
          </button>
        </div>
      </div>

      <!-- ─── 右侧内容区 ─── -->
      <div :class="contentClass">
        <ZScrollbar
          ref="contentScrollRef"
          :css="
            s => {
              s.height.pct(100)
            }
          "
        >
          <div :class="contentInnerClass">
            <slot />
          </div>
        </ZScrollbar>
      </div>

      <!-- ─── 右侧 TOC ─── -->
      <DocToc :scroll-el="scrollEl" />
    </ZFlex>
  </div>
</template>
