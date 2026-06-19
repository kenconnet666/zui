<script lang="ts">
/**
 * `ZTreeSelect` —— 树形选择(基于 ZSelect 的触发器 + ZTree 下拉)。
 *
 * **API**:
 * - `v-model:value: string | null` —— 选中的 leaf key
 * - `data: ZTreeNode[]` —— 树数据
 * - `defaultExpandedKeys?: string[]`
 * - `placeholder?: string` / `disabled?: boolean` / `clearable?: boolean`
 * - `size?: number` —— 字号尺寸(px 倍数,1 单位 = 16px),默认 1(= 16px)
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { ZTreeNode } from '../display/ZTree.vue'

export interface ZTreeSelectProps {
  value?: string | null
  data: ZTreeNode[]
  defaultExpandedKeys?: string[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  /** 字号尺寸 —— `number`(px 倍数,1 单位 = 16px,默认 1)。同 ZInput。2026-05-24 B7。 */
  size?: number
  /** 高度 —— `number`(px 倍数,1 单位 = 16px,可选,默认 `size * 2`)。 */
  height?: number
  placement?: Placement
  /**
   * 单个 tree 节点行高 —— px 倍数(1 单位 = 16px)。默认 `2`(= 32px)。
   * 透传给内嵌 `ZTree`(2026-05-24 v2)。
   */
  treeItemSize?: number
  /**
   * 浮层 tree 区域高度 —— px 倍数(1 单位 = 16px)。默认 `18`(= 288px)。
   */
  treeHeight?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTreeSelectEmits {
  (e: 'update:value', value: string | null): void
  (e: 'change', value: string | null, node: ZTreeNode | null): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyInputSize } from '../_internal/input-size'
import { usePopper, useEscapeStack } from '../_hooks'
import { useZLocale } from '../provider/locale/useZLocale'
import { BuiltinIcons, ZIcon } from '../gene'
import ZTree from '../display/ZTree.vue'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(px,1 单位 = 16px;number 是 px 倍数,默认 1 单位=16px):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ trigger  inline-flex / center / gap _tiny        │   min-width: 160px(= 10 × 16px,略宽)
 *   │   font-size: sizePx(size)                        │   默认 size=1(16px)
 *   │   height: sizePx(height)                         │   默认 height=size*2=32px
 *   │   padding-y: sizePx(size*0.375)                  │   = 6px
 *   │   padding-x: sizePx(size*0.75)                   │   = 12px
 *   │   border-radius: sizePx(size*0.25)               │   = 4px
 *   │   border _thin solid _border / bg _bg / color _text │ open: borderColor _primary
 *   │                                                  │
 *   │  ┌────────────────┐ ┌─────┐ ┌────────┐           │
 *   │  │ text 选中 label │ │clear│ │ arrow ▼│           │   text: 无选中时 _textSecondary
 *   │  │ flex-grow 1     │ │  ×  │ │ rotate │           │
 *   │  └────────────────┘ └─────┘ └────────┘           │
 *   └──────────────────────────────────────────────────┘
 *           │ floating-ui 定位(offset 4)
 *           ▼
 *   ┌──────────────────────────────────────────────────┐
 *   │ dropdown(Teleport body)                        │   min-width: 192px(容纳层级缩进)
 *   │   min-width: 192px  max-height: 300px           │   max-height: 300px(≈ sizePx(18.75))
 *   │   pad _tiny  border _thin _border  boxShadow _middle│   overflow-y auto
 *   │  ┌──────────────────────────────────────────┐   │
 *   │  │ <ZTree>                                  │   │   ZTree 节点:
 *   │  │  data / expandedKeys / selectedKey 透传  │   │     仅 leaf 触发 commit
 *   │  │  @select → onSelectNode(仅 leaf 提交)  │   │
 *   │  └──────────────────────────────────────────┘   │
 *   └──────────────────────────────────────────────────┘
 *
 * 用户改 size 数字 → trigger 所有 px 维度等比缩(dropdown 走固定 spacing token,不缩)。
 * height 可独立覆盖。非标准单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZTreeSelectProps>(), {
  value: null,
  defaultExpandedKeys: () => [],
  disabled: false,
  clearable: false,
  size: 1,
  placement: 'bottom-start',
  treeItemSize: 2,
  treeHeight: 18,
})

