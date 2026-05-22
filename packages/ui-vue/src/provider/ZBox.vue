<script setup lang="ts">
/**
 * `ZBox` —— ui-vue **底层多用途容器** + **顶层/嵌套配置注入器**(原 `ZConfigProvider`,v0.x 改名)。
 *
 * 同时承载多类职能:
 *
 * **1. 主题/locale/iem/timezone 注入**(原 ZConfigProvider 全部能力,API 不变):
 *   - `theme`     —— 完整 `Theme<ZuiSchema>` 实例(替换父)
 *   - `themePatch`—— `DeepPartial<ZuiSchema>` 局部补丁(合并到父;与 theme 互斥取先 theme 后 patch)
 *   - `locale`    —— 完整 `ZLocale`(替换父)/ `localePatch`(合并)
 *   - `timezone`  —— IANA 时区,未传继承父
 *   - `dateLocale`—— date-fns Locale,未传继承父
 *   - `iem`       —— 逻辑单位 iem 的物理映射,写到 wrapper inline `--zui-iem`
 *
 * **2. 底层 box 容器**(新增,跟 `<ZIcon>` 的 `cssRoot` 范式一致):
 *   - `cssRoot`   —— `(s: Chain<ZuiSchema>) => void` factory,自由写任意样式
 *   - `tag`       —— wrapper 元素 tag,默认 `'div'`
 *
 * 用一个组件解决两件常见事:**「我需要包一层 div 来切换主题/iem」** 和
 * **「我需要在某段子树加几行 css(背景/边距/弹性)」**。
 *
 * **根 Provider** 没传 `theme` 时回落 `zuiLight.resolve()` 并 dev warn。
 *
 * **嵌套行为**:CSS cascade 天然支持。每个 ZBox 的 wrapper `<div>` 写 inline `--zui-iem` +
 * 自己的 className,子组件通过浏览器 CSS 引擎自动找最近祖先值。嵌套覆盖、兄弟独立都是天然的,
 * **零运行时合并开销**(详见 `.claude/decisions/2026-05-22-iem-rename-and-base-font-size.md`)。
 *
 * **典型用法**:
 *
 * ```vue
 * <!-- 1. 纯主题注入(根 Provider) -->
 * <ZBox :theme="zuiLight">
 *   <App />
 * </ZBox>
 *
 * <!-- 2. 局部主题补丁 + 大字模式 -->
 * <ZBox :theme-patch="{ color: { primary: '#0066ff' } }" :iem="ZIemPreset.large">
 *   <Sidebar />
 * </ZBox>
 *
 * <!-- 3. 只当 box 用(加点 padding/边距) -->
 * <ZBox :css-root="(s) => { s.padding._middle; s.borderRadius._small; s.background.color._bgMuted }">
 *   <SomeContent />
 * </ZBox>
 *
 * <!-- 4. 三合一(主题 + box 样式 + tag) -->
 * <ZBox
 *   tag="section"
 *   :iem="'18px'"
 *   :theme-patch="{ color: { primary: '#0066ff' } }"
 *   :css-root="(s) => { s.padding._large; s.margin._huge }"
 * >
 *   ...
 * </ZBox>
 * ```
 *
 * 用户工程要扩自家 brand:定义 `interface MySchema extends ZuiSchema { ... }`,
 * 基于 `zuiLight.schema` 派生 `Theme<MySchema>`,传给 `:theme`。要单点改色 / 加品牌色,
 * 走 `UserColorExt` augmentation 或 `:css-root`(skill §13.0 三层覆盖模型)。
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
import { zuiLight } from '../theme'
import type { ZuiSchema } from '../theme'
import type { Locale as DateFnsLocale } from 'date-fns'
import { Z_DATE_KEY, Z_LOCALE_KEY, Z_THEME_KEY, type ZDateConfig } from './keys'
import { mergeLocale } from '../locale/merge'
import { zhCN } from '../locale/zh-CN'
import type { ZLocale, ZLocalePartial } from '../locale/types'

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
     * **逻辑单位 iem 的物理映射 —— 全站 sizing 单点切换器**。
     *
     * `iem` = "我自己使用的 em",跟 CSS `rem`(root em)对称 —— Provider 注入的基准倍率,
     * 默认 1iem = 16px(等同 1rem)。
     *
     * 写入 wrapper inline `style="--zui-iem: ..."`,ui-vue 所有 iem 化 token
     * (`spacing` / `radius` / `fontSize` / `blur` 等)经 `calc(N * var(--zui-iem, 16px))`
     * 自动 resolve 到该基准。**嵌套 Provider 通过 css cascade 自然覆盖,兄弟 Provider 各自
     * 独立 —— 零运行时合并开销**。
     *
     * 接受任意 css length 字符串或纯数字(数字按 px 处理):
     * - 不传 / `'16px'`(`ZIemPreset.default`)—— 默认,1iem = 16px
     * - `'20px'`(`ZIemPreset.large`)—— 大字模式,整站放大 25%
     * - `'14px'`(`ZIemPreset.compact`)—— 紧凑模式
     * - `'1em'`(`ZIemPreset.em`)—— 跟父字号,嵌套自动
     * - `'1rem'`(`ZIemPreset.rem`)—— 跟浏览器根字号,a11y 大字模式立即生效
     * - `'0.05vw'` —— 响应式 fluid sizing
     * - `'clamp(14px, 1vw, 20px)'` —— 任意 css length 表达式
     *
     * **不影响**:`breakpoint`(媒体查询基准)/ `shadow`(保留 px 字面量)/ `duration` 等非长度 token。
     */
    iem?: string | number

    /**
     * wrapper 元素的 css factory —— 用 zui-core chain 自由写任意样式。
     *
     * 在 ZBox wrapper(默认 `<div>`)上挂一个 emotion class,可以写 padding/margin/
     * background/borderRadius、`_hover` 伪类、`_media('_small', ...)` 媒体查询等。
     * **任何"想给子树包一层带样式的容器"的场景都用这里**,无需再嵌一个 `<ZIcon>` 类样的
     * 装饰组件。
     *
     * **chain 接到的 theme 是合并后的 mergedTheme**(`props.theme` + `themePatch` + 父 Provider),
     * 因此 schema token(`s.padding._middle`、`s.color._primary`)用的是 ZBox 自身的 theme,
     * 而非父 Provider 的 theme。
     *
     * @example
     * <ZBox :css-root="(s) => {
     *   s.padding._middle
     *   s.borderRadius._small
     *   s.background.color._bgMuted
     *   s._hover(h => h.background.color._bg)
     * }">
     *   ...
     * </ZBox>
     */
    cssRoot?: (s: Chain<ZuiSchema>) => void

    /**
     * wrapper 元素 tag,默认 `'div'`。
     *
     * 语义化场景下传 `'section'` / `'article'` / `'aside'` / `'header'` / `'footer'` /
     * `'nav'` / `'main'` 等。
     */
    tag?: string
  }>(),
  {
    iem: '16px',
    tag: 'div',
  },
)

// ─── iem → css var 注入(写到 wrapper inline style,子组件通过 css cascade 自动读取) ───
const iemStyle = computed(() => ({
  '--zui-iem': typeof props.iem === 'number' ? `${props.iem}px` : props.iem,
}))

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

// ─── cssRoot factory → emotion className(用合并后的 theme,跟子组件一致) ───
const className = computed<string | undefined>(() => {
  if (!props.cssRoot) return undefined
  return icss(mergedTheme.value, props.cssRoot)
})

defineExpose({
  theme: mergedTheme,
  locale: mergedLocale,
  date: mergedDate,
})
</script>

<template>
  <component :is="tag" :class="className" :style="iemStyle">
    <slot :theme="mergedTheme" :locale="mergedLocale" />
  </component>
</template>
