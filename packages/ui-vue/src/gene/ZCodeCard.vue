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
 * - header bar(标题 + 复制按钮 + 折叠开关)
 * - preview area(default slot,实时渲染示例组件)
 * - code area(折叠态完全收起 0 高度;展开态用内置 `ZCode` shiki 高亮)
 *
 * **API**:
 * - `title?: string` —— 卡片标题(prop;`#header` slot 优先级更高)
 * - `source: string` —— 源代码文本(必传,通常来自 `?raw` import)
 * - `lang?: string` —— shiki 语言,默认 `'vue'`
 * - `defaultExpanded?: boolean` —— 默认折叠态,默认 `false`
 * - `expanded?: boolean` —— 受控展开态(传则走 `v-model:expanded`)
 * - `showImports?: boolean` —— 默认 `false`(剥除 `import ... from '...'` 行;
 *   文档场景下 import 是噪音,业务方按需开启)
 * - `themes?` / `colorScheme?` —— 透传 `ZCode`(shiki 主题对 + 模式)
 * - `copyToastDuration?: number` —— 复制成功 toast ms,默认 `1500`;`0` 关闭 toast
 *   (按钮文字 "复制" → "已复制" 1.5s 始终生效)
 * - `css?: factory` —— 根元素覆盖
 *
 * **复制反馈**:全部委托给 `ZCopyButton`(按钮文字临时切换 + 可选 toast)。
 *
 * **折叠**:`v-show` + Vue `<Transition>` 简单 opacity/transform 过渡,
 * 折叠态完全 `display:none`,不占视觉空间。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

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
   *
   * 用 `null` 而非 `undefined` 区分:Vue runtime 把 absent boolean prop coerce
   * 为 `false`,无法靠 `=== undefined` 判断是否受控。
   */
  expanded?: boolean | null
  /** 显示源码中的 `import` 语句。默认 `false`(文档场景剥除)。 */
  showImports?: boolean
  /** shiki 双主题对。 */
  themes?: { light: string; dark: string }
  /** shiki 色调模式。 */
  colorScheme?: 'auto' | 'light' | 'dark'
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
 *
 * 正则匹配从行首 `import` 开始,允许 import 中间换行(`{ A,\n  B,\n}`),直到 `from '...'`
 * 结束(可选分号)+ 行末换行。Lazy 量词避免吞下后续 import。
 */
export function stripImports(source: string): string {
  return source
    .replace(/^[ \t]*import\b[^;]*?from\s+['"][^'"]+['"]\s*;?[ \t]*\n?/gm, '')
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import ZCode from './ZCode.vue'
import ZIcon from './ZIcon.vue'
import ZCopyButton from './ZCopyButton.vue'
import { BuiltinIcons } from './icons'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │ root div (border _border _thin / radius _small /       │
 *   │           bg _bg / overflow hidden)                    │
 *   │                                                        │
 *   │   ┌──────────────────────────────────────────────┐    │
 *   │   │ header (flex row / justifyBetween / gap small)│    │   pad-y _small / pad-x _middle
 *   │   │   ┌─────────────┐  ┌─────────────────────┐  │    │   bg _bgMuted
 *   │   │   │ <#header> / │  │ [⧉ 复制] [▾ 展开代码] │  │    │   border-bottom _thin
 *   │   │   │  title      │  │   (action group)     │  │    │
 *   │   │   └─────────────┘  └─────────────────────┘  │    │   按钮:textSecondary +
 *   │   └──────────────────────────────────────────────┘    │     hover bg textSecondary.alpha(8)
 *   │                                                        │
 *   │   ┌──────────────────────────────────────────────┐    │
 *   │   │ preview (slot default 实时示例)              │    │   pad _middle / bg _bg
 *   │   └──────────────────────────────────────────────┘    │
 *   │                                                        │
 *   │   ┌──────────────────────────────────────────────┐    │   v-show 折叠;
 *   │   │ <Transition>                                 │    │   transition: opacity + translateY
 *   │   │   <ZCode :code lang inline=false /> (border-│    │
 *   │   │   top _thin)                                 │    │
 *   │   │ </Transition>                                │    │
 *   │   └──────────────────────────────────────────────┘    │
 *   └────────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZCodeCardProps>(), {
  lang: 'vue',
  defaultExpanded: false,
  expanded: null,
  showImports: false,
  themes: () => ({ light: 'light-plus', dark: 'tokyo-night' }),
  colorScheme: 'auto',
  copyToastDuration: 1500,
})
const emit = defineEmits<ZCodeCardEmits>()

