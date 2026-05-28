<script lang="ts">
/**
 * `ZLink` —— 链接。继承 ZText 6 维度 + 5 状态,新增链接专属 prop:
 * `href` / `target` / `rel` / `disabled`。
 *
 * **跟 ZText 的差异**(组件级默认):
 * - `tag` 默认 `'a'`
 * - `color` 默认 `_primary` schema token(用户传 `:color="..."` 覆盖)
 * - `underline` 默认 `'hover'`(用户传 `:underline="'always'|'none'"` 覆盖)
 * - `cursor: pointer`
 * - `disabled=true` → `opacity: _dim` + `pointer-events: none` + `cursor: not-allowed` +
 *   `aria-disabled` + `tabindex=-1` + 屏蔽 `href`(防止键盘 tab + 屏读器误触)
 *
 * **a11y**:
 * - `target="_blank"` 自动补 `rel="noopener noreferrer"`(用户传 `rel` 接管)
 * - `disabled` 走 `aria-disabled` 而非原生 `disabled`(`<a>` 没有原生 `disabled`)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

/** ZLink 完整 props。**继承 ZText 全部维度 + 链接 4 字段**。 */
export interface ZLinkProps {
  /** 跳转地址。`disabled=true` 时自动屏蔽。 */
  href?: string
  /** 跳转目标(`'_blank'` / `'_self'` 等)。`'_blank'` 自动补 `rel="noopener noreferrer"`。 */
  target?: string
  /** `rel` 属性。传了接管自动补的 `noopener noreferrer`。 */
  rel?: string
  /** 禁用态:屏蔽点击 + 灰化 + a11y。 */
  disabled?: boolean

  /** 字号 —— `number`(iem 倍数,默认 undefined = 继承父字号)。 */
  size?: number
  weight?: ((w: Chain<ZuiSchema>['fontWeight']) => void) | undefined
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  depth?: ((o: Chain<ZuiSchema>['opacity']) => void) | undefined
  leading?: ((l: Chain<ZuiSchema>['lineHeight']) => void) | undefined
  tracking?: ((t: Chain<ZuiSchema>['letterSpacing']) => void) | undefined

  italic?: boolean
  /** 始终下划线,默认 `false`。 */
  underline?: boolean
  /** 仅 hover 时下划线,默认 `true`(链接惯例)。 */
  underlineOnHover?: boolean
  strikethrough?: boolean
  mono?: boolean
  ellipsis?: boolean | number

  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'a'`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyTypographyBase } from './_typography-base'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────────┐
 *   │ ZLink (inline,默认 <a>)      │
 *   │   font-size: `size` iem      │   默认 size=undefined(继承父字号)
 *   │                              │   传 size=1 → 1iem(16px @ 1080p)
 *   │   color: _primary (默认)     │   用户传 color factory 覆盖
 *   │   underlineOnHover: true     │   hover 时显示下划线(链接惯例)
 *   │   cursor: pointer            │
 *   │   disabled=true → opacity _dim + pointer-events: none + cursor: not-allowed
 *   └──────────────────────────────┘
 *
 * 用户改 size 数字 → fontSize 等比缩(无其它 iem 维度)。
 * 非 iem 单位走 `:css` 兜底:`(s) => s.fontSize.px(14)`。
 */
const props = withDefaults(defineProps<ZLinkProps>(), {
  disabled: false,
  italic: false,
  underline: false,
  underlineOnHover: true,
  strikethrough: false,
  mono: false,
  ellipsis: false,
  tag: 'a',
})

const theme = useZTheme()

const className = computed(() =>
  icss(theme.value, s => {
    // ─── 组件默认(放最前) ───
    if (!props.color) s.color._primary // 默认 primary,用户传 color 在 applyTypographyBase 中覆盖
    s.cursor.pointer

    // 禁用态(放在 applyTypographyBase 前,这样用户传的 depth / cursor 仍能覆盖)
    if (props.disabled) {
      s.opacity._dim
      s.pointerEvents.none
      s.cursor.notAllowed
    }

    applyTypographyBase(s, props)
    props.css?.(s)
  }),
)

/** disabled 时屏蔽 href,防止屏读器/键盘 Enter 触发跳转。 */
const effectiveHref = computed(() => (props.disabled ? undefined : props.href))

/** `target="_blank"` 自动补 rel(用户传 rel 接管)。 */
const effectiveRel = computed(() => {
  if (props.rel) return props.rel
  if (props.target === '_blank') return 'noopener noreferrer'
  return undefined
})

const ariaDisabled = computed(() => (props.disabled ? 'true' : undefined))
const tabindex = computed(() => (props.disabled ? -1 : undefined))
</script>

<template>
  <component
    :is="tag"
    :class="className"
    :href="effectiveHref"
    :target="target"
    :rel="effectiveRel"
    :aria-disabled="ariaDisabled"
    :tabindex="tabindex"
  >
    <slot />
  </component>
</template>