const emit = defineEmits<ZTreeSelectEmits>()

const theme = useZTheme()
const selectLocale = useZLocale('select')
const effectivePlaceholder = computed(() => props.placeholder ?? selectLocale.value.placeholder)

const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const open = ref(false)
const expandedKeys = ref<string[]>([...props.defaultExpandedKeys])

const { floatingStyles } = usePopper(triggerRef, dropdownRef, {
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
  if (dropdownRef.value && e.target && dropdownRef.value.contains(e.target as Node)) return
  open.value = false
})

function findNode(nodes: ZTreeNode[], key: string): ZTreeNode | null {
  for (const n of nodes) {
    if (n.key === key) return n
    if (n.children) {
      const c = findNode(n.children, key)
      if (c) return c
    }
  }
  return null
}

const selectedLabel = computed(() => {
  if (props.value == null) return ''
  const node = findNode(props.data, props.value)
  return node?.label ?? String(props.value)
})

function toggleOpen(): void {
  if (props.disabled) return
  open.value = !open.value
}

function onSelectNode(key: string, node: ZTreeNode): void {
  // 仅叶子节点触发 commit;非叶子留作 expand(由 ZTree 自管)
  if (node.children && node.children.length > 0) return
  emit('update:value', key)
  emit('change', key, node)
  open.value = false
}

function onClear(e: Event): void {
  e.stopPropagation()
  emit('update:value', null)
  emit('change', null, null)
}

watch(
  () => props.value,
  () => {
    // 选中变 → 关闭(已在 onSelectNode 处理,这里防外部 reset)
  },
)

const triggerClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    if (open.value) s.borderColor._primary
    else s.borderColor._border
    s.backgroundColor._bg
    s.color._text
    s.transitionProperty._colors
    s.transitionDuration._small
    applyInputSize(s, props.size, props.height)
    s.cursor(props.disabled ? 'not-allowed' : 'pointer')
    // 触发器 minWidth: 160px(= sizePx(10),略宽于 ZSelect 128px,树标签通常更长)
    s.minWidth.px(sizePx(10))
    if (props.disabled) {
      s.opacity._dim
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

const textClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    if (!selectedLabel.value) s.color._textSecondary
  }),
)

const dropdownClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.zIndex._popover
    s.backgroundColor._bg
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.padding._tiny
    s.minWidth.px(sizePx(12))
  }),
)

const arrowClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(open.value ? 'rotate(180deg)' : 'rotate(0deg)')
  }),
)

const clearBtnClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding.px(0)
    s.color._textSecondary
    s._hover(h2 => {
      h2.color._text
    })
  }),
)

const showClear = computed(() => props.clearable && !props.disabled && props.value !== null)

const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))

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
    <span :class="textClass">{{ selectedLabel || effectivePlaceholder }}</span>
    <button
      v-if="showClear"
      type="button"
      :class="clearBtnClass"
      aria-label="清空"
      tabindex="-1"
      @click.stop="onClear"
    >
      <component :is="closeIcon" />
    </button>
    <span :class="arrowClass">
      <component :is="downIcon" />
    </span>
  </div>

  <Teleport to="body">
    <div
      v-if="open"
      ref="dropdownRef"
      :class="dropdownClass"
      :style="floatingStyles"
      role="listbox"
    >
      <ZTree
        :data="data"
        :expanded-keys="expandedKeys"
        :selected-key="value ?? null"
        :item-size="treeItemSize ?? 2"
        :height="treeHeight ?? 18"
        @update:expanded-keys="expandedKeys = $event"
        @select="onSelectNode"
      />
    </div>
  </Teleport>
</template>
