<script lang="ts">
/**
 * `ZButton` —— Material 风按钮(Stage 6.6,Phase α 收尾)。
 *
 * **5 种 variant**(M3 命名习惯):
 * - `filled`(默认)—— 实心按钮(primary 背景 + 反色文字)
 * - `outlined` —— 描边(透明背景 + primary 边框 + primary 文字)
 * - `text` —— 文字按钮(无背景无边框)
 * - `ghost` —— 半透明背景(`primary.alpha(8)`,跟 hover state 同色)
 * - `link` —— 内联链接样式(下划线 + primary 色)
 *
 * **API**:
 * - `color` carrier factory —— 主色(默认 `_primary`,可走 `_danger` 等)
 * - `size`(small/middle/large)
 * - `loading` / `disabled` / `block`(满宽)
 * - `prefixIcon` / `suffixIcon` slot
 * - `ripple`(boolean,默认 `true`)—— 启用 Material 波纹
 * - sx:sxIcon / sxRipple
 *
 * **Material 行为**:
 * - useRipple 启用 pointerdown 波纹
 * - hover state layer:`primary.alpha(8)` 叠层
 * - active state layer:`primary.alpha(12)` 叠层
 * - `:focus-visible` → primary 外环(2px outline,offset 2px)
 *
 * **a11y**:`aria-disabled` / `aria-busy`(loading 时) / `aria-label`(透传)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { SizePropMulti } from '../_internal/size-prop'
import { makeSizeMap } from '../_internal/size-prop'

export interface ZButtonProps {
  variant?: 'filled' | 'outlined' | 'text' | 'ghost' | 'link'
  /** 主色 factory(默认 `_primary`)。可写 `(c) => c._danger` 等。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /** 尺寸 —— 纯 factory(默认等价 `BUTTON_SIZE_MAP.middle`,影响 fontSize + padding 双轴)。 */
  size?: SizePropMulti
  loading?: boolean
  disabled?: boolean
  block?: boolean
  /** 是否启用 ripple 波纹,默认 `true`(`filled` / `ghost` / `outlined` 推荐;`text` / `link` 可关)。 */
  ripple?: boolean
  /** HTML type 属性(默认 `'button'`)。 */
  type?: 'button' | 'submit' | 'reset'

  sxIcon?: SxObject
  sxRipple?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZButtonEmits {
  (e: 'click', evt: MouseEvent): void
}

/** ZButton size 档位 —— 影响 fontSize + padding 双轴(3 阶实现 + tiny/huge fallback)。 */
const BUTTON_SIZE_MAP = makeSizeMap<Chain<ZuiSchema>>({
  small: (s) => {
    s.fontSize._small
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
    s.paddingLeft._small
    s.paddingRight._small
  },
  middle: (s) => {
    s.fontSize._middle
    s.paddingTop.iem(0.5)
    s.paddingBottom.iem(0.5)
    s.paddingLeft._middle
    s.paddingRight._middle
  },
  large: (s) => {
    s.fontSize._large
    s.paddingTop.iem(0.75)
    s.paddingBottom.iem(0.75)
    s.paddingLeft._large
    s.paddingRight._large
  },
})
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { applyAsBg } from '../_internal/color-bridge'
import { applySizeProp } from '../_internal/size-prop'
import { useRipple } from '../_hooks'
import { BuiltinIcons } from './icons'
import ZIcon from './ZIcon.vue'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────┐
 *   │ ZButton                                  │   inline-flex,gap: _tiny
 *   │   small : pad-y 0.25iem  pad-x _small   │   fontSize: _small / _middle / _large
 *   │   middle: pad-y 0.5iem   pad-x _middle  │   border-radius: _small
 *   │   large : pad-y 0.75iem  pad-x _large   │   border-width: _thin
 *   │                                          │   block=true → width: 100%
 *   │  ┌──────┐ ┌──────────┐ ┌──────┐         │
 *   │  │prefix│ │  slot    │ │suffix│         │   prefix/suffix slot 各占 inline-flex
 *   │  │ Icon │ │ default  │ │ Icon │         │   loading 时 prefix 位置渲染 spin Icon
 *   │  └──────┘ └──────────┘ └──────┘         │
 *   └──────────────────────────────────────────┘
 *
 * 5 个 variant: filled / outlined / text / ghost / link(详见 props.variant)。
 * Material state layer: hover/active 通过 ::before 伪元素叠 8%/12% alpha。
 * focus-visible: outline _middle solid _focusRing.alpha(40),offset 2px。
 */
const props = withDefaults(defineProps<ZButtonProps>(), {
  variant: 'filled',
  size: BUTTON_SIZE_MAP.middle,
  loading: false,
  disabled: false,
  block: false,
  ripple: true,
  type: 'button',
})

