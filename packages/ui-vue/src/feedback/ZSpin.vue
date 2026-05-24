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

export interface ZSpinProps {
  /** 是否加载中,默认 `true`(因为通常 v-if/外控,组件内不需 false 时仍渲染)。 */
  spinning?: boolean
  /**
   * indicator 尺寸 —— `number`(iem 倍数,默认 1.5 = 24px @ 16px iem)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。直接透传给内部 ZIcon 的 size。
   *
   * @example
   * <ZSpin :size="2" />        <!-- 2iem 大 spinner -->
   * <ZSpin :size="0.875" />    <!-- 0.875iem 小 -->
   */
  size?: number
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
import { computed, h, useSlots, type Slots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   包裹模式(有 default slot):
 *   ┌────────────────────────────────────┐
 *   │ root  position relative / block    │
 *   │  ┌──────────────────────────────┐  │   wrap content:
 *   │  │ slot 内容(opacity _dim)    │  │     spinning=true → opacity _dim / pointer-events none
 *   │  └──────────────────────────────┘  │   overlay(条件渲染):
 *   │  ┌──────────────────────────────┐  │     position absolute / inset 0
 *   │  │ overlay flex column center   │  │     bg _bg.alpha(60) / color _primary
 *   │  │   ┌────────┐                 │  │   indicator:
 *   │  │   │indicat │   ZIcon refresh │  │     ZIcon size=`size` iem
 *   │  │   │ size×  │   spin 1s       │  │       默认 size=1.5(24px @ 1080p)
 *   │  │   └────────┘                 │  │   tip:
 *   │  │     tip 文字                  │  │     fontSize _small / color _textSecondary
 *   │  └──────────────────────────────┘  │
 *   └────────────────────────────────────┘
 *
 *   纯 indicator 模式(无 slot):
 *   ┌──────────┐
 *   │ inline-  │   只渲染 indicator 本身
 *   │  flex    │   ZIcon size=`size` iem
 *   │ ┌──────┐ │
 *   │ │ ZIcon│ │
 *   │ └──────┘ │
 *   └──────────┘
 *
 * 用户改 size 数字 → indicator 直接透传给 ZIcon size,等比缩。
 * 非 iem 单位走 `:css` 兜底(或自定义 #indicator slot)。
 */
const props = withDefaults(defineProps<ZSpinProps>(), {
  spinning: true,
  size: 1.5,
  tag: 'div',
})

const slots: Slots = useSlots()
const theme = useZTheme()

const hasDefaultSlot = computed<boolean>(() => !!slots.default)

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
    s.inset.px(0)
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

const defaultIndicator = computed(() =>
  h(ZIcon, {
    component: BuiltinIcons.refresh,
    spin: (d: Chain<ZuiSchema>['animationDuration']) => {
      d.s(1)
    },
    // size 现在是 number(iem 倍数),直接透传给 ZIcon
    size: props.size ?? 1.5,
  }),
)

const wrapContentClass = computed(() =>
  icss(theme.value, (s) => {
    if (props.spinning) {
      s.opacity._dim
      s.pointerEvents.none
      s.userSelect.none
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
        :ref="sxOverlayAttrs.ref"
        :class="[overlayClass, sxOverlayAttrs.class]"
        :style="sxOverlayAttrs.style"
        v-bind="sxOverlayAttrs.attrs"
      >
        <div
          :ref="sxIndicatorAttrs.ref"
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
        :ref="sxIndicatorAttrs.ref"
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
