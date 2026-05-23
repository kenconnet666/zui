<script lang="ts">
/**
 * `ZSpin` —— 加载指示器(类 antd Spin / naive NSpin)。
 *
 * **两种模式**:
 * 1. **包裹模式**(有 default slot):浮层覆盖 slot 内容,加载 indicator 居中显示
 * 2. **纯 indicator 模式**(无 slot):只渲染 indicator 本身,适合 inline 场景(按钮 loading 等)
 *
 * **API**:
 * - `spinning: boolean` —— 是否处于加载态(默认 `true`)
 * - `size: 'small' | 'middle' | 'large'` —— indicator 尺寸(默认 `'middle'`,对应 iem 1/1.5/2)
 * - `tip?: string` —— 加载文字(浮层模式下显示在 indicator 下方)
 * - `sxOverlay` —— 覆盖层(包裹模式)
 * - `sxIndicator` —— indicator 容器
 *
 * **默认 indicator**:`<ZIcon :component="BuiltinIcons.refresh" :spin="(d) => d.s(1)" />`。
 * 用户自定义 indicator 走 `#indicator` slot。
 *
 * **a11y**:`role="status"` + `aria-busy="true"`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { SizeProp } from '../_internal/size-prop'

export interface ZSpinProps {
  /** 是否加载中,默认 `true`(因为通常 v-if/外控,组件内不需 false 时仍渲染)。 */
  spinning?: boolean
  /** indicator 尺寸 —— `factory | Size5 | undefined` union。 */
  size?: SizeProp<'width'>
  /** 加载文字(包裹模式下显示在 indicator 下方)。 */
  tip?: string
  /** 包裹模式下覆盖层 sx 配置。 */
  sxOverlay?: SxObject
  /** indicator 容器 sx 配置。 */
  sxIndicator?: SxObject
  /** 根元素二次覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'div'`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed, h, useSlots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import type { SizeMap } from '../_internal/size-prop'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZSpinProps>(), {
  spinning: true,
  size: 'middle',
  tag: 'div',
})

const slots = useSlots()
const theme = useZTheme()

const hasDefaultSlot = computed(() => !!slots.default)

/** ZSpin indicator 尺寸 —— ZSpin 默认 middle 比 ZIcon 默认大一档(spinner 通常更醒目)。 */
const SPIN_SIZE_MAP: SizeMap<Chain<ZuiSchema>['width']> = {
  tiny: (w) => {
    w.iem(0.875)
  },
  small: (w) => {
    w.iem(1)
  },
  middle: (w) => {
    w.iem(1.5)
  },
  large: (w) => {
    w.iem(2)
  },
  huge: (w) => {
    w.iem(2.5)
  },
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    if (hasDefaultSlot.value) {
      s.position.relative
      s.display.block
    } else {
      s.display.inlineFlex
      s.alignItems.center
      s.justifyContent.center
    }

    props.css?.(s)
  }),
)

const overlayClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s._prop('inset', '0')
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.justifyContent.center
    s.gap._tiny
    s.backgroundColor._bg.alpha(60)
    s.color._primary
    s.zIndex._small
    applySx(s, props.sxOverlay)
  }),
)
const sxOverlayAttrs = computed(() => extractSxAttrs(props.sxOverlay))

const indicatorClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.color._primary
    applySx(s, props.sxIndicator)
  }),
)
const sxIndicatorAttrs = computed(() => extractSxAttrs(props.sxIndicator))

const tipClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._small
    s.color._textSecondary
  }),
)

/** 规范化 size 为 factory(传给 ZIcon size)。 */
const indicatorSize = computed(() => {
  if (typeof props.size === 'string') return SPIN_SIZE_MAP[props.size]
  return props.size
})

const defaultIndicator = computed(() =>
  h(ZIcon, {
    component: BuiltinIcons.refresh,
    spin: (d: Chain<ZuiSchema>['animationDuration']) => {
      d.s(1)
    },
    size: indicatorSize.value,
  }),
)

const wrapContentClass = computed(() =>
  icss(theme.value, (s) => {
    if (props.spinning) {
      s.opacity._dim
      s.pointerEvents.none
      s._prop('userSelect', 'none')
    }
  }),
)
</script>

<template>
  <component :is="tag" :class="rootClass" role="status" :aria-busy="spinning">
    <template v-if="hasDefaultSlot">
      <!-- 包裹模式 -->
      <div :class="wrapContentClass">
        <slot />
      </div>
      <div
        v-if="spinning"
        :class="[overlayClass, sxOverlayAttrs.class]"
        :style="sxOverlayAttrs.style"
        v-bind="sxOverlayAttrs.attrs"
      >
        <div
          :class="[indicatorClass, sxIndicatorAttrs.class]"
          :style="sxIndicatorAttrs.style"
          v-bind="sxIndicatorAttrs.attrs"
        >
          <slot name="indicator">
            <component :is="defaultIndicator" />
          </slot>
        </div>
        <div v-if="tip" :class="tipClass">{{ tip }}</div>
      </div>
    </template>

    <template v-else>
      <!-- 纯 indicator 模式 -->
      <div
        v-if="spinning"
        :class="[indicatorClass, sxIndicatorAttrs.class]"
        :style="sxIndicatorAttrs.style"
        v-bind="sxIndicatorAttrs.attrs"
      >
        <slot name="indicator">
          <component :is="defaultIndicator" />
        </slot>
      </div>
    </template>
  </component>
</template>
