<script setup lang="ts" generic="S extends ThemeSchema = ThemeSchema">
/**
 * `ZConfigProvider` —— ui-vue 顶层/嵌套配置注入器。
 *
 * 同时承载 4 类上下文，并允许嵌套时只覆盖部分维度：
 *
 *   1. theme           —— 完整 `Theme<S>` 实例（替换父）
 *   2. themePatch      —— `DeepPartial<S>` 局部补丁（合并到父；与 theme 互斥取先 theme 后 patch）
 *   3. componentTokens —— `ComponentTokenOverrides`，与父层"key 级浅合并"
 *   4. locale          —— 完整 `ZLocale`（替换父）；或 localePatch（合并）
 *   5. timezone        —— IANA 时区，未传继承父
 *   6. dateLocale      —— date-fns Locale，未传继承父
 *
 * **根 Provider** 没传 `theme` 时回落 `defaultLight.resolve()` 并 dev warn。
 */
import { computed, inject, provide, type Ref } from 'vue'
import {
  defaultLight,
  mergeComponentTokenOverrides,
  mergeTheme,
  type ComponentTokenOverrides,
  type DeepPartial,
  type ResolvedTheme,
  type Theme,
  type ThemeSchema,
} from '@kenconnet666/zui-core'
import type { Locale as DateFnsLocale } from 'date-fns'
import {
  Z_DATE_KEY,
  Z_LOCALE_KEY,
  Z_OVERRIDES_KEY,
  Z_THEME_KEY,
  type ZDateConfig,
} from './keys'
import { mergeLocale } from '../locale/merge'
import { zhCN } from '../locale/zh-CN'
import type { ZLocale, ZLocalePartial } from '../locale/types'

const props = withDefaults(
  defineProps<{
    /** 完整主题（顶层推荐）。`Theme<S>` 实例。 */
    theme?: Theme<S>
    /** 主题局部补丁（嵌套推荐）。 */
    themePatch?: DeepPartial<S>
    /** 组件 token override（嵌套时与父浅合并）。 */
    componentTokens?: ComponentTokenOverrides
    /** 完整 locale（替换父）。 */
    locale?: ZLocale
    /** locale 局部补丁。 */
    localePatch?: ZLocalePartial
    /** IANA 时区，如 'Asia/Shanghai'。未传继承父；根 Provider 未传时回落 'UTC'。 */
    timezone?: string
    /** date-fns Locale 对象。未传继承父。 */
    dateLocale?: DateFnsLocale
  }>(),
  {},
)

defineSlots<{
  default(props: { theme: ResolvedTheme<S>; locale: ZLocale }): unknown
}>()

// ─── 父层 inject（可能不存在 → 用 fallback） ───
const parentTheme = inject<Ref<ResolvedTheme<S>> | null>(Z_THEME_KEY, null)
const parentOverrides = inject<Ref<ComponentTokenOverrides> | null>(Z_OVERRIDES_KEY, null)
const parentLocale = inject<Ref<ZLocale> | null>(Z_LOCALE_KEY, null)
const parentDate = inject<Ref<ZDateConfig> | null>(Z_DATE_KEY, null)

// ─── theme 合并（顶层 fallback defaultLight） ───
const mergedTheme = computed<ResolvedTheme<S>>(() => {
  // ① 优先用 props.theme（完整替换）
  if (props.theme) {
    const base = props.theme.resolve() as ResolvedTheme<S>
    if (props.themePatch) {
      return mergeTheme(base, props.themePatch) as ResolvedTheme<S>
    }
    return base
  }
  // ② 用 themePatch 合并到 parent / fallback
  if (props.themePatch) {
    const base = parentTheme?.value ?? (defaultLight.resolve() as unknown as ResolvedTheme<S>)
    return mergeTheme(base, props.themePatch) as ResolvedTheme<S>
  }
  // ③ 都没传 → 直接用 parent / fallback
  if (parentTheme) return parentTheme.value
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      '[zui-vue/ZConfigProvider] 没有父 Provider 且未传 theme/themePatch，回落 defaultLight。' +
        '\n  根 Provider 建议显式传 `:theme="myTheme"`。',
    )
  }
  return defaultLight.resolve() as unknown as ResolvedTheme<S>
})

// ─── componentTokens 浅合并 ───
const mergedOverrides = computed<ComponentTokenOverrides>(() =>
  mergeComponentTokenOverrides(parentOverrides?.value, props.componentTokens),
)

// ─── locale 合并 ───
const mergedLocale = computed<ZLocale>(() => {
  if (props.locale) {
    return props.localePatch ? mergeLocale(props.locale, props.localePatch) : props.locale
  }
  const base = parentLocale?.value ?? zhCN
  return props.localePatch ? mergeLocale(base, props.localePatch) : base
})

// ─── date 配置（timezone / dateLocale 各自继承）───
const mergedDate = computed<ZDateConfig>(() => {
  const parentTz = parentDate?.value.timezone
  const parentDl = parentDate?.value.locale
  return {
    timezone: props.timezone ?? parentTz ?? 'UTC',
    locale: props.dateLocale ?? parentDl,
  }
})

provide(Z_THEME_KEY, mergedTheme)
provide(Z_OVERRIDES_KEY, mergedOverrides)
provide(Z_LOCALE_KEY, mergedLocale)
provide(Z_DATE_KEY, mergedDate)

defineExpose({
  theme: mergedTheme,
  componentTokens: mergedOverrides,
  locale: mergedLocale,
  date: mergedDate,
})
</script>

<template>
  <slot :theme="mergedTheme" :locale="mergedLocale" />
</template>
