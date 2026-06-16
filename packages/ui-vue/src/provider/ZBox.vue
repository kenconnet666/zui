<script setup lang="ts">
/**
 * `ZBox` —— ui-vue **底层多用途容器** + **顶层/嵌套配置注入器**(原 `ZConfigProvider`,v0.x 改名)。
 *
 * 同时承载多类职能:
 *
 * **1. 主题/locale/timezone 注入**:
 *   - `theme`     —— 完整 `Theme<ZuiSchema>` 实例(替换父)
 *   - `themePatch`—— `DeepPartial<ZuiSchema>` 局部补丁(合并到父;与 theme 互斥取先 theme 后 patch)
 *   - `locale`    —— 完整 `ZLocale`(替换父)/ `localePatch`(合并)
 *   - `timezone`  —— IANA 时区,未传继承父
 *   - `dateLocale`—— date-fns Locale,未传继承父
 *
 * **2. 底层 box 容器**(跟 `<ZIcon>` 的 `css` 范式一致):
 *   - `css`   —— `(s: Chain<ZuiSchema>) => void` factory,自由写任意样式
 *   - `tag`       —— wrapper 元素 tag,默认 `'div'`
 *
 * 用一个组件解决两件常见事:**「我需要包一层 div 来切换主题」** 和
 * **「我需要在某段子树加几行 css(背景/边距/弹性)」**。
 *
 * **尺寸基准 = px**(0.9.x 起已移除自创 iem 逻辑单位,对齐 Element Plus / Naive UI 纯 px 模式)。
 * 需要整站等比缩放走原生 `rem`(改根字号)或 `vw`,不再由 ZBox 注入逻辑单位。
 *
 * **根 Provider** 没传 `theme` 时回落 `zuiLight.resolve()` 并 dev warn。
 *
 * **嵌套行为**:子 ZBox 通过 Vue inject 链路继承父 theme/locale/date,可局部覆盖,兄弟独立。
 *
 * **典型用法**:
 *
 * ```vue
 * <!-- 1. 纯主题注入(根 Provider) -->
 * <ZBox :theme="zuiLight">
 *   <App />
 * </ZBox>
 *
 * <!-- 2. 局部主题补丁 -->
 * <ZBox :theme-patch="{ color: { primary: '#0066ff' } }">
 *   <Sidebar />
 * </ZBox>
 *
 * <!-- 3. 只当 box 用(加点 padding/边距) -->
 * <ZBox :css="(s) => { s.padding._middle; s.borderRadius._small; s.background.color._bgMuted }">
 *   <SomeContent />
 * </ZBox>
 * ```
 *
 * 用户工程要扩自家 brand:定义 `interface MySchema extends ZuiSchema { ... }`,
 * 基于 `zuiLight.schema` 派生 `Theme<MySchema>`,传给 `:theme`。要单点改色 / 加品牌色,
 * 走 `UserColorExt` augmentation 或 `:css`(skill §13.0 三层覆盖模型)。
 */
import { computed, inject, provide, type Ref } from 'vue'
import {
  icss,
  mergeTheme,
  type Chain,
  type DeepPartial,
  type ResolvedTheme,
  type Theme,
} from '@kenconnet666/zui-core'
import { zuiLight } from './theme'
import type { ZuiSchema } from './theme'
import type { Locale as DateFnsLocale } from 'date-fns'
import { Z_DATE_KEY, Z_LOCALE_KEY, Z_THEME_KEY, type ZDateConfig } from './keys'
import { mergeLocale } from './locale/merge'
import { zhCN } from './locale/zh-CN'
import type { ZLocale, ZLocalePartial } from './locale/types'
import { themeColorScheme } from '../_internal/colorScheme'

