<script lang="ts">
/**
 * `CodeBlock` —— docs 站点「独立代码片段」块(指南 / 概念页用,非示例卡片)。
 *
 * **为什么存在**:过去指南页的代码片段直接用 `<ZCode :inline="false">`,走 ZCode 默认
 * 主题(light-plus / tokyo-night),不跟随 `ZCodeCard` 的全站代码主题选择器,导致与示例
 * 卡片里的代码块主题 / 样式不一致。`CodeBlock` 复用 ui-vue 导出的 `globalCodeTheme`,让所有
 * 独立代码片段与示例卡片**主题统一、可全站联动切换**,并自带复制按钮 + 主题选择器
 * (= 一个「可调节主题的代码块」,但无预览 / 无折叠,适合纯代码片段场景)。
 *
 * **API**:
 * - `code: string` —— 代码文本(必传)
 * - `lang?: string` —— shiki 语言,默认 `'ts'`
 * - `title?: string` —— 左侧标签,缺省显示 `lang`
 */
export interface CodeBlockProps {
  code: string
  lang?: string
  title?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import {
  useZTheme,
  ZCode,
  ZCopyButton,
  ZSelect,
  CODE_THEMES,
  globalCodeTheme,
  setCodeTheme,
} from '@kenconnet666/zui-vue'
import type { ZSelectValue } from '@kenconnet666/zui-vue'

const props = withDefaults(defineProps<CodeBlockProps>(), {
  lang: 'ts',
  title: '',
})

const theme = useZTheme()

// 全站共享代码主题(与所有 ZCodeCard 实例联动,持久化 localStorage)。
const themeOptions = CODE_THEMES.map(t => ({ value: t.value, label: t.label }))
function onThemeSelect(value: ZSelectValue | ZSelectValue[] | null): void {
  if (typeof value === 'string') setCodeTheme(value)
}

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.block
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.borderRadius._small
    s.backgroundColor._bg
    s.overflow.hidden
  }),
)

const headerClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._small
    s.paddingTop._tiny
    s.paddingBottom._tiny
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
    s.fontFamily._mono
    s.fontSize._small
    s.fontWeight._medium
    s.color._textSecondary
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

const bodyClass = computed(() =>
  icss(theme.value, s => {
    // 内层 ZCode 的 .shiki 自带 border / radius,这里去掉,避免与卡片外框双重边框
    s._selector('& .shiki', sub => {
      sub.borderWidth._none
      sub.borderRadius.px(0)
    })
  }),
)
</script>

<template>
  <div :class="rootClass">
    <div :class="headerClass">
      <span :class="titleClass">{{ title || lang }}</span>
      <div :class="actionsClass">
        <ZCopyButton :text="code" copied-label="已复制" label="复制" />
        <!-- 全站联动代码主题选择器(同 ZCodeCard) -->
        <ZSelect
          :dropdown-max-height="20"
          :options="themeOptions"
          :size="0.875"
          :value="globalCodeTheme"
          @update:value="onThemeSelect"
        />
      </div>
    </div>
    <div :class="bodyClass">
      <ZCode
        :code="code"
        :inline="false"
        :lang="lang"
        :themes="{ light: globalCodeTheme, dark: globalCodeTheme }"
        color-scheme="auto"
      />
    </div>
  </div>
</template>
