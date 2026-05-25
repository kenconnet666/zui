<script lang="ts">
/**
 * `DocLayout` —— docs 站点统一外壳:顶 header + 左 ZMenu + 主区 ZScrollbar。
 *
 * **全 Z\* 组件画**:`ZFlex` 三栏、`ZMenu` 侧导航、`ZScrollbar` 双滚动区、
 * `ZSegmented` 主题切换、`ZTitle` 品牌。零 scoped CSS。
 *
 * **API**:
 * - `v-model:colorScheme` —— `'light' | 'dark'`,header 内主题切换的受控状态;
 *    由父组件(App.vue)拥有,这里只读 + emit 更新事件
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  icss,
  useZTheme,
  ZFlex,
  ZMenu,
  ZScrollbar,
  ZSegmented,
  ZTitle,
} from '@kenconnet666/zui-vue'
import { docNav, docRouteMap } from '../data/nav'

const props = defineProps<DocLayoutProps>()
const emit = defineEmits<DocLayoutEmits>()

const theme = useZTheme()
const router = useRouter()
const route = useRoute()

// ─── 当前选中的 menu key —— 反查 docRouteMap ───
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

// ─── 主题切换 options ───
const colorSchemeOptions = [
  { value: 'light', label: '亮' },
  { value: 'dark', label: '暗' },
]

function onColorSchemeChange(v: string | number): void {
  if (v === 'light' || v === 'dark') emit('update:colorScheme', v)
}

// ─── 仅做 sizing / 颜色边界的样式 ───
const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.height.vh(100)
    s.backgroundColor._bg
    s.color._text
  }),
)

const headerClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexShrink(0)
    s.height.iem(3.5)
    s.paddingLeft.iem(1.5)
    s.paddingRight.iem(1.5)
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    s.backgroundColor._bg
  }),
)

const bodyClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.minHeight.px(0)
    s.overflow.hidden
  }),
)

const sidebarClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexShrink(0)
    s.width.iem(17)
    s.borderRightWidth._thin
    s.borderRightStyle.solid
    s.borderRightColor._border
    s.backgroundColor._bgMuted
  }),
)

const menuWrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._small
    s.backgroundColor.transparent
  }),
)

const contentClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.minWidth.px(0)
    s.backgroundColor._bg
  }),
)

const contentInnerClass = computed(() =>
  icss(theme.value, (s) => {
    s.paddingTop.iem(2)
    s.paddingBottom.iem(2)
    s.paddingLeft.iem(2.5)
    s.paddingRight.iem(2.5)
    s.maxWidth.iem(70)
    s.marginLeft.auto
    s.marginRight.auto
  }),
)
</script>

<template>
  <div :class="rootClass">
    <!-- ─── header ─── -->
    <ZFlex
      :class="headerClass"
      :justify="(j) => j.spaceBetween"
      :align="(a) => a.center"
      :gap="(g) => g._middle"
    >
      <ZTitle :level="4" tag="div">zui docs</ZTitle>
      <ZSegmented
        :value="props.colorScheme"
        :options="colorSchemeOptions"
        @update:value="onColorSchemeChange"
      />
    </ZFlex>

    <!-- ─── body:sidebar + content ─── -->
    <ZFlex :class="bodyClass">
      <!-- 左:ZMenu -->
      <div :class="sidebarClass">
        <ZScrollbar :css="(s) => { s.height.pct(100) }">
          <div :class="menuWrapClass">
            <ZMenu
              :items="docNav"
              :value="activeKey"
              @select="onMenuSelect"
            />
          </div>
        </ZScrollbar>
      </div>

      <!-- 右:content -->
      <div :class="contentClass">
        <ZScrollbar :css="(s) => { s.height.pct(100) }">
          <div :class="contentInnerClass">
            <slot />
          </div>
        </ZScrollbar>
      </div>
    </ZFlex>
  </div>
</template>