const emit = defineEmits<ZButtonEmits>()

const theme = useZTheme()
const btnRef = ref<HTMLButtonElement | null>(null)

const isClickDisabled = computed(() => props.disabled || props.loading)

useRipple(btnRef, {
  disabled: computed(() => !props.ripple || isClickDisabled.value),
  color: 'rgba(255, 255, 255, 0.35)',
})

const buttonClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.gap._tiny
    s.fontWeight._medium
    s.lineHeight._tight
    applySizeProp(props.size, s)
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor.transparent
    s.cursor.pointer
    s.userSelect.none
    s.overflow.hidden
    s.position.relative
    s.transitionProperty._default
    s.transitionDuration._small
    if (props.block) s.width.pct(100)

    // color factory:用户指定 → 走 chain;默认 _primary
    // 用作"主色"挂在 color carrier(供 outlined/text/link/ghost 用)
    if (props.color) s.color(props.color)
    else s.color._primary

    // variant 区分(2026-05-23 技术债务修复:不再用 `backgroundColor.currentColor` 桥接,
    // 因为 currentColor 在 CSS paint 时 resolve 当前 color,而后续 `color._bg` 又改了 color,
    // 导致 filled 按钮变白底白字。改为直接独立设置 backgroundColor)。
    //
    // user color 处理:通过 `applyAsBg` helper 把 color factory 桥接到 backgroundColor carrier。
    const hasUserColor = !!props.color

    switch (props.variant) {
      case 'filled':
        if (!applyAsBg(s, props.color)) {
          s.backgroundColor._primary
        }
        s.color._bg
        s.boxShadow._tiny
        s._hover((h2) => {
          h2.boxShadow._small
        })
        s._active((a) => {
          a.boxShadow._tiny
        })
        break
      case 'outlined':
        s.borderColor.currentColor
        s.backgroundColor.transparent
        if (!hasUserColor) {
          s._hover((h2) => {
            h2.backgroundColor._primary.alpha(8)
          })
          s._active((a) => {
            a.backgroundColor._primary.alpha(12)
          })
        }
        break
      case 'text':
        s.backgroundColor.transparent
        if (!hasUserColor) {
          s._hover((h2) => {
            h2.backgroundColor._primary.alpha(8)
          })
          s._active((a) => {
            a.backgroundColor._primary.alpha(12)
          })
        }
        break
      case 'ghost':
        // 用 ::before 伪元素做 state layer,避免 opacity 整体淡化(包括文字/图标)。
        // user color 时降级:背景不变(透明),仅靠 ::before 颜色由 currentColor 提供。
        s.backgroundColor.transparent
        s.position.relative
        s._before((b) => {
          b.content("''")
          b.position.absolute
          b.inset.px(0)
          b.backgroundColor.currentColor
          b.opacity(0.08)
          b.borderRadius.inherit
          b.pointerEvents.none
          b._prop('transition', 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)')
        })
        s._hover((h2) => {
          h2._before((b) => {
            b.opacity(0.12)
          })
        })
        break
      case 'link':
        s.backgroundColor.transparent
        s.textDecoration('none')
        s.borderRadius._tiny
        s._hover((h2) => {
          h2.textDecoration('underline')
        })
        break
    }

    // :focus-visible outline ring(M3 模式)── 用户 color 时走 _primary 备份
    s._focusVisible((f) => {
      f.outlineWidth._middle
      f.outlineStyle.solid
      f.outlineColor._focusRing.alpha(40)
      f.outlineOffset.px(2)
    })

    if (isClickDisabled.value) {
      s.opacity._dim
      s.cursor.notAllowed
    }

    props.css?.(s)
  }),
)

const iconClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.flexShrink(0)
    applySx(s, props.sxIcon)
  }),
)
const sxIconAttrs = computed(() => extractSxAttrs(props.sxIcon))

function onClick(e: MouseEvent): void {
  if (isClickDisabled.value) return
  emit('click', e)
}

const loadingIcon = computed(() =>
  h(ZIcon, {
    component: BuiltinIcons.refresh,
    spin: (d: Chain<ZuiSchema>['animationDuration']) => {
      d.s(0.8)
    },
  }),
)
</script>

<template>
  <button
    ref="btnRef"
    :type="type"
    :class="buttonClass"
    :disabled="isClickDisabled"
    :aria-disabled="isClickDisabled"
    :aria-busy="loading"
    @click="onClick"
  >
    <span
      v-if="loading"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <component :is="loadingIcon" />
    </span>
    <span
      v-else-if="$slots.prefixIcon"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="prefixIcon" />
    </span>
    <slot />
    <span
      v-if="$slots.suffixIcon"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="suffixIcon" />
    </span>
  </button>
</template>
