<script lang="ts">
/**
 * `ZCard` —— 卡片容器(类 antd Card / naive NCard)。
 *
 * **结构**(三节点,head 与 foot 按需渲染):
 * ```
 * ┌─────────────────────┐
 * │ title    extra      │ ← sxHead(slot: head / extra)
 * ├─────────────────────┤
 * │ body                │ ← sxBody(slot: default)
 * ├─────────────────────┤
 * │ foot                │ ← sxFoot(slot: foot)
 * └─────────────────────┘
 * ```
 *
 * **API**:
 * - `title?: string` —— 头部标题(`#head` slot 优先)
 * - `bordered?: boolean` —— 是否显示边框(默认 `true`);`false` 走 elevation shadow
 * - `hoverable?: boolean` —— 鼠标悬停加深 elevation(默认 `false`)
 * - `sxHead / sxBody / sxFoot` —— 三节点 sx 配置(`SxObject`)
 *
 * **slots**:
 * - `default` —— body 内容
 * - `head` —— 自定义头部(完全替换 title)
 * - `extra` —— 头部右侧操作区
 * - `foot` —— 底部
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZCardProps {
  /** 头部标题(`#head` slot 优先于此)。 */
  title?: string
  /** 是否显示边框,默认 `true`。 */
  bordered?: boolean
  /** 鼠标悬停加深阴影,默认 `false`。 */
  hoverable?: boolean
  /** 三节点 sx 配置。 */
  sxHead?: SxObject
  sxBody?: SxObject
  sxFoot?: SxObject
  /** 根元素二次覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'div'`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed, useSlots, type Slots } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌─────────────────────────────────────┐
 *   │ ZCard                               │   bg: _bg
 *   │   border-radius: _middle            │   bordered=true → border _thin solid _border
 *   │   overflow: hidden                  │   bordered=false → boxShadow _small
 *   │                                     │   hoverable=true → hover boxShadow _middle
 *   │  ┌───────────────────────────────┐  │
 *   │  │ head(条件渲染)               │   padding: _middle
 *   │  │  title / #head    + #extra    │   border-b: _thin solid _border
 *   │  │  fontWeight: _semibold        │   flex / spaceBetween / gap _small
 *   │  └───────────────────────────────┘  │
 *   │  ┌───────────────────────────────┐  │
 *   │  │ body(默认 slot)              │   padding: _middle
 *   │  │  color: _text                 │
 *   │  └───────────────────────────────┘  │
 *   │  ┌───────────────────────────────┐  │
 *   │  │ foot(条件渲染)               │   padding: _middle
 *   │  │  #foot                        │   border-t: _thin solid _border
 *   │  └───────────────────────────────┘  │
 *   └─────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZCardProps>(), {
  bordered: true,
  hoverable: false,
  tag: 'div',
})

const slots: Slots = useSlots()
const theme = useZTheme()

const hasHead = computed<boolean>(() => !!props.title || !!slots.head || !!slots.extra)
const hasFoot = computed<boolean>(() => !!slots.foot)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.backgroundColor._bg
    s.borderRadius._middle
    s.overflow.hidden
    if (props.bordered) {
      s.borderWidth._thin
      s.borderStyle.solid
      s.borderColor._border
    } else {
      s.boxShadow._small
    }
    if (props.hoverable) {
      s.transitionProperty._shadow
      s.transitionDuration._small
      s._hover((h) => {
        h.boxShadow._middle
      })
    }

    props.css?.(s)
  }),
)

const headClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._small
    s.padding._middle
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
    s.fontWeight._semibold
    s.color._text
    applySx(s, props.sxHead)
  }),
)
const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))

const bodyClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._middle
    s.color._text
    applySx(s, props.sxBody)
  }),
)
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))

const footClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._middle
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
    s.color._text
    applySx(s, props.sxFoot)
  }),
)
const sxFootAttrs = computed(() => extractSxAttrs(props.sxFoot))
</script>

<template>
  <component :is="tag" :class="rootClass">
    <div
      v-if="hasHead"
      :ref="sxHeadAttrs.ref"
      :class="[headClass, sxHeadAttrs.class]"
      :style="sxHeadAttrs.style"
      v-bind="sxHeadAttrs.attrs"
    >
      <div>
        <slot name="head">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra">
        <slot name="extra" />
      </div>
    </div>

    <div
      :ref="sxBodyAttrs.ref"
      :class="[bodyClass, sxBodyAttrs.class]"
      :style="sxBodyAttrs.style"
      v-bind="sxBodyAttrs.attrs"
    >
      <slot />
    </div>

    <div
      v-if="hasFoot"
      :ref="sxFootAttrs.ref"
      :class="[footClass, sxFootAttrs.class]"
      :style="sxFootAttrs.style"
      v-bind="sxFootAttrs.attrs"
    >
      <slot name="foot" />
    </div>
  </component>
</template>
