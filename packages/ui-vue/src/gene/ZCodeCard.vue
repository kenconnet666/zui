<script lang="ts">
/**
 * `ZCodeCard` —— 文档站「示例 + 源码」卡片。
 *
 * **核心使用模式**(单文件双重身份,Vite `?raw`):
 * ```ts
 * import Demo from './demos/ButtonBasic.vue'
 * import DemoSource from './demos/ButtonBasic.vue?raw'
 * ```
 * 一个 `.vue` 同时被作为 **运行组件**(`<Demo />` 进 `default` slot)和
 * **源代码文本**(`?raw` 字符串传 `source` prop)使用,源同步零漂移。
 *
 * **结构**:
 * - header bar(标题 + 复制按钮 + 代码主题选择器 + 折叠开关)
 * - preview area(default slot,实时渲染示例组件)
 * - code area(折叠态完全收起 0 高度;展开态用内置 `ZCode` shiki 高亮)
 *
 * **代码主题**:所有 ZCodeCard 实例共享 `globalCodeTheme`(模块级 ref),
 * 任一实例切换主题全站联动,并持久化到 `localStorage('zui-code-theme')`。
 *
 * **API**:
 * - `title?: string` —— 卡片标题(prop;`#header` slot 优先级更高)
 * - `source: string` —— 源代码文本(必传,通常来自 `?raw` import)
 * - `lang?: string` —— shiki 语言,默认 `'vue'`
 * - `defaultExpanded?: boolean` —— 默认折叠态,默认 `false`
 * - `expanded?: boolean` —— 受控展开态(传则走 `v-model:expanded`)
 * - `showImports?: boolean` —— 默认 `false`(剥除 `import ... from '...'` 行)
 * - `copyToastDuration?: number` —— 复制成功 toast ms,默认 `1500`;`0` 关闭 toast
 * - `css?: factory` —— 根元素覆盖
 */
import { ref } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

// ─── 全局代码主题状态（所有实例共享，任意实例切换全站联动）───
const LS_CODE_THEME_KEY = 'zui-code-theme'
const DEFAULT_CODE_THEME = 'tokyo-night'

/** 单个可选代码主题描述。 */
export interface CodeThemeItem {
  value: string
  label: string
  /** true = 暗色主题，false = 亮色主题。 */
  dark: boolean
}

/** ZCodeCard 支持的所有 shiki 主题列表。 */
export const CODE_THEMES: CodeThemeItem[] = [
  // ── 亮色 ──
  { value: 'light-plus', label: 'Light+', dark: false },
  { value: 'github-light', label: 'GitHub Light', dark: false },
  { value: 'min-light', label: 'Min Light', dark: false },
  { value: 'one-light', label: 'One Light', dark: false },
  { value: 'solarized-light', label: 'Solarized', dark: false },
  { value: 'vitesse-light', label: 'Vitesse', dark: false },
  { value: 'catppuccin-latte', label: 'Catppuccin Latte', dark: false },
  { value: 'material-theme-lighter', label: 'Material Light', dark: false },
  // ── 暗色 ──
  { value: 'tokyo-night', label: 'Tokyo Night', dark: true },
  { value: 'github-dark', label: 'GitHub Dark', dark: true },
  { value: 'github-dark-dimmed', label: 'GitHub Dimmed', dark: true },
  { value: 'one-dark-pro', label: 'One Dark Pro', dark: true },
  { value: 'dracula', label: 'Dracula', dark: true },
  { value: 'monokai', label: 'Monokai', dark: true },
  { value: 'nord', label: 'Nord', dark: true },
  { value: 'night-owl', label: 'Night Owl', dark: true },
  { value: 'catppuccin-mocha', label: 'Catppuccin Mocha', dark: true },
  { value: 'material-theme', label: 'Material Dark', dark: true },
  { value: 'synthwave-84', label: 'Synthwave 84', dark: true },
  { value: 'ayu-dark', label: 'Ayu Dark', dark: true },
  { value: 'min-dark', label: 'Min Dark', dark: true },
  { value: 'vitesse-dark', label: 'Vitesse Dark', dark: true },
]

function getInitialCodeTheme(): string {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(LS_CODE_THEME_KEY)
    if (saved && CODE_THEMES.some(t => t.value === saved)) return saved
  }
  return DEFAULT_CODE_THEME
}

/** 全站共享代码主题（模块级单例）。 */
export const globalCodeTheme = ref<string>(getInitialCodeTheme())

