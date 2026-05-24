<script lang="ts">
/**
 * `ZSteps` —— 步骤条。
 *
 * **API**(B6:删 status 业务语义字符串,改 chain color factory + boolean):
 * - `current?: number` —— 当前步骤(0-based,默认 0)。
 * - `items: ZStepItem[]`
 * - `vertical?: boolean` —— 纵向排列,默认 `false`(横向)
 * - `currentColor?: factory` —— 当前步色 carrier factory,默认 `_primary`;
 *   当 `errored=true` 时该 prop 被自动忽略,当前步走 `_danger`。
 * - `errored?: boolean` —— 当前步为错误态,默认 false。
 *   - true:当前步指示器走 `_danger` + close 图标
 *   - false:当前步走 `currentColor`(默认 `_primary`)+ 显示序号
 * - 已完成步骤(idx < current)固定走 `_success` + check 图标
 * - 未开始步骤(idx > current)固定走 `_textSecondary` + 透明背景 + 边框 `_border`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZStepItem {
  title: string
  description?: string
}

export interface ZStepsProps {
  current?: number
  items: ZStepItem[]
  /** 纵向排列,默认 `false`(横向)。 */
  vertical?: boolean
  /** 当前步色 carrier factory,默认 `_primary`(`errored=true` 时被忽略)。 */
  currentColor?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /** 当前步为错误态,默认 false;true 时走 `_danger` + close 图标。 */
  errored?: boolean
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
  vertical: false,
  errored: false,
})

const theme = useZTheme()

type StepState = 'wait' | 'process' | 'finish' | 'error'

function stepState(idx: number): StepState {
  if (idx < props.current) return 'finish'
  if (idx > props.current) return 'wait'
  return props.errored ? 'error' : 'process'
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection(props.vertical ? 'column' : 'row')
    s.color._text
    s.fontSize._small
    s.gap._middle
    props.css?.(s)
  }),
)

function stepClass(): string {
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems(props.vertical ? 'flex-start' : 'center')
    s.gap._small
    s.flexGrow(props.vertical ? 0 : 1)
    s.minWidth.px(0)
  })
}

/**
 * 步骤圆形指示器盒子模型(iem):
 * - width/height: 2iem,正圆
 * - border: _thin
 *
 * 颜色规则:
 * - finish → `_success` 背景 + `_bg` 前景
 * - process → `currentColor` factory(默认 `_primary`)填充背景 + `_bg` 前景
 * - error → `_danger` 背景 + `_bg` 前景
 * - wait → 透明背景 + `_textSecondary` 前景 + `_border` 边框
 */
function indicatorClass(state: StepState): string {
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
    if (state === 'finish') {
      s.backgroundColor._success
      s.color._bg
      s.borderColor.transparent
    } else if (state === 'error') {
      s.backgroundColor._danger
      s.color._bg
      s.borderColor.transparent
    } else if (state === 'process') {
      // 当前步:用户 currentColor factory 优先;否则默认 _primary
      if (props.currentColor) {
        props.currentColor(s.backgroundColor as unknown as Chain<ZuiSchema>['color'])
      } else {
        s.backgroundColor._primary
      }
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
