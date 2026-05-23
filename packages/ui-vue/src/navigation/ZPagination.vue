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
 * - `size?: 'small' | 'middle' | 'large'`
 *
 * **算法**:Always 显示首/末页 + 当前 ±siblings + 省略号。
 *
 * **a11y**:`<nav aria-label="pagination">` + 当前页 `aria-current="page"`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'
import type { Size5 } from '../_internal/size-prop'

/** ZPagination size 仅接 Size5 档位(影响 button 尺寸数字 + 字号,factory 路径无意义)。 */
export type ZPaginationSize = Size5

export interface ZPaginationProps {
  page?: number
  pageSize?: number
  total: number
  siblings?: number
  showTotal?: boolean
  disabled?: boolean
  /** 尺寸档位(`Size5`)。 */
  size?: ZPaginationSize
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

const props = withDefaults(defineProps<ZPaginationProps>(), {
  page: 1,
  pageSize: 10,
  siblings: 1,
  showTotal: false,
  disabled: false,
  size: 'middle',
})

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

/** 字号档位 —— 跟 schema fontSize 对齐。 */
const SIZE_FONT: Record<ZPaginationSize, 'tiny' | 'small' | 'middle' | 'large' | 'huge'> = {
  tiny: 'tiny',
  small: 'small',
  middle: 'middle',
  large: 'large',
  huge: 'huge',
}

/** button 尺寸 iem 倍率(5 阶,tiny/huge 各加一档)。 */
const SIZE_DIM: Record<ZPaginationSize, number> = {
  tiny: 1.25,
  small: 1.5,
  middle: 1.75,
  large: 2,
  huge: 2.5,
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.color._text
    s.fontSize[`_${SIZE_FONT[props.size]}`]
    props.css?.(s)
  }),
)

const itemClass = computed(() =>
  icss(theme.value, (s) => {
    const dim = SIZE_DIM[props.size]
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
    s.minWidth.iem(dim)
    s.height.iem(dim)
    s.padding.px(0)
    s.paddingLeft._tiny
    s.paddingRight._tiny
    s.transitionProperty._colors
    s.transitionDuration._small
    s._hover((h2) => {
      h2.borderColor._primary
      h2.color._primary
    })
    applySx(s, props.sxItem)
  }),
)
const sxItemAttrs = computed(() => extractSxAttrs(props.sxItem))

const currentItemClass = computed(() =>
  icss(theme.value, (s) => {
    const dim = SIZE_DIM[props.size]
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._primary
    s.backgroundColor._primary
    s.color._bg
    s.borderRadius._small
    s.minWidth.iem(dim)
    s.height.iem(dim)
    s.padding.px(0)
    s.paddingLeft._tiny
    s.paddingRight._tiny
    s.fontWeight._semibold
    applySx(s, props.sxItem)
  }),
)

const disabledClass = computed(() =>
  icss(theme.value, (s) => {
    s.opacity._dim
    s.cursor.notAllowed
  }),
)

const dotsClass = computed(() =>
  icss(theme.value, (s) => {
    const dim = SIZE_DIM[props.size ?? 'middle']
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.minWidth.iem(dim)
    s.height.iem(dim)
    s.color._textSecondary
  }),
)

const totalTextClass = computed(() =>
  icss(theme.value, (s) => {
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
      :class="[itemClass, sxItemAttrs.class, pageRef >= totalPages || disabled ? disabledClass : '']"
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