const theme = useZTheme()

// ─── 受控/非受控展开 ───
// 用 `expanded === null` 而非 `=== undefined` 判断未受控:Vue 把 absent boolean
// prop coerce 为 false,会让 `=== undefined` 判断永远 false。
const internalExpanded = ref(props.defaultExpanded)
const isControlled = computed(() => props.expanded !== null)
const expandedState = computed(() => (isControlled.value ? !!props.expanded : internalExpanded.value))

function toggle(): void {
  const next = !expandedState.value
  if (!isControlled.value) internalExpanded.value = next
  emit('update:expanded', next)
}

// ─── 复制 emit 透传(行为完全由 ZCopyButton 承担)───
function onCopy(success: boolean, text: string): void {
  emit('copy', success, text)
}

// ─── 处理后的源码(可选剥 import)───
const processedSource = computed(() =>
  props.showImports ? props.source : stripImports(props.source),
)

// ─── className ───
const rootClass = computed(() =>
  icss(theme.value, (s) => {
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
  icss(theme.value, (s) => {
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
  icss(theme.value, (s) => {
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
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap.iem(0.25)
    s.flexShrink(0)
  }),
)

const buttonClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap.iem(0.25)
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
    s.paddingLeft.iem(0.5)
    s.paddingRight.iem(0.5)
    s.borderWidth.px(0)
    s.borderRadius._tiny
    s.backgroundColor.transparent
    s.color._textSecondary
    s.fontSize._small
    s.lineHeight._tight
    s.cursor.pointer
    s.transitionProperty.all
    s.transitionDuration._tiny
    s._selector('&:hover', (h) => {
      h.backgroundColor._textSecondary.alpha(8)
      h.color._text
    })
    s._selector('&:focus-visible', (h) => {
      h.outlineWidth.px(2)
      h.outlineStyle.solid
      h.outlineColor._primary
      h.outlineOffset.px(1)
    })
  }),
)

const previewClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._middle
    s.backgroundColor._bg
  }),
)

const codeAreaClass = computed(() =>
  icss(theme.value, (s) => {
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
  }),
)

const transitionActiveClass = computed(() =>
  icss(theme.value, (s) => {
    s.transitionProperty.all
    s.transitionDuration._small
    s.transitionTimingFunction._default
  }),
)
const enterFromClass = computed(() =>
  icss(theme.value, (s) => {
    s.opacity._none
    s.transform('translateY(-0.25em)')
  }),
)
const leaveToClass = computed(() =>
  icss(theme.value, (s) => {
    s.opacity._none
    s.transform('translateY(-0.25em)')
  }),
)

// 监听受控 expanded 变化,保持 internal 同步(便于切换受控/非受控)
watch(
  () => props.expanded,
  (v) => {
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
          label="复制"
          copied-label="已复制"
          :toast-duration="copyToastDuration ?? 1500"
          @copy="onCopy"
        />
        <button
          type="button"
          :class="buttonClass"
          :aria-label="expandedState ? '收起代码' : '展开代码'"
          :aria-expanded="expandedState"
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

    <div :class="previewClass">
      <slot />
    </div>

    <Transition
      :enter-active-class="transitionActiveClass"
      :leave-active-class="transitionActiveClass"
      :enter-from-class="enterFromClass"
      :leave-to-class="leaveToClass"
    >
      <div v-show="expandedState" :class="codeAreaClass">
        <ZCode
          :code="processedSource"
          :lang="lang ?? 'vue'"
          :inline="false"
          :themes="themes ?? { light: 'light-plus', dark: 'tokyo-night' }"
          :color-scheme="colorScheme ?? 'auto'"
        />
      </div>
    </Transition>
  </div>
</template>
