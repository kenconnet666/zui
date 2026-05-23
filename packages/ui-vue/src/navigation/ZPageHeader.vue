<script lang="ts">
/**
 * `ZPageHeader` —— 页面头(返回按钮 + 标题 + 子标题 + 操作区)。
 *
 * - `title?: string`
 * - `subtitle?: string`
 * - `showBack?: boolean` —— 显示返回箭头按钮,默认 true
 * - emit `back` —— 返回按钮点击
 * - slot `extra`(右侧操作区)/ `footer`(底部 tabs 或 description)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZPageHeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZPageHeaderEmits {
  (e: 'back'): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZPageHeaderProps>(), {
  showBack: true,
})

const emit = defineEmits<ZPageHeaderEmits>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.gap._small
    s.padding._middle
    s.backgroundColor._bg
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    props.css?.(s)
  }),
)

const headRowClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._small
  }),
)

const backBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding._tiny
    s.color._text
    s.borderRadius._tiny
    s._hover((h2) => {
      h2.backgroundColor._bgMuted
    })
  }),
)

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._huge
    s.fontWeight._semibold
    s.color._text
    s.lineHeight._tight
  }),
)

const subtitleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._small
    s.color._textSecondary
    s.marginLeft._small
  }),
)

const extraClass = computed(() =>
  icss(theme.value, (s) => {
    s.marginLeft.auto
    s.display.flex
    s.gap._small
  }),
)

const footerClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
  }),
)

const leftIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronLeft }))
</script>

<template>
  <header :class="rootClass">
    <div :class="headRowClass">
      <button
        v-if="showBack"
        type="button"
        :class="backBtnClass"
        aria-label="返回"
        @click="emit('back')"
      >
        <component :is="leftIcon" />
      </button>
      <h1 v-if="title" :class="titleClass">{{ title }}</h1>
      <span v-if="subtitle" :class="subtitleClass">{{ subtitle }}</span>
      <div v-if="$slots.extra" :class="extraClass">
        <slot name="extra" />
      </div>
    </div>
    <div v-if="$slots.footer" :class="footerClass">
      <slot name="footer" />
    </div>
  </header>
</template>
