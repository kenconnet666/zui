<script lang="ts">
/**
 * `ZAlert` —— 警示横幅(类 antd Alert)。
 *
 * **API**(2026-05-23 撤销 type 字面量,改 color factory + icon slot):
 * - `color?: factory` —— 警示色,默认 `_info`。常用:`_success` / `_warning` / `_danger`
 * - `title?: string` / `description?: string`
 * - `showIcon?: boolean`(默认 `true`)+ `#icon` slot 自定义图标
 * - `closable?: boolean`(默认 `false`)
 * - sx:sxIcon / sxBody / sxClose
 *
 * **典型用法**(语义色 → 内置图标走 `#icon` slot 用户自选):
 * ```vue
 * <ZAlert :color="(c) => c._success" title="保存成功">
 *   <template #icon><ZIcon :component="BuiltinIcons.success" /></template>
 * </ZAlert>
 * ```
 *
 * **结构**:
 * ```
 * [icon] | title       [close]
 *        | description
 * ```
 *
 * **a11y**:`role="alert"`(屏读器立即朗读)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZAlertProps {
  /** 警示色 factory,默认 `_info`。常用:`_success` / `_warning` / `_danger` / `_info`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /** 标题(主信息)。 */
  title?: string
  /** 描述(详细信息)。 */
  description?: string
  /**
   * 尺寸 —— `number`(iem 倍数,默认 0.875,等价旧 middle 档位 14px)。
   *
   * 内部按比例:
   * - `padding` = `size * 0.625`
   * - `gap` = `size * 0.5`
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。
   */
  size?: number
  /** 是否显示左侧 icon,默认 `true`。图标内容通过 `#icon` slot 提供。 */
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
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ ZAlert root                                         │   flex / alignFlexStart
 *   │   font-size: `size` iem                             │   默认 size=0.875(14px @ 1080p)
 *   │   padding: size*0.625 iem                           │   ≈ 0.547iem(8.75px)
 *   │   gap: size*0.5 iem                                 │   ≈ 0.438iem(7px)
 *   │   border-radius: _small  border-width: _thin        │
 *   │   color: 用户 color factory 或 _info                │   ::before: bg currentColor 0.08
 *   │                                                     │     (8% 主色叠层背景,不影响文字)
 *   │  ┌─────┐  ┌────────────────────────┐  ┌────────┐   │
 *   │  │ icon│  │ body                   │  │ close  │   │   icon(showIcon=true,条件渲染):
 *   │  │     │  │  title(条件)         │  │ (条件) │   │     inline-flex / fontSize _middle
 *   │  │  i  │  │  description(条件)   │  │   ×    │   │     #icon slot 覆盖
 *   │  │     │  │  默认 slot             │  │        │   │   body:
 *   │  │ _mid│  │   color: _text         │  │ _small │   │     flex-grow 1 / color _text
 *   │  │     │  │   fontSize: _small     │  │        │   │     fontSize _small lineHeight _normal
 *   │  └─────┘  └────────────────────────┘  └────────┘   │   close(closable=true,条件):
 *   │                                                     │     inline-flex / pad _tiny
 *   └─────────────────────────────────────────────────────┘     hover bg _textSecondary.alpha(8)
 *
 * 用户改 size 数字 → padding / gap / fontSize 等比缩(整体比例不变)。
 * 非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZAlertProps>(), {
  showIcon: true,
  closable: false,
  size: 0.875,
  tag: 'div',
  // 警示色默认 `_info`(常用覆盖:`_success` / `_warning` / `_danger`)
  color: (c: Chain<ZuiSchema>['color']) => {
    c._info
  },
})

const emit = defineEmits<ZAlertEmits>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 0.875
    s.display.flex
    s.alignItems.flexStart
    s.padding.px(sizePx(size * 0.625))
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.gap.px(sizePx(size * 0.5))
    s.fontSize.px(sizePx(size))
    s.position.relative
    s.overflow.hidden
    // color factory 决定文字 + 边框色(默认 `_info`,从 withDefaults 提供)
    s.color(props.color)
    s.borderColor.currentColor
    // 背景走 ::before 伪元素 8% currentColor 叠层(避免 backgroundColor.alpha 不可链式问题)
    s._before(b => {
      b.content("''")
      b.position.absolute
      b.inset.px(0)
      b.backgroundColor.currentColor
      b.opacity(0.08)
      b.pointerEvents.none
      b.zIndex(-1)
    })

    props.css?.(s)
  }),
)

const iconClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.flexShrink(0)
    s.fontSize._middle
    applySx(s, props.sxIcon)
  }),
)
const sxIconAttrs = computed(() => extractSxAttrs(props.sxIcon))

const bodyClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.color._text
    s.fontSize._small
    s.lineHeight._normal
    applySx(s, props.sxBody)
  }),
)
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))

const closeClass = computed(() =>
  icss(theme.value, s => {
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
    s._hover(h2 => {
      h2.backgroundColor._textSecondary.alpha(8)
    })
    applySx(s, props.sxClose)
  }),
)
const sxCloseAttrs = computed(() => extractSxAttrs(props.sxClose))

function onCloseClick(e: MouseEvent): void {
  emit('close', e)
}

// icon 默认 fallback:info 图标(用户走 `#icon` slot 自定义)
const defaultIconNode = computed(() => h(ZIcon, { component: BuiltinIcons.info }))

const closeIconNode = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
</script>

<template>
  <component :is="tag" :class="rootClass" role="alert">
    <div
      v-if="showIcon"
      :ref="sxIconAttrs.ref"
      :class="[iconClass, sxIconAttrs.class]"
      :style="sxIconAttrs.style"
      v-bind="sxIconAttrs.attrs"
    >
      <slot name="icon">
        <component :is="defaultIconNode" />
      </slot>
    </div>

    <div
      :ref="sxBodyAttrs.ref"
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
      :ref="sxCloseAttrs.ref"
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