/** 设置全站代码主题并持久化。 */
export function setCodeTheme(theme: string): void {
  globalCodeTheme.value = theme
  if (typeof localStorage !== 'undefined') localStorage.setItem(LS_CODE_THEME_KEY, theme)
}

export interface ZCodeCardProps {
  /** 卡片标题(prop;`#header` slot 优先级更高)。 */
  title?: string
  /** 源代码文本(必传,通常来自 `?raw` import)。 */
  source: string
  /** shiki 语言。默认 `'vue'`。 */
  lang?: string
  /** 默认是否展开代码区。默认 `false`。 */
  defaultExpanded?: boolean
  /**
   * 受控展开态(传 `true`/`false` 走 `v-model:expanded`,默认 `null` 非受控)。
   */
  expanded?: boolean | null
  /** 显示源码中的 `import` 语句。默认 `false`(文档场景剥除)。 */
  showImports?: boolean
  /** 复制成功 toast 持续 ms。`0` 关闭 toast(按钮文字反馈始终生效)。默认 `1500`。 */
  copyToastDuration?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCodeCardEmits {
  /** 复制完成(成功/失败 + 实际复制的 code)。 */
  (e: 'copy', success: boolean, code: string): void
  /** 展开状态变更(支持 `v-model:expanded`)。 */
  (e: 'update:expanded', expanded: boolean): void
}

/**
 * 剥除 `.vue` / `.ts` 源码中的所有 `import ... from '...'` 语句(含多行),并压缩前导/连续空行。
 */
export function stripImports(source: string): string {
  return source
    .replace(/^[ \t]*import\b[^;]*?from\s+['"][^'"]+['"]\s*;?[ \t]*\n?/gm, '')
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
}
</script>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import ZCode from './ZCode.vue'
import ZIcon from './ZIcon.vue'
import ZCopyButton from './ZCopyButton.vue'
import { BuiltinIcons } from './icons'
import ZSelect from '../input/ZSelect.vue'
import type { ZSelectValue } from '../input/ZSelect.vue'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(纯 px;尺寸通过 sizePx 计算,1 单位 = 16px):
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │ root div (border _border _thin / radius _small /       │
 *   │           bg _bg / overflow hidden)                    │
 *   │                                                        │
 *   │   ┌──────────────────────────────────────────────┐    │
 *   │   │ header (flex row / justifyBetween / gap small)│    │   pad-y _small / pad-x _middle
 *   │   │   ┌─────────────┐  ┌──────────────────────────────┐  │    │   bg _bgMuted
 *   │   │   │ <#header> / │  │ [⧉ 复制] [主题 ▾] [▾ 展开] │  │    │   border-bottom _thin
 *   │   │   │  title      │  │       (action group)         │  │    │
 *   │   │   └─────────────┘  └─────────────────────┘  │    │
 *   │   └──────────────────────────────────────────────┘    │
 *   │                                                        │
 *   │   ┌──────────────────────────────────────────────┐    │
 *   │   │ preview (slot default 实时示例)              │    │   pad _middle / bg _bg
 *   │   └──────────────────────────────────────────────┘    │
 *   │                                                        │
 *   │   ┌──────────────────────────────────────────────┐    │
 *   │   │ <Transition> / <ZCode shiki 高亮> /          │    │
 *   │   │ border-top _thin                             │    │
 *   │   └──────────────────────────────────────────────┘    │
 *   └────────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZCodeCardProps>(), {
  lang: 'vue',
  defaultExpanded: false,
  expanded: null,
  showImports: false,
  copyToastDuration: 1500,
})
const emit = defineEmits<ZCodeCardEmits>()

const theme = useZTheme()

// ─── 受控/非受控展开 ───
const internalExpanded = ref(props.defaultExpanded)
const isControlled = computed(() => props.expanded !== null)
const expandedState = computed(() =>
  isControlled.value ? !!props.expanded : internalExpanded.value,
)

function toggle(): void {
  const next = !expandedState.value
  if (!isControlled.value) internalExpanded.value = next
  emit('update:expanded', next)
}

// ─── 复制 emit 透传 ───
function onCopy(success: boolean, text: string): void {
  emit('copy', success, text)
}

// ─── 主题选择器数据 ───
const themeOptions = CODE_THEMES.map(t => ({ value: t.value, label: t.label }))

function onThemeSelect(value: ZSelectValue | ZSelectValue[] | null): void {
  if (typeof value === 'string') setCodeTheme(value)
}

