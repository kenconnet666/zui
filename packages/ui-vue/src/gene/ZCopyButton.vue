<script lang="ts">
/**
 * `ZCopyButton` —— 通用复制按钮。
 *
 * 调用 `navigator.clipboard.writeText`,提供两层反馈:
 * 1. 按钮文字临时切到 `copiedLabel`(默认 `'已复制'`),`duration` ms 后恢复
 * 2. 可选弹顶部 toast(模块级 lazy `messageApi` 单例,跨组件共享)
 *
 * **典型用法**:
 * - ZCodeCard 的复制按钮(内部即基于本组件)
 * - ColorPalette / IconGallery 等文档站组件的复制行为
 * - 任意"一键复制"场景
 *
 * **API**:
 * - `text: string` —— 要复制的文本(必传)
 * - `size?: number` —— 整体尺寸 iem 倍数(默认 `1`)。所有维度等比缩放。
 * - `label?: string` —— 按钮文字(可选;仅传 icon 即可做成纯图标按钮)
 * - `copiedLabel?: string` —— 复制成功后临时显示的文字。默认 `'已复制'`
 * - `duration?: number` —— 按钮文字"已复制"持续 ms。默认 `1500`
 * - `toast?: boolean` —— 是否同时弹 toast。默认 `true`
 * - `toastMessage?: string` —— toast 内容。默认 `'已复制'`
 * - `toastDuration?: number` —— toast 持续 ms。默认 `1500`
 * - `icon?: Component` —— 自定义图标。默认 `ContentCopyOutlined`
 * - `iconSize?: number` —— 图标尺寸 iem 倍数。默认 `size * 0.875`(随 size 缩放)
 * - `color?: factory` —— 文字色 carrier
 * - `css?: factory` —— 根元素覆盖
 *
 * **emit**:`copy(success: boolean, text: string)` —— 复制完成
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCopyButtonProps {
  /** 要复制的文本(必传)。 */
  text: string
  /**
   * 整体尺寸 iem 倍数(默认 `1`)。
   *
   * 内部公式:
   * - `font-size` = `size` iem
   * - `gap` = `size * 0.25` iem
   * - `padding-y` = `size * 0.25` iem
   * - `padding-x` = `size * 0.5` iem
   * - `border-radius` = `size * 0.25` iem
   * - `icon-size` = `size * 0.875` iem (未显式传 iconSize 时)
   */
  size?: number
  /** 按钮显示文字(可选;不传则纯图标)。 */
  label?: string
  /** 复制成功后临时显示的文字。默认 `'已复制'`。 */
  copiedLabel?: string
  /** "已复制"持续 ms。默认 `1500`。 */
  duration?: number
  /** 是否弹 toast。默认 `true`。 */
  toast?: boolean
  /** toast 内容。默认 `'已复制'`。 */
  toastMessage?: string
  /** toast 持续 ms。默认 `1500`。 */
  toastDuration?: number
  /** 自定义图标组件。默认 `ContentCopyOutlined`。 */
  icon?: Component
  /** 图标尺寸 iem 倍数。不传时默认 `size * 0.875`(随 size 缩放)。 */
  iconSize?: number
  /** 文字色 carrier。默认 `_textSecondary`,hover `_text`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /** 根元素 css 覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCopyButtonEmits {
  /** 复制完成(成功/失败 + 实际复制的 text)。 */
  (e: 'copy', success: boolean, text: string): void
}
</script>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { ContentCopyOutlined } from '@vicons/material'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import ZIcon from './ZIcon.vue'
import { createMessageApi, type ZMessageApi } from '../feedback/messageApi'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────┐
 *   │ button (type=button)     │   inline-flex / center
 *   │   [icon] [label?]        │   gap size*0.25 iem
 *   │                          │   pad-y size*0.25 iem  pad-x size*0.5 iem
 *   │                          │   border 0  radius size*0.25 iem
 *   │                          │   bg transparent  color _textSecondary
 *   │                          │   font-size size*1 iem  lineHeight _tight
 *   │                          │   transition all _tiny
 *   │                          │   :hover → bg color.alpha(8) + color _text
 *   │                          │   :focus-visible → outline 2px _primary
 *   └──────────────────────────┘
 *
 * 默认 size=1 @ 1080p: gap=4px / pad-y=4px / pad-x=8px / fontSize=16px / radius=4px
 * icon 尺寸 = iconSize prop(优先) 或 size*0.875 iem。
 *
 * 跨实例共享:首次调用 `handleCopy` 触发 lazy `messageApi` 单例创建。
 * 测试场景 navigator.clipboard 可能缺失,做了 typeof guard;失败时 emit
 * `copy(false, text)`,按钮不切到"已复制"。
 */
const props = withDefaults(defineProps<ZCopyButtonProps>(), {
  size: 1,
  copiedLabel: '已复制',
  duration: 1500,
  toast: true,
  toastMessage: '已复制',
  toastDuration: 1500,
})
const emit = defineEmits<ZCopyButtonEmits>()

const theme = useZTheme()

const iconComponent = computed<Component>(() => props.icon ?? ContentCopyOutlined)

// ─── 按钮文字临时态 ───
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

// 跨实例共享 messageApi(首次复制时 lazy 创建)
let msgApi: ZMessageApi | null = null
function getMsgApi(): ZMessageApi {
  if (!msgApi) msgApi = createMessageApi()
  return msgApi
}

async function handleClick(): Promise<void> {
  const text = props.text
  let success = false
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      success = true
    }
  } catch {
    success = false
  }
  if (success) {
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
      copied.value = false
    }, props.duration)
    if (props.toast && props.toastDuration > 0) {
      getMsgApi().success(props.toastMessage, props.toastDuration)
    }
  }
  emit('copy', success, text)
}

onBeforeUnmount(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
})

/** 当前显示文字(总是有值,用于 aria-label;span 渲染受 `label` 是否传入控制)。 */
const displayText = computed(() => (copied.value ? props.copiedLabel : (props.label ?? '复制')))

const resolvedIconSize = computed(() => props.iconSize ?? props.size * 0.875)

const rootClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size
    s.display.inlineFlex
    s.alignItems.center
    s.gap.px(sizePx(size * 0.25))
    s.paddingTop.px(sizePx(size * 0.25))
    s.paddingBottom.px(sizePx(size * 0.25))
    s.paddingLeft.px(sizePx(size * 0.5))
    s.paddingRight.px(sizePx(size * 0.5))
    s.borderWidth.px(0)
    s.borderRadius.px(sizePx(size * 0.25))
    s.backgroundColor.transparent
    s.fontSize.px(sizePx(size))
    s.lineHeight._tight
    s.cursor.pointer
    s.transitionProperty.all
    s.transitionDuration._tiny
    if (props.color) s.color(props.color)
    else s.color._textSecondary
    s._selector('&:hover', h => {
      h.backgroundColor._textSecondary.alpha(8)
      if (!props.color) h.color._text
    })
    s._selector('&:focus-visible', f => {
      f.outlineWidth.px(2)
      f.outlineStyle.solid
      f.outlineColor._primary
      f.outlineOffset.px(1)
    })
    s._selector('&:disabled', d => {
      d.opacity._half
      d.cursor.notAllowed
    })
    props.css?.(s)
  }),
)
</script>

<template>
  <button type="button" :class="rootClass" :aria-label="displayText" @click="handleClick">
    <ZIcon :component="iconComponent" :size="resolvedIconSize" />
    <span v-if="label !== undefined">{{ displayText }}</span>
  </button>
</template>
