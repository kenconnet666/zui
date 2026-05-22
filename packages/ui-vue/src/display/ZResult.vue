<script lang="ts">
/**
 * `ZResult` —— 结果状态展示(类 antd Result)。
 *
 * **5 种 status**:`success` / `info` / `warning` / `error` / `404`
 *
 * - `title?: string`
 * - `description?: string`
 * - slots:`#icon`(覆盖默认大图标)/ default(操作按钮区)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZResultStatus = 'success' | 'info' | 'warning' | 'error' | '404'

export interface ZResultProps {
  status?: ZResultStatus
  title?: string
  description?: string
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZResultProps>(), {
  status: 'info',
})

const theme = useZTheme()

const STATUS_ICON: Record<ZResultStatus, keyof typeof BuiltinIcons> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
  404: 'warning',
}

const STATUS_COLOR: Record<ZResultStatus, 'success' | 'info' | 'warning' | 'danger'> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'danger',
  404: 'textSecondary' as 'info', // typescript:语义降级 — 404 用 textSecondary
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.justifyContent.center
    s.gap._small
    s.padding._huge
    s.color._text
    s.fontSize._middle
    props.css?.(s)
  }),
)

const iconWrapClass = computed(() =>
  icss(theme.value, (s) => {
    const colorKey = `_${STATUS_COLOR[props.status]}` as const
    s.display.inlineFlex
    s.color[colorKey]
    s.fontSize.iem(4)
  }),
)

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._huge
    s.fontWeight._semibold
    s.color._text
    s._prop('textAlign', 'center')
  }),
)

const descClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._middle
    s.color._textSecondary
    s._prop('textAlign', 'center')
    s._prop('maxWidth', '480px')
  }),
)

const actionsClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.gap._small
    s.marginTop._small
  }),
)

const iconNode = computed(() => h(ZIcon, { component: BuiltinIcons[STATUS_ICON[props.status]] }))
</script>

<template>
  <div :class="rootClass" role="status">
    <span :class="iconWrapClass">
      <slot name="icon">
        <component :is="iconNode" />
      </slot>
    </span>
    <div v-if="title" :class="titleClass">{{ title }}</div>
    <div v-if="description" :class="descClass">{{ description }}</div>
    <div v-if="$slots.default" :class="actionsClass">
      <slot />
    </div>
  </div>
</template>