// ─── 处理后的源码(可选剥 import)───
const processedSource = computed(() =>
  props.showImports ? props.source : stripImports(props.source),
)

// ─── className ───
const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.block
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.borderRadius._small
    s.backgroundColor._bg
    s.overflow.hidden
    props.css?.(s)
  }),
)

const headerClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._small
    s.paddingTop._small
    s.paddingBottom._small
    s.paddingLeft._middle
    s.paddingRight._middle
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    s.backgroundColor._bgMuted
  }),
)

const titleClass = computed(() =>
  icss(theme.value, s => {
    s.fontSize._small
    s.fontWeight._semibold
    s.color._text
    s.flex(1)
    s.minWidth.px(0)
    s.overflow.hidden
    s.textOverflow.ellipsis
    s.whiteSpace.nowrap
  }),
)

const actionsClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.flexShrink(0)
  }),
)

const buttonClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.paddingTop._tiny
    s.paddingBottom._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderWidth._none
    s.borderRadius._tiny
    s.backgroundColor.transparent
    s.color._textSecondary
    s.fontSize._small
    s.lineHeight._tight
    s.cursor.pointer
    s.transitionProperty.all
    s.transitionDuration._tiny
    s._selector('&:hover', h => {
      h.backgroundColor._bgHover
      h.color._text
    })
    s._selector('&:focus-visible', h => {
      h.outlineWidth._middle
      h.outlineStyle.solid
      h.outlineColor._focusRing.alpha(40)
      h.outlineOffset.px(2)
    })
  }),
)

const descClass = computed(() =>
  icss(theme.value, s => {
    s.paddingTop._small
    s.paddingBottom._small
    s.paddingLeft._middle
    s.paddingRight._middle
    s.fontSize._small
    s.color._textSecondary
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
  }),
)

const previewClass = computed(() =>
  icss(theme.value, s => {
    s.padding._middle
    s.backgroundColor._bg
  }),
)

const codeAreaClass = computed(() =>
  icss(theme.value, s => {
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
  }),
)

const transitionActiveClass = computed(() =>
  icss(theme.value, s => {
    s.transitionProperty.all
    s.transitionDuration._small
    s.transitionTimingFunction._default
  }),
)
const enterFromClass = computed(() =>
  icss(theme.value, s => {
    s.opacity._none
    s.transform('translateY(-0.25em)')
  }),
)
const leaveToClass = computed(() =>
  icss(theme.value, s => {
    s.opacity._none
    s.transform('translateY(-0.25em)')
  }),
)

watch(
  () => props.expanded,
  v => {
    if (v !== null && v !== undefined) internalExpanded.value = v
  },
)
</script>

<template>
  <div :class="rootClass">
    <div :class="headerClass">
      <div :class="titleClass">
        <slot name="header">{{ title ?? '' }}</slot>
      </div>
      <div :class="actionsClass">
        <ZCopyButton
          :text="source"
          :toast-duration="copyToastDuration ?? 1500"
          copied-label="已复制"
          label="复制"
          @copy="onCopy"
        />
        <!-- 代码主题选择器：全站联动 -->
        <ZSelect
          :dropdown-max-height="20"
          :options="themeOptions"
          :size="0.875"
          :value="globalCodeTheme"
          @update:value="onThemeSelect"
        />
        <button
          :aria-expanded="expandedState"
          :aria-label="expandedState ? '收起代码' : '展开代码'"
          :class="buttonClass"
          type="button"
          @click="toggle"
        >
          <ZIcon
            :component="expandedState ? BuiltinIcons.chevronUp : BuiltinIcons.chevronDown"
            :size="1"
          />
          <span>{{ expandedState ? '收起' : '展开代码' }}</span>
        </button>
      </div>
    </div>

    <div v-if="$slots.desc" :class="descClass">
      <slot name="desc" />
    </div>

    <div :class="previewClass">
      <slot />
    </div>

    <Transition
      :enter-active-class="transitionActiveClass"
      :enter-from-class="enterFromClass"
      :leave-active-class="transitionActiveClass"
      :leave-to-class="leaveToClass"
    >
      <div v-show="expandedState" :class="codeAreaClass">
        <ZCode
          :code="processedSource"
          :inline="false"
          :lang="lang ?? 'vue'"
          :themes="{ light: globalCodeTheme, dark: globalCodeTheme }"
          color-scheme="auto"
        />
      </div>
    </Transition>
  </div>
</template>