const props = withDefaults(
  defineProps<{
    /**
     * 完整主题(顶层推荐)。Theme 实例。
     *
     * 类型用 `Theme<any>` 而非 `Theme<ZuiSchema>` —— `Theme<T>` 的 `merge<P>(...)`
     * 让 T 同时出现在输入与输出位置(invariant),写 `Theme<ZuiSchema>` 会拒收
     * `Theme<MyBrandSchema extends ZuiSchema>` 等更具体的实例。Provider 内部不依赖
     * 具体 T,统一在 `.resolve()` 后 cast 成 `ResolvedTheme<ZuiSchema>` 注入即可。
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme?: Theme<any>
    /** 主题局部补丁(嵌套推荐)。 */
    themePatch?: DeepPartial<ZuiSchema>
    /** 完整 locale(替换父)。 */
    locale?: ZLocale
    /** locale 局部补丁。 */
    localePatch?: ZLocalePartial
    /** IANA 时区,如 'Asia/Shanghai'。未传继承父;根 Provider 未传时回落 'UTC'。 */
    timezone?: string
    /** date-fns Locale 对象。未传继承父。 */
    dateLocale?: DateFnsLocale

    /**
     * wrapper 元素的 css factory —— 用 zui-core chain 自由写任意样式。
     *
     * 在 ZBox wrapper(默认 `<div>`)上挂一个 emotion class,可以写 padding/margin/
     * background/borderRadius、`_hover` 伪类、`_media('_small', ...)` 媒体查询等。
     *
     * **chain 接到的 theme 是合并后的 mergedTheme**(`props.theme` + `themePatch` + 父 Provider),
     * 因此 schema token(`s.padding._middle`、`s.color._primary`)用的是 ZBox 自身的 theme。
     *
     * @example
     * <ZBox :css="(s) => {
     *   s.padding._middle
     *   s.borderRadius._small
     *   s.background.color._bgMuted
     *   s._hover(h => h.background.color._bg)
     * }">
     *   ...
     * </ZBox>
     */
    css?: (s: Chain<ZuiSchema>) => void

    /**
     * wrapper 元素 tag,默认 `'div'`。
     *
     * 语义化场景下传 `'section'` / `'article'` / `'aside'` / `'header'` / `'footer'` /
     * `'nav'` / `'main'` 等。
     */
    tag?: string
  }>(),
  {
    tag: 'div',
  },
)

defineSlots<{
  default(props: { theme: ResolvedTheme<ZuiSchema>; locale: ZLocale }): unknown
}>()

// ─── 父层 inject(可能不存在 → 用 fallback) ───
const parentTheme = inject<Ref<ResolvedTheme<ZuiSchema>> | null>(Z_THEME_KEY, null)
const parentLocale = inject<Ref<ZLocale> | null>(Z_LOCALE_KEY, null)
const parentDate = inject<Ref<ZDateConfig> | null>(Z_DATE_KEY, null)

// ─── theme 合并(顶层 fallback zuiLight) ───
const mergedTheme = computed<ResolvedTheme<ZuiSchema>>(() => {
  // ① 优先用 props.theme(完整替换)
  if (props.theme) {
    const base = props.theme.resolve() as ResolvedTheme<ZuiSchema>
    if (props.themePatch) {
      return mergeTheme(base, props.themePatch) as ResolvedTheme<ZuiSchema>
    }
    return base
  }
  // ② 用 themePatch 合并到 parent / fallback
  if (props.themePatch) {
    const base = parentTheme?.value ?? (zuiLight.resolve() as ResolvedTheme<ZuiSchema>)
    return mergeTheme(base, props.themePatch) as ResolvedTheme<ZuiSchema>
  }
  // ③ 都没传 → 直接用 parent / fallback
  if (parentTheme) return parentTheme.value
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') {
    console.warn(
      '[zui-vue/ZBox] 没有父 Provider 且未传 theme/themePatch,回落 zuiLight。' +
        '\n  根 ZBox 建议显式传 `:theme="zuiLight"` 或你自家的 Theme 实例。',
    )
  }
  return zuiLight.resolve() as ResolvedTheme<ZuiSchema>
})

// ─── locale 合并 ───
const mergedLocale = computed<ZLocale>(() => {
  if (props.locale) {
    return props.localePatch ? mergeLocale(props.locale, props.localePatch) : props.locale
  }
  const base = parentLocale?.value ?? zhCN
  return props.localePatch ? mergeLocale(base, props.localePatch) : base
})

// ─── date 配置(timezone / dateLocale 各自继承)───
const mergedDate = computed<ZDateConfig>(() => {
  const parentTz = parentDate?.value.timezone
  const parentDl = parentDate?.value.locale
  return {
    timezone: props.timezone ?? parentTz ?? 'UTC',
    locale: props.dateLocale ?? parentDl,
  }
})

provide(Z_THEME_KEY, mergedTheme)
provide(Z_LOCALE_KEY, mergedLocale)
provide(Z_DATE_KEY, mergedDate)

// ─── color-scheme（让浏览器用对应模式渲染原生元素：滚动条、input 等） ───
const boxStyle = computed<Record<string, string>>(() => ({
  'color-scheme': themeColorScheme(mergedTheme.value),
}))

// ─── css factory → emotion className(用合并后的 theme,跟子组件一致) ───
const className = computed<string | undefined>(() => {
  if (!props.css) return undefined
  return icss(mergedTheme.value, props.css)
})

defineExpose({
  theme: mergedTheme,
  locale: mergedLocale,
  date: mergedDate,
})
</script>

<template>
  <component :is="tag" :class="className" :style="boxStyle">
    <slot :theme="mergedTheme" :locale="mergedLocale" />
  </component>
</template>
