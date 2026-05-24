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

const props = withDefaults(defineProps<ZTreeProps>(), {
  expandedKeys: () => [],
  selectedKey: null,
  selectable: true,
})

const emit = defineEmits<ZTreeEmits>()

const theme = useZTheme()

function isExpanded(key: string): boolean {
  return props.expandedKeys.includes(key)
}

function toggleExpand(key: string): void {
  const cur = props.expandedKeys
  const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]
  emit('update:expandedKeys', next)
}

function selectNode(node: ZTreeNode): void {
  if (!props.selectable || node.disabled) return
  emit('update:selectedKey', node.key)
  emit('select', node.key, node)
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize._middle
    props.css?.(s)
  }),
)

function nodeRowClass(node: ZTreeNode, depth: number): string {
  const isSelected = props.selectedKey === node.key
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._tiny
    s.cursor(node.disabled ? 'not-allowed' : 'pointer')
    s.paddingTop._tiny
    s.paddingBottom._tiny
    s.paddingLeft.iem(0.5 + depth * 1)
    s.paddingRight._small
    s.borderRadius._tiny
    if (isSelected) {
      s.backgroundColor._primary.alpha(8)
      s.color._primary
      s.fontWeight._medium
    }
    if (node.disabled) {
      s.opacity._dim
    } else {
      s._hover((h2) => {
        if (!isSelected) h2.backgroundColor._textSecondary.alpha(8)
      })
    }
  })
}

/**
 * 展开/收起箭头图标盒子模型(iem):
 * - width/height: 1iem,正方形(放置 chevron 旋转动画)
 */
const arrowClass = (expanded: boolean): string =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.iem(1)
    s.height.iem(1)
    s.flexShrink(0)
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(expanded ? 'rotate(90deg)' : 'rotate(0deg)')
  })

/**
 * 无子节点时的占位:width = 1iem(与 arrow 同宽,保证层级对齐)。
 */
const arrowSpacerClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineBlock
    s.width.iem(1)
    s.flexShrink(0)
  }),
)

const rightIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))

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
    <div
      v-for="{ node, depth } in visibleNodes"
      :key="node.key"
      :class="nodeRowClass(node, depth)"
      role="treeitem"
      :aria-expanded="hasChildren(node) ? isExpanded(node.key) : undefined"
      :aria-selected="selectedKey === node.key"
      :aria-disabled="node.disabled"
      @click="onNodeClick(node)"
    >
      <span v-if="hasChildren(node)" :class="arrowClass(isExpanded(node.key))">
        <component :is="rightIcon" />
      </span>
      <span v-else :class="arrowSpacerClass" />
      <span>{{ node.label }}</span>
    </div>
  </div>
</template>
