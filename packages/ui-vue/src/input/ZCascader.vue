<script lang="ts">
/**
 * `ZCascader` —— 级联选择(基于树形数据 + popper)。简化:列式展开(每列一层 children)。
 *
 * - `v-model:value` —— string[](从根到叶的 key 路径)
 * - `options: ZCascaderOption[]` —— 树形选项
 * - `placeholder?` / `disabled?`
 * - `expandTrigger?: 'click' | 'hover'` —— 子级展开触发,默认 click
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCascaderOption {
  value: string
  label: string
  disabled?: boolean
  children?: ZCascaderOption[]
}

export interface ZCascaderProps {
  value?: string[]
  options: ZCascaderOption[]
  placeholder?: string
  disabled?: boolean
  expandTrigger?: 'click' | 'hover'
  placement?: Placement
  separator?: string
  /** 字号尺寸 —— `number`(iem 倍数,默认 1)。同 ZInput。2026-05-24 B7。 */
  size?: number
  /** 高度 —— `number`(iem 倍数,可选,默认 `size * 2`)。 */
  height?: number
  /**
   * 单个 option 行高 —— iem 倍数。默认 `2`(2iem = 32px @ 16px iem)。
   * 每级 panel 由 `ZVirtualList` 渲染(2026-05-24 v2)。
   */
  optionSize?: number
  /**
   * 每级 panel 最大高度 —— iem 倍数。默认 `17.5`(17.5iem = 280px @ 16px iem)。
   */
  columnMaxHeight?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCascaderEmits {
  (e: 'update:value', value: string[]): void
  (e: 'change', value: string[], labels: string[]): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyInputSize } from '../_internal/input-size'
import { usePopper, useEscapeStack, useZIem } from '../_hooks'
import { useZLocale } from '../provider/locale/useZLocale'
import { BuiltinIcons, ZIcon } from '../gene'
import ZVirtualList from '../display/ZVirtualList.vue'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ trigger  inline-flex / center / gap _tiny        │   min-width: 12iem(路径文本通常较长)
 *   │   font-size: `size` iem                          │   默认 size=1(16px @ 1080p)
 *   │   height: `height` iem                           │   默认 height=size*2=2iem(32px)
 *   │   padding-y: size*0.375 iem                      │   = 0.375iem(6px)
 *   │   padding-x: size*0.75 iem                       │   = 0.75iem(12px)
 *   │   border-radius: size*0.25 iem                   │   = 0.25iem(4px)
 *   │   border _thin solid (_primary open / _border) / bg _bg / color _text
 *   │  ┌──────────────────────────┐ ┌────────┐         │
 *   │  │ 文本(路径 separator)   │ │ arrow ▼│         │   text: 无值 _textSecondary
 *   │  │  无选中 _textSecondary  │ │ rotate │         │
 *   │  └──────────────────────────┘ └────────┘         │
 *   └──────────────────────────────────────────────────┘
 *           │ floating-ui(offset 4)
 *           ▼
 *   ┌──────────────────────────────────────────────────────┐
 *   │ popper(Teleport body)flex 横向多列                │   bg _bg / border _thin _border
 *   │   ┌─────────┐ ┌─────────┐ ┌─────────┐               │   boxShadow _middle
 *   │   │ col 0   │ │ col 1   │ │ col 2 …  │              │   border-radius _small
 *   │   │ min 8iem│ │ min 8iem│ │ min 8iem │              │   每列:
 *   │   │ max 17.5│ │ max 17.5│ │ max 17.5 │              │     min-width 8iem
 *   │   │ pad _tiny│ │border-r │ │ 最后无 br│              │     max-height 17.5iem
 *   │   │ border-r │ │ _thin   │ │           │              │     overflow-y auto
 *   │   │  ┌────┐ │ │  ┌────┐  │ │           │              │     border-r _thin _border
 *   │   │  │opt │ │ │  │opt │  │ │           │              │
 *   │   │  │ ▶ │ │ │  │ ▶ │  │ │           │              │   option:
 *   │   │  └────┘ │ │  └────┘  │ │           │              │     active: bg _primary.alpha(8)
 *   │   └─────────┘ └─────────┘ └─────────┘               │     非叶子右侧 chevronRight
 *   └──────────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → trigger 所有 iem 维度等比缩(popper 走固定 spacing token,不缩)。
 * height 可独立覆盖。非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZCascaderProps>(), {
  disabled: false,
  expandTrigger: 'click',
  placement: 'bottom-start',
  separator: ' / ',
  size: 1,
  optionSize: 2,
  columnMaxHeight: 17.5,
})

const emit = defineEmits<ZCascaderEmits>()

const theme = useZTheme()
const selectLocale = useZLocale('select')
const effectivePlaceholder = computed(() => props.placeholder ?? selectLocale.value.placeholder)

const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
const open = ref(false)
// 活跃路径:每个 column 选中的 value
const activePath = ref<string[]>(props.value ?? [])

const { floatingStyles } = usePopper(triggerRef, popperRef, {
  placement: computed(() => props.placement),
  offset: 4,
})

useEscapeStack(
  () => {
    if (open.value) open.value = false
  },
  { enabled: open },
)

