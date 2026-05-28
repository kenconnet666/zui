<script lang="ts">
/**
 * `ZPagination` —— 分页器(已有 `locale.pagination` namespace,文案走 i18n)。
 *
 * **API**:
 * - `v-model:page`(当前页,1-based)
 * - `pageSize?: number` —— 默认 `10`
 * - `total: number` —— 总条数(必填)
 * - `siblings?: number` —— 当前页两侧显示多少页码(默认 `1`)
 * - `showTotal?: boolean` —— 显示总数文本
 * - `disabled?: boolean`
 * - `size?: SizePropMulti` —— 尺寸 factory(默认等价 middle:fontSize._middle)
 *
 * **size 策略**:factory 应用到 root,主要改 `fontSize`;item 尺寸用 `iem(1.75)` 跟 fontSize 联动自动 scale,
 * 用户改 fontSize 即可整体缩放。
 *
 * **算法**:Always 显示首/末页 + 当前 ±siblings + 省略号。
 *
 * **a11y**:`<nav aria-label="pagination">` + 当前页 `aria-current="page"`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZPaginationProps {
  page?: number
  pageSize?: number
  total: number
  siblings?: number
  showTotal?: boolean
  disabled?: boolean
  /**
   * 字号 —— `number`(iem 倍数,默认 1)。2026-05-24 B7。
   *
   * 影响 root 字号;item 默认通过 `itemSize` 派生 `size * 2`。
   */
  size?: number
  /** item 尺寸(min-width + height)—— `number`(iem 倍数,可选,默认 `size * 2` = 32px,对齐 antd Pagination 32×32)。 */
  itemSize?: number
  sxItem?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZPaginationEmits {
  (e: 'update:page', value: number): void
  (e: 'change', value: number): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme, useZLocale } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │ <nav> root  inline-flex / center / gap _tiny         │
 *   │   font-size: `size` iem                              │   默认 size=1(16px @ 1080p)
 *   │   color: _text                                       │
 *   │                                                      │
 *   │  ┌───────────┐ ┌────┐ ┌────┐ ┌────┐ ┌───┐ ┌────┐ ┌────┐ ┌───────────┐│
 *   │  │ "总数:N"  │ │  ◀ │ │ 1  │ │ 2 │ │ … │ │ 5  │ │ 6  │ │     ▶     ││
 *   │  │ (条件)    │ │prev│ │    │ │cur│ │dot│ │    │ │    │ │   next    ││
 *   │  │ _textSec  │ │item│ │item│ │ent│ │ _ │ │item│ │item│ │   item    ││
 *   │  │ _small    │ │    │ │    │ │   │ │tex│ │    │ │    │ │           ││
 *   │  └───────────┘ └────┘ └────┘ └────┘ └───┘ └────┘ └────┘ └───────────┘│
 *   │                                                      │
 *   │  item:                                               │
 *   │    min-width: `itemSize` iem                         │   默认 itemSize=size*2=2iem(32px)
 *   │    height: `itemSize` iem                            │   传 itemSize=3 → 3iem(48px)
 *   │    padding-x: _tiny / border-radius: _small          │   border _thin _border / bg _bg
 *   │    hover: borderColor _primary,color _primary       │
 *   │  current: bg _primary,color _bg,_semibold,border _primary
 *   │  dots: itemSize 占位,_textSecondary                 │
 *   │  disabled: opacity _dim / cursor notAllowed         │
 *   └──────────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → root fontSize 等比缩(item 默认跟 size*2 联动)。
 * 想独立控制 item 尺寸 → 传 itemSize 数字。算法:首尾恒显示 + 当前页 ±siblings + 省略号。
 * 非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZPaginationProps>(), {
  page: 1,
  pageSize: 10,
  siblings: 1,
  showTotal: false,
  disabled: false,
  size: 1,
})

/** 计算每个 item 的 iem 尺寸(默认 `size * 2` = 32px @ size=1,对齐 antd Pagination 32×32,跟字号联动)。 */
const itemIem = computed(() => props.itemSize ?? (props.size ?? 1) * 2)

const emit = defineEmits<ZPaginationEmits>()

const theme = useZTheme()
const locale = useZLocale('pagination')

const pageRef = computed<number>(() => props.page ?? 1)
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / (props.pageSize ?? 10))))

