<script lang="ts">
/**
 * `ZSteps` —— 步骤条。
 *
 * - `current: number` —— 当前步骤(0-based)
 * - `items: Array<{ title, description? }>`
 * - `direction?: 'horizontal' | 'vertical'`
 * - `status?: 'process' | 'finish' | 'error'` —— 当前步骤状态
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZStepItem {
  title: string
  description?: string
}

export type ZStepsStatus = 'process' | 'finish' | 'error'
export type ZStepsDirection = 'horizontal' | 'vertical'

export interface ZStepsProps {
  current?: number
  items: ZStepItem[]
  direction?: ZStepsDirection
  status?: ZStepsStatus
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZStepsProps>(), {
  current: 0,
  direction: 'horizontal',
  status: 'process',
})

const theme = useZTheme()

function stepState(idx: number): 'wait' | 'process' | 'finish' | 'error' {
  if (idx < props.current) return 'finish'
  if (idx > props.current) return 'wait'
  return props.status === 'error' ? 'error' : 'process'
}

const STATE_COLOR: Record<ReturnType<typeof stepState>, 'primary' | 'success' | 'danger' | 'textSecondary'> = {
  process: 'primary',
  finish: 'success',
  wait: 'textSecondary',
  error: 'danger',
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection(props.direction === 'vertical' ? 'column' : 'row')
    s.color._text
    s.fontSize._small
    s.gap._middle
    props.css?.(s)
  }),
)

function stepClass(): string {
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems(props.direction === 'vertical' ? 'flex-start' : 'center')
    s.gap._small
    s.flexGrow(props.direction === 'vertical' ? 0 : 1)
    s.minWidth.px(0)
  })
}

function indicatorClass(state: ReturnType<typeof stepState>): string {
  const colorKey = STATE_COLOR[state]
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    s.width.iem(2)
    s.height.iem(2)
    s.borderRadius._full
    s.fontWeight._semibold
    s.fontSize._small
    s.borderWidth._thin
    s.borderStyle.solid
    if (state === 'finish' || state === 'process' || state === 'error') {
      s.backgroundColor[`_${colorKey}` as const]
      s.color._bg
      s.borderColor.transparent
    } else {
      s.backgroundColor.transparent
      s.color._textSecondary
      s.borderColor._border
    }
  })
}

const titleWrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
    s.minWidth.px(0)
  }),
)
const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontWeight._semibold
    s.color._text
  }),
)
const descClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
  }),
)

const checkIcon = computed(() => h(ZIcon, { component: BuiltinIcons.check }))
const errorIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
</script>

<template>
  <div :class="rootClass" role="list">
    <div v-for="(item, i) in items" :key="i" :class="stepClass()" role="listitem">
      <span :class="indicatorClass(stepState(i))">
        <component v-if="stepState(i) === 'finish'" :is="checkIcon" />
        <component v-else-if="stepState(i) === 'error'" :is="errorIcon" />
        <template v-else>{{ i + 1 }}</template>
      </span>
      <div :class="titleWrapClass">
        <div :class="titleClass">{{ item.title }}</div>
        <div v-if="item.description" :class="descClass">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>