onClickOutside(triggerRef, (e: Event) => {
  if (!open.value) return
  if (popperRef.value && e.target && popperRef.value.contains(e.target as Node)) return
  open.value = false
})

const columns = computed<ZCascaderOption[][]>(() => {
  const result: ZCascaderOption[][] = [props.options]
  let current: ZCascaderOption[] | undefined = props.options
  for (const key of activePath.value) {
    const node: ZCascaderOption | undefined = current?.find((o) => o.value === key)
    if (node?.children && node.children.length > 0) {
      result.push(node.children)
      current = node.children
    } else {
      break
    }
  }
  return result
})

function selectedLabels(): string[] {
  const labels: string[] = []
  let level: ZCascaderOption[] | undefined = props.options
  for (const k of props.value ?? []) {
    const node: ZCascaderOption | undefined = level?.find((o) => o.value === k)
    if (!node) break
    labels.push(node.label)
    level = node.children
  }
  return labels
}

const displayText = computed(() => selectedLabels().join(props.separator))

function pickInColumn(colIndex: number, opt: ZCascaderOption): void {
  if (opt.disabled) return
  // 截断到本列 + 添加新选中
  const newPath = [...activePath.value.slice(0, colIndex), opt.value]
  activePath.value = newPath
  if (!opt.children || opt.children.length === 0) {
    // 叶子:提交
    const labels: string[] = []
    let level: ZCascaderOption[] | undefined = props.options
    for (const k of newPath) {
      const n: ZCascaderOption | undefined = level?.find((o) => o.value === k)
      if (!n) break
      labels.push(n.label)
      level = n.children
    }
    emit('update:value', newPath)
    emit('change', newPath, labels)
    open.value = false
  }
}

function toggleOpen(): void {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    activePath.value = props.value ?? []
  }
}

const triggerClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor(open.value ? '_primary' : '_border')
    s.backgroundColor._bg
    s.color._text
    applyInputSize(s, props.size, props.height)
    s.cursor(props.disabled ? 'not-allowed' : 'pointer')
    // 触发器 minWidth: 12iem(级联路径文本一般较长)
    // paddingTop/Bottom: 0.375iem × 2 = 0.75iem 总垂直内边距
    s.minWidth.iem(12)
    if (props.disabled) {
      s.opacity._dim
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

const triggerTextClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    if (!displayText.value) s.color._textSecondary
  }),
)

const popperClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.zIndex._popover
    s.backgroundColor._bg
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.display.flex
  }),
)

const columnClass = computed(() =>
  icss(theme.value, (s) => {
    s.minWidth.iem(8)
    s.borderRightWidth._thin
    s.borderRightStyle.solid
    s.borderRightColor._border
    s.padding._tiny
    s._lastChild((c) => {
      c.borderRightStyle.none
    })
  }),
)

const iemPx = useZIem()
/** 每列虚拟列表实际高度。 */
function columnHeight(col: ZCascaderOption[]): string {
  const totalPx = col.length * props.optionSize * iemPx.value
  const maxPx = props.columnMaxHeight * iemPx.value
  return `${Math.min(totalPx, maxPx)}px`
}

const optionClass = (opt: ZCascaderOption, isActive: boolean): string =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._tiny
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.fontSize._middle
    s.cursor(opt.disabled ? 'not-allowed' : 'pointer')
    if (isActive) {
      s.backgroundColor._primary.alpha(8)
      s.color._primary
    } else {
      s.color._text
      if (!opt.disabled) {
        s._hover((h2) => {
          h2.backgroundColor._textSecondary.alpha(8)
        })
      }
    }
    if (opt.disabled) s.opacity._dim
  })

const arrowClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(open.value ? 'rotate(180deg)' : 'rotate(0deg)')
  }),
)

const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
const rightIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))

const rootRef = ref<HTMLDivElement | null>(null)
function bindRoot(el: unknown): void {
  const node = (el as HTMLDivElement | null) ?? null
  rootRef.value = node
  triggerRef.value = node
}
defineExpose({ rootRef })
</script>

<template>
  <div
    :ref="bindRoot"
    :class="triggerClass"
    role="combobox"
    :aria-expanded="open"
    :aria-disabled="disabled"
    @click="toggleOpen"
  >
    <span :class="triggerTextClass">{{ displayText || effectivePlaceholder }}</span>
    <span :class="arrowClass">
      <component :is="downIcon" />
    </span>
  </div>

  <Teleport to="body">
    <div
      v-if="open"
      ref="popperRef"
      :class="popperClass"
      :style="floatingStyles"
      role="listbox"
    >
      <div v-for="(col, ci) in columns" :key="ci" :class="columnClass">
        <ZVirtualList
          :items="col"
          :item-size="optionSize ?? 2"
          :height="columnHeight(col)"
          key-field="value"
        >
          <template #default="{ item: opt }">
            <div
              :class="optionClass(opt, activePath[ci] === opt.value)"
              role="option"
              :aria-selected="activePath[ci] === opt.value"
              :aria-disabled="opt.disabled"
              @click="pickInColumn(ci, opt)"
            >
              <span>{{ opt.label }}</span>
              <span v-if="opt.children && opt.children.length > 0">
                <component :is="rightIcon" />
              </span>
            </div>
          </template>
        </ZVirtualList>
      </div>
    </div>
  </Teleport>
</template>
