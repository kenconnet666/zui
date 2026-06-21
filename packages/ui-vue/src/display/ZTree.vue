<script lang="ts">
/**
 * `ZTree` —— 树形数据展示(可选 + 可展开)。
 *
 * **API**:
 * - `data: ZTreeNode[]` —— 树数据
 * - `v-model:expandedKeys` —— 展开的 key 数组
 * - `v-model:selectedKey` —— 单选 key(null = 未选)
 * - `selectable?: boolean` —— 是否允许选中,默认 true
 *
 * **a11y**:`role="tree"` + 节点 `role="treeitem"` + `aria-expanded`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZTreeNode {
  key: string
  label: string
  disabled?: boolean
  children?: ZTreeNode[]
}

export interface ZTreeProps {
  data: ZTreeNode[]
  expandedKeys?: string[]
  selectedKey?: string | null
  selectable?: boolean
  /**
   * 单节点行高 —— px 倍数(1 单位 = 16px)。默认 `2`(= 32px)。
   * 扁平化展开后用 `ZVirtualList` 渲染(2026-05-24 v2)。
   */
  itemSize?: number
  /**
   * 容器高度 —— px 倍数(1 单位 = 16px)或 CSS 字面字符串(`'60vh'` / `'400px'`)。**必传**。
   */
  height: number | string
  /** 预渲染缓冲项数。默认 `5`。 */
  overscan?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTreeEmits {
  (e: 'update:expandedKeys', keys: string[]): void
  (e: 'update:selectedKey', key: string | null): void
  (e: 'select', key: string, node: ZTreeNode): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'
import ZVirtualList from './ZVirtualList.vue'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(纯 px,1 单位 = 16px):
 *
 *   ┌────────────────────────────────────────────────────┐
 *   │ ZTree root  flex column / _text / fontSize _middle │
 *   │                                                    │
 *   │  ┌─────────────────────────────────────────────┐   │
 *   │  │ node row(每个 visibleNode)                │   │   pad-y: _tiny
 *   │  │   pad-l: 8px + depth × 16px(层级缩进)    │   │   pad-r: _small
 *   │  │   pad-r: _small,border-radius _tiny        │   │   selected:
 *   │  │   flex / center / gap _tiny                 │   │     bg _primary.alpha(8)
 *   │  │                                             │   │     color _primary
 *   │  │  ┌────┐ ┌─────────┐                         │   │   hover(非 disabled):
 *   │  │  │ ▶  │ │ label   │                         │   │     bg _textSecondary.alpha(8)
 *   │  │  │16px│ │ #text   │                         │   │
 *   │  │  └────┘ └─────────┘                         │   │   arrow: 16px 正方形
 *   │  │   ↑                                         │   │     transform rotate 0/90
 *   │  │   有子节点 chevron(旋转) / 无 spacer 占位 │   │     无子: spacer 16px 宽
 *   │  └─────────────────────────────────────────────┘   │
 *   │  (扁平化展开后逐行渲染,disabled → opacity _dim)  │
 *   └────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZTreeProps>(), {
  expandedKeys: () => [],
  selectedKey: null,
  selectable: true,
  itemSize: 2,
  overscan: 5,
})

const emit = defineEmits<ZTreeEmits>()

const theme = useZTheme()

function isExpanded(key: string): boolean {
  return props.expandedKeys.includes(key)
}

function toggleExpand(key: string): void {
  const cur = props.expandedKeys
  const next = cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key]
  emit('update:expandedKeys', next)
}

function selectNode(node: ZTreeNode): void {
  if (!props.selectable || node.disabled) return
  emit('update:selectedKey', node.key)
  emit('select', node.key, node)
}

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize._middle
    props.css?.(s)
  }),
)

const nodeRowClass = (node: ZTreeNode, depth: number): string => {
  const isSelected = props.selectedKey === node.key
  return icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.gap._tiny
    s.cursor(node.disabled ? 'not-allowed' : 'pointer')
    s.paddingTop._tiny
    s.paddingBottom._tiny
    s.paddingLeft.px(sizePx(0.5 + depth * 1))
    s.paddingRight._small
    s.borderRadius._tiny
    if (isSelected) {
      s.backgroundColor._primary.alpha(16)
      s.color._primary
      s.fontWeight._medium
    }
    if (node.disabled) {
      s.opacity._dim
    } else {
      s._hover(h2 => {
        if (!isSelected) h2.backgroundColor._bgHover
      })
    }
  })
}

const arrowClass = (expanded: boolean): string =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.px(sizePx(1))
    s.height.px(sizePx(1))
    s.flexShrink(0)
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(expanded ? 'rotate(90deg)' : 'rotate(0deg)')
  })

const arrowSpacerClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineBlock
    s.width.px(sizePx(1))
    s.flexShrink(0)
  }),
)

const rightIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))

/** label 文字截断 —— 防止深层缩进后溢出。 */
const labelSpanClass = computed(() =>
  icss(theme.value, s => {
    s.overflow.hidden
    s.textOverflow.ellipsis
    s.whiteSpace.nowrap
    s.minWidth.px(0)
  }),
)

interface FlatNode {
  node: ZTreeNode
  depth: number
}

function flatten(nodes: ZTreeNode[], depth: number, out: FlatNode[]): void {
  for (const node of nodes) {
    out.push({ node, depth })
    if (node.children && isExpanded(node.key)) {
      flatten(node.children, depth + 1, out)
    }
  }
}

const visibleNodes = computed<FlatNode[]>(() => {
  const out: FlatNode[] = []
  flatten(props.data, 0, out)
  return out
})

function hasChildren(node: ZTreeNode): boolean {
  return !!node.children && node.children.length > 0
}

function onNodeClick(node: ZTreeNode): void {
  if (hasChildren(node)) toggleExpand(node.key)
  selectNode(node)
}
</script>

<template>
  <div :class="rootClass" role="tree">
    <ZVirtualList
      :items="visibleNodes"
      :item-size="itemSize ?? 2"
      :height="height"
      :overscan="overscan ?? 5"
      key-field="key"
    >
      <template #default="{ item }">
        <div
          :class="nodeRowClass(item.node, item.depth)"
          role="treeitem"
          :aria-expanded="hasChildren(item.node) ? isExpanded(item.node.key) : undefined"
          :aria-selected="selectedKey === item.node.key"
          :aria-disabled="item.node.disabled"
          @click="onNodeClick(item.node)"
        >
          <span v-if="hasChildren(item.node)" :class="arrowClass(isExpanded(item.node.key))">
            <component :is="rightIcon" />
          </span>
          <span v-else :class="arrowSpacerClass" />
          <span :class="labelSpanClass">{{ item.node.label }}</span>
        </div>
      </template>
    </ZVirtualList>
  </div>
</template>
