<script lang="ts">
/**
 * `ZAlert` —— 警示横幅(类 antd Alert)。
 *
 * **5 个语义类型**(对应 schema 语义色):
 * - `info` —— 普通信息(默认)
 * - `success` —— 成功提示
 * - `warning` —— 警告
 * - `danger` —— 错误
 *
 * **结构**:
 * ```
 * [icon] | title       [close]
 *        | description
 * ```
 *
 * **子节点 sx 配置**:
 * - `sxIcon` —— 左侧 icon 容器
 * - `sxBody` —— 中间标题 + 描述区
 * - `sxClose` —— 右侧关闭按钮
 *
 * **a11y**:`role="alert"`(屏读器立即朗读)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export type ZAlertType = 'info' | 'success' | 'warning' | 'danger'

export interface ZAlertProps {
  /** 语义类型,默认 `'info'`。 */
  type?: ZAlertType
  /** 标题(主信息)。 */
  title?: string
  /** 描述(详细信息)。 */
  description?: string
  /** 是否显示左侧 icon,默认 `true`。 */
  showIcon?: boolean
  /** 是否显示关闭按钮,默认 `false`。 */
  closable?: boolean
  /** 子节点 sx 配置。 */
  sxIcon?: SxObject
  sxBody?: SxObject
  sxClose?: SxObject
  /** 根元素二次覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'div'`。 */
  tag?: string
}

export interface ZAlertEmits {
  /** 关闭按钮点击。 */
  (e: 'close', evt: MouseEvent): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZAlertProps>(), {
  type: 'info',
  showIcon: true,
  closable: false,
  tag: 'div',
})

const emit = defineEmits<ZAlertEmits>()

const theme = useZTheme()

/** type → BuiltinIcons key 映射。 */
const TYPE_ICON_MAP: Record<ZAlertType, keyof typeof BuiltinIcons> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

/** type → schema color token key 映射。 */
const TYPE_COLOR_MAP: Record<ZAlertType, 'info' | 'success' | 'warning' | 'danger'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    const colorKey = `_${TYPE_COLOR_MAP[props.type]}` as const
    s.display.flex
    s.alignItems.flexStart
    s.padding._small
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.gap._small
    // 语义色 + alpha 衍生:背景浅色、边框淡色、文字主色
    s.color[colorKey]
    s.borderColor.currentColor
    s.backgroundColor[colorKey].alpha(8)

    props.css?.(s)
  }),
)

const iconClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.flexShrink(0)
    s.fontSize._middle
    applySx(s, props.sxIcon)
  }),
)
const sxIconAttrs = computed(() => extractSxAttrs(props.sxIcon))

const bodyClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    s.color._text
    s.fontSize._small
    s.lineHeight._normal
    applySx(s, props.sxBody)
  }),
)
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))

const closeClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.flexShrink(0)
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding._tiny
    s.fontSize._middle
    s.color._textSecondary
    s.borderRadius._tiny
    s._hover((h2) => {
      h2.backgroundColor._textSecondary.alpha(8)
    })
    applySx(s, props.sxClose)
  }),
)
const sxCloseAttrs = computed(() => extractSxAttrs(props.sxClose))

function onCloseClick(e: MouseEvent): void {
  emit('close', e)
}

// 渲染 icon —— 走 BuiltinIcons 语义图标
const iconNode = computed(() =>
  h(ZIcon, { component: BuiltinIcons[TYPE_ICON_MAP[props.type]] }),
)

const closeIconNode = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
</script>

<template>
  <component :is="tag" :class="rootClass" role="alert">
    <div
      v-if="showIcon"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="icon">
        <component :is="iconNode" />
      </slot>
    </div>

    <div
      :class="[bodyClass, sxBodyAttrs.class]"
      :style="sxBodyAttrs.style"
      v-bind="sxBodyAttrs.attrs"
    >
      <slot name="title">
        <strong v-if="title">{{ title }}</strong>
      </slot>
      <slot name="description">
        <div v-if="description">{{ description }}</div>
      </slot>
      <slot />
    </div>

    <button
      v-if="closable"
      type="button"
      :class="[closeClass, sxCloseAttrs.class]"
      :style="sxCloseAttrs.style"
      aria-label="关闭"
      v-bind="sxCloseAttrs.attrs"
      @click="onCloseClick"
    >
      <component :is="closeIconNode" />
    </button>
  </component>
</template>