/** 生成页码序列 + '...' 占位。 */
const pageList = computed<(number | 'dots')[]>(() => {
  const total = totalPages.value
  const cur = pageRef.value
  const sib = props.siblings ?? 1
  const list: (number | 'dots')[] = []
  if (total <= 5 + 2 * sib) {
    for (let i = 1; i <= total; i++) list.push(i)
    return list
  }
  list.push(1)
  const left = Math.max(2, cur - sib)
  const right = Math.min(total - 1, cur + sib)
  if (left > 2) list.push('dots')
  for (let i = left; i <= right; i++) list.push(i)
  if (right < total - 1) list.push('dots')
  list.push(total)
  return list
})

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.color._text
    s.fontSize.iem(props.size ?? 1)
    props.css?.(s)
  }),
)

const itemClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._small
    s.minWidth.iem(itemIem.value)
    s.height.iem(itemIem.value)
    s.padding.px(0)
    s.paddingLeft._tiny
    s.paddingRight._tiny
    s.transitionProperty._colors
    s.transitionDuration._small
    s._hover(h2 => {
      h2.borderColor._primary
      h2.color._primary
    })
    applySx(s, props.sxItem)
  }),
)
const sxItemAttrs = computed(() => extractSxAttrs(props.sxItem))

const currentItemClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._primary
    s.backgroundColor._primary
    s.color._bg
    s.borderRadius._small
    s.minWidth.iem(itemIem.value)
    s.height.iem(itemIem.value)
    s.padding.px(0)
    s.paddingLeft._tiny
    s.paddingRight._tiny
    s.fontWeight._semibold
    applySx(s, props.sxItem)
  }),
)

const disabledClass = computed(() =>
  icss(theme.value, s => {
    s.opacity._dim
    s.cursor.notAllowed
  }),
)

const dotsClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.minWidth.iem(itemIem.value)
    s.height.iem(itemIem.value)
    s.color._textSecondary
  }),
)

const totalTextClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.fontSize._small
    s.marginRight._small
  }),
)

function go(p: number): void {
  if (props.disabled) return
  if (p < 1 || p > totalPages.value || p === pageRef.value) return
  emit('update:page', p)
  emit('change', p)
}

function prev(): void {
  go(pageRef.value - 1)
}
function next(): void {
  go(pageRef.value + 1)
}

const prevIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronLeft }))
const nextIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))

const totalText = computed(() => {
  const label = locale.value?.total ?? '总数'
  return `${label}: ${props.total}`
})

const prevAriaLabel = computed(() => locale.value?.prev ?? '上一页')
const nextAriaLabel = computed(() => locale.value?.next ?? '下一页')
</script>

<template>
  <nav :class="rootClass" aria-label="pagination">
    <span v-if="showTotal" :class="totalTextClass">{{ totalText }}</span>
    <button
      type="button"
      :ref="sxItemAttrs.ref"
      :class="[itemClass, sxItemAttrs.class, pageRef <= 1 || disabled ? disabledClass : '']"
      :style="sxItemAttrs.style"
      :disabled="pageRef <= 1 || disabled"
      :aria-label="prevAriaLabel"
      v-bind="sxItemAttrs.attrs"
      @click="prev"
    >
      <component :is="prevIcon" />
    </button>
    <template v-for="(p, i) in pageList" :key="`${p}-${i}`">
      <span v-if="p === 'dots'" :class="dotsClass" aria-hidden="true">…</span>
      <button
        v-else-if="p === pageRef"
        type="button"
        :class="currentItemClass"
        :aria-current="'page'"
        :disabled="disabled"
      >
        {{ p }}
      </button>
      <button
        v-else
        type="button"
        :ref="sxItemAttrs.ref"
        :class="[itemClass, sxItemAttrs.class, disabled ? disabledClass : '']"
        :style="sxItemAttrs.style"
        :disabled="disabled"
        v-bind="sxItemAttrs.attrs"
        @click="go(p as number)"
      >
        {{ p }}
      </button>
    </template>
    <button
      type="button"
      :ref="sxItemAttrs.ref"
      :class="[
        itemClass,
        sxItemAttrs.class,
        pageRef >= totalPages || disabled ? disabledClass : '',
      ]"
      :style="sxItemAttrs.style"
      :disabled="pageRef >= totalPages || disabled"
      :aria-label="nextAriaLabel"
      v-bind="sxItemAttrs.attrs"
      @click="next"
    >
      <component :is="nextIcon" />
    </button>
  </nav>
</template>
